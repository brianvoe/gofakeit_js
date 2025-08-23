import { describe, it, expect } from 'vitest'
import { fetchGofakeitData, fetchRandomString } from '../api'

describe('API Functions', () => {
  describe('fetchGofakeitData', () => {
    it('should fetch data successfully', async () => {
      const result = await fetchGofakeitData('word')

      expect(result.success).toBe(true)
      expect(result.data).toBeTruthy()
      expect(typeof result.data).toBe('string')
    })

    it('should handle API errors for invalid function', async () => {
      const result = await fetchGofakeitData('invalid-function-name-that-does-not-exist')

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })

  describe('fetchRandomString', () => {
    it('should fetch random string data', async () => {
      const result = await fetchRandomString(['test1', 'test2', 'test3'])

      expect(result.success).toBe(true)
      expect(result.data).toBeTruthy()
      expect(typeof result.data).toBe('string')
    })
  })
})
