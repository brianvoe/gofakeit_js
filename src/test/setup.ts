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
  }
})
