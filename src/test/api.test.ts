import { describe, it, expect } from 'vitest'
import { callFunc } from '../api'

describe('API Functions', () => {
  describe('callFunc', () => {
  it('should fetch data successfully', async () => {
    const result = await callFunc('word')

      expect(result.success).toBe(true)
      expect(result.data).toBeTruthy()
      expect(typeof result.data).toBe('string')
    })

    it('should handle API errors for invalid function', async () => {
      const result = await callFunc('invalid-function-name-that-does-not-exist')

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })


})
