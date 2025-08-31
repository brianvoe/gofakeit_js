import { beforeAll, vi } from 'vitest'

// Mock Chrome API for autofill tests
beforeAll(() => {
  (globalThis as any).chrome = {
    storage: {
      sync: {
        get: vi.fn((_keys: any, callback: any) => {
          callback({ gofakeitSmartFill: true })
        })
      }
    }
  } as any;
  
  // Disable staggered timing for tests to keep them fast
  // This can be overridden in individual tests if needed
  (globalThis as any).__GOFAKEIT_TEST_MODE__ = true;
})
