import type { RetryAsyncOptions } from "@/interface/common";

export type { RetryAsyncOptions };

/**
 * 对异步操作按次数重试；全部失败后抛出最后一次错误。
 */
export async function retryAsync<T>(fn: () => Promise<T>, options: RetryAsyncOptions): Promise<T> {
  const maxAttempts = Math.max(1, options.maxAttempts);
  const delayMs = options.delayMs ?? 0;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) {
        break;
      }
      options.onRetry?.({ attempt, maxAttempts, error });
      if (delayMs > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}
