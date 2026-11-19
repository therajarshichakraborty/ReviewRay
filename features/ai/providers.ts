/**
 * LLM provider registry.
 *
 * ReviewRay talks to two OpenAI-compatible Chat Completions endpoints:
 *
 * - OpenRouter: serves the Free plan, using free community models.
 * - OpenAI:     serves the Pro plan, using the official OpenAI API.
 *
 * Everything is driven by environment variables, so switching models or
 * enabling OpenAI later never requires a code change. See `.env.example`.
 */

export type ProviderId = 'openai' | 'openrouter';

/** Billing tier the review is generated for. Decides which provider is preferred. */
export type AiTier = 'free' | 'pro';

export type ProviderConfig = {
  id: ProviderId;
  label: string;
  endpoint: string;
  apiKey: string;
  /** Ordered model list. The first is primary; the rest are fallbacks. */
  models: string[];
  headers: Record<string, string>;
};

const DEFAULT_OPENAI_MODEL = 'gpt-4.1-mini';

/** Strong free models first, then OpenRouter's free router as a last resort. */
const DEFAULT_OPENROUTER_MODELS = [
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openrouter/free',
];

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function readList(name: string): string[] {
  return (readEnv(name) ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function getOpenAiConfig(): ProviderConfig | null {
  const apiKey = readEnv('OPENAI_API_KEY');
  if (!apiKey) return null;

  return {
    id: 'openai',
    label: 'OpenAI',
    endpoint: `${readEnv('OPENAI_BASE_URL') ?? 'https://api.openai.com/v1'}/chat/completions`,
    apiKey,
    models: [readEnv('OPENAI_MODEL') ?? DEFAULT_OPENAI_MODEL],
    headers: {},
  };
}

function getOpenRouterConfig(): ProviderConfig | null {
  const apiKey = readEnv('OPENROUTER_API_KEY');
  if (!apiKey) return null;

  const primary = readEnv('OPENROUTER_MODEL');
  const fallbacks = readList('OPENROUTER_FALLBACK_MODELS');
  const models = primary ? unique([primary, ...fallbacks]) : DEFAULT_OPENROUTER_MODELS;

  return {
    id: 'openrouter',
    label: 'OpenRouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey,
    // OpenRouter accepts at most 3 models in a fallback chain.
    models: models.slice(0, 3),
    headers: {
      'HTTP-Referer':
        readEnv('NEXT_PUBLIC_APP_URL') ?? readEnv('BETTER_AUTH_URL') ?? 'https://reviewray.dev',
      'X-Title': 'ReviewRay',
    },
  };
}

/**
 * Returns the providers to try, in order, for a given tier.
 *
 * - Pro:  OpenAI first. Falls back to OpenRouter if OpenAI is not configured
 *         yet or fails, so Pro users are never left without a review.
 * - Free: OpenRouter only. OpenAI is used for free users solely when OpenRouter
 *         is not configured at all, so paid credits are never spent by accident.
 */
export function resolveProviders(tier: AiTier): ProviderConfig[] {
  const openai = getOpenAiConfig();
  const openrouter = getOpenRouterConfig();

  const chain = tier === 'pro' ? [openai, openrouter] : [openrouter ?? openai];
  const providers = chain.filter((provider): provider is ProviderConfig => provider !== null);

  if (providers.length === 0) {
    throw new Error(
      'No AI provider configured. Set OPENROUTER_API_KEY (free plan) and/or OPENAI_API_KEY (pro plan).',
    );
  }

  return providers;
}

/**
 * Reasoning models (o-series, gpt-5 family) reject a custom temperature and
 * spend part of the completion budget on hidden reasoning tokens.
 */
export function isReasoningModel(model: string): boolean {
  return /^(openai\/)?(o\d|gpt-5)/i.test(model);
}
