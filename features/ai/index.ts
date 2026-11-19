/**
 * Minimal, dependency-free client for OpenAI-compatible Chat Completions APIs.
 *
 * Works against the official OpenAI API and OpenRouter, which share the same
 * request and response shape:
 * https://platform.openai.com/docs/api-reference/chat/create
 */

import { isReasoningModel, resolveProviders, type AiTier, type ProviderConfig } from './providers';

export type { AiTier } from './providers';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatCompletionOptions = {
  messages: ChatMessage[];
  tier: AiTier;
  temperature?: number;
  maxTokens?: number;
};

export type ChatCompletionResult = {
  text: string;
  provider: ProviderConfig['id'];
  model: string;
  /** True when the model stopped because it ran out of output tokens. */
  truncated: boolean;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null;
};

type ChatCompletionResponse = {
  model?: string;
  choices?: { message?: { content?: string | null }; finish_reason?: string | null }[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  error?: { message?: string };
};

const REQUEST_TIMEOUT_MS = 90_000;
/**
 * Free OpenRouter models cost nothing per token, and the router may pick a
 * reasoning model whose hidden thinking counts toward the limit. A generous
 * ceiling avoids cut-off reviews; visible length is governed by the prompt.
 */
const OPENROUTER_MAX_TOKENS = 6_000;

function buildRequestBody(provider: ProviderConfig, options: ChatCompletionOptions) {
  const [primaryModel, ...fallbackModels] = provider.models;
  const maxTokens = options.maxTokens ?? 1500;
  const reasoning = isReasoningModel(primaryModel);

  const body: Record<string, unknown> = {
    model: primaryModel,
    messages: options.messages,
  };

  if (provider.id === 'openai') {
    // `max_completion_tokens` replaces the deprecated `max_tokens` on OpenAI.
    // Reasoning models need headroom because hidden reasoning counts toward it.
    body.max_completion_tokens = reasoning ? maxTokens * 4 : maxTokens;
    if (reasoning) {
      body.reasoning_effort = 'low';
    } else {
      body.temperature = options.temperature ?? 0.2;
    }
  } else {
    body.max_tokens = Math.max(maxTokens, OPENROUTER_MAX_TOKENS);
    body.temperature = options.temperature ?? 0.2;
    // Keep any hidden reasoning short and out of the returned content.
    body.reasoning = { effort: 'low', exclude: true };
    if (fallbackModels.length > 0) {
      // OpenRouter retries the next model when one is rate limited or down.
      body.models = provider.models;
    }
  }

  return body;
}

async function callProvider(
  provider: ProviderConfig,
  options: ChatCompletionOptions,
): Promise<ChatCompletionResult> {
  const response = await fetch(provider.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
      ...provider.headers,
    },
    body: JSON.stringify(buildRequestBody(provider, options)),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const raw = await response.text();
  let data: ChatCompletionResponse = {};
  try {
    data = JSON.parse(raw) as ChatCompletionResponse;
  } catch {
    // Non-JSON error page; handled below.
  }

  if (!response.ok || data.error) {
    const detail = data.error?.message ?? raw.slice(0, 300);
    throw new Error(`${provider.label} request failed (${response.status}): ${detail}`);
  }

  const choice = data.choices?.[0];
  const text = choice?.message?.content?.trim() ?? '';
  if (!text) {
    throw new Error(`${provider.label} returned an empty completion.`);
  }

  return {
    text,
    provider: provider.id,
    model: data.model ?? provider.models[0],
    truncated: choice?.finish_reason === 'length',
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : null,
  };
}

/**
 * Runs a chat completion against the providers configured for the tier,
 * falling through to the next provider when one fails.
 */
export async function createChatCompletion(
  options: ChatCompletionOptions,
): Promise<ChatCompletionResult> {
  const providers = resolveProviders(options.tier);
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      return await callProvider(provider, options);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(message);
      console.warn(`[ai] ${provider.label} failed, trying next provider if available: ${message}`);
    }
  }

  throw new Error(`All AI providers failed. ${errors.join(' | ')}`);
}
