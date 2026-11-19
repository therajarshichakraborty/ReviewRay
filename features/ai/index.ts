/**
 * Official OpenAI API Documentation Client.
 *
 * Implements direct communication with OpenAI's official Chat Completions API:
 * https://platform.openai.com/docs/api-reference/chat/create
 *
 * Designed for minimal token consumption, low latency, and zero dependency version conflicts.
 */

export const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenAiCompletionOptions = {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export type OpenAiCompletionResult = {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

/**
 * Executes a chat completion against OpenAI's official /v1/chat/completions endpoint.
 * Fallbacks gracefully to OpenRouter if OPENAI_API_KEY is unset and OPENROUTER_API_KEY is present.
 */
export async function createChatCompletion(
  options: OpenAiCompletionOptions,
): Promise<OpenAiCompletionResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = options.model || DEFAULT_OPENAI_MODEL;

  // If OPENAI_API_KEY is provided, use official OpenAI API endpoint
  if (apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 1600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API call failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    return {
      text: content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  // Graceful fallback to OpenRouter if user hasn't supplied OPENAI_API_KEY yet
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://reviewray.com',
        'X-Title': 'ReviewRay Code Reviewer',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: options.messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 1600,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Fallback OpenRouter API call failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    return {
      text: content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  throw new Error(
    'No AI API key found. Please configure OPENAI_API_KEY in your .env file.',
  );
}
