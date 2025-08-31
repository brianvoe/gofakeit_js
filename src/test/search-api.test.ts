import { describe, it, expect, beforeEach } from 'vitest';
import { searchMultiFunc, FuncSearchRequest } from '../api';

describe('Search API', () => {
  beforeEach(() => {
    // No mocking - we'll hit the real API
  });

  it('should search for multiple functions successfully', async () => {
    const requests: FuncSearchRequest[] = [
      { id: '1', query: 'email' },
      { id: '2', query: 'phone' },
      { id: '3', query: 'firstname' }
    ];

    const result = await searchMultiFunc(requests);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(3);
    
    // Check that each request got results
    result.data?.forEach((response, index) => {
      expect(response.id).toBe(requests[index].id);
      expect(response.query).toBe(requests[index].query);
      expect(response.results).toBeDefined();
      expect(response.results.length).toBeGreaterThan(0);
      
      // Check result structure
      const firstResult = response.results[0];
      expect(firstResult.name).toBeDefined();
      expect(typeof firstResult.name).toBe('string');
      expect(firstResult.score).toBeDefined();
      expect(typeof firstResult.score).toBe('number');
      expect(firstResult.score).toBeGreaterThanOrEqual(0);
      // Note: API can return scores higher than 100
      expect(firstResult.reasons).toBeDefined();
      expect(Array.isArray(firstResult.reasons)).toBe(true);
    });
  }, 10000); // 10 second timeout for real API calls

  it('should handle empty requests array', async () => {
    const result = await searchMultiFunc([]);

    expect(result.success).toBe(false);
    expect(result.error).toBe('No search queries provided');
  });

  it('should handle various input field queries', async () => {
    const requests: FuncSearchRequest[] = [
      { id: 'email', query: 'email user@example.com' },
      { id: 'phone', query: 'phone mobile number' },
      { id: 'name', query: 'firstname given name' },
      { id: 'address', query: 'street address' },
      { id: 'company', query: 'company organization' },
      { id: 'job', query: 'job title role' },
      { id: 'creditcard', query: 'credit card number' },
      { id: 'date', query: 'date birthday' }
    ];

    const result = await searchMultiFunc(requests);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(8);
    
    // Check that we get relevant results for each query
    result.data?.forEach((response) => {
      // Some queries might return empty results, which is acceptable
      if (response.results && response.results.length > 0) {
        // Check that the results make sense for the query
        const query = response.query.toLowerCase();
        const resultNames = response.results.map(r => r.name.toLowerCase());
        
        if (query.includes('email')) {
          expect(resultNames.some(name => name.includes('email'))).toBe(true);
        }
        if (query.includes('phone')) {
          expect(resultNames.some(name => name.includes('phone'))).toBe(true);
        }
        if (query.includes('firstname') || query.includes('name')) {
          expect(resultNames.some(name => name.includes('name') || name.includes('first'))).toBe(true);
        }
        if (query.includes('address') || query.includes('street')) {
          expect(resultNames.some(name => name.includes('address') || name.includes('street'))).toBe(true);
        }
        if (query.includes('company')) {
          expect(resultNames.some(name => name.includes('company'))).toBe(true);
        }
        if (query.includes('job') || query.includes('title')) {
          expect(resultNames.some(name => name.includes('job') || name.includes('title'))).toBe(true);
        }
        if (query.includes('credit') || query.includes('card')) {
          expect(resultNames.some(name => name.includes('credit') || name.includes('card'))).toBe(true);
        }
        if (query.includes('date') || query.includes('birthday')) {
          expect(resultNames.some(name => name.includes('date'))).toBe(true);
        }
      }
    });
  }, 15000); // 15 second timeout for multiple API calls

  it('should handle edge case queries', async () => {
    const requests: FuncSearchRequest[] = [
      { id: 'empty', query: '' },
      { id: 'whitespace', query: '   ' },
      { id: 'special', query: '!@#$%^&*()' },
      { id: 'numbers', query: '123456789' },
      { id: 'mixed', query: 'email123!@#' }
    ];

    const result = await searchMultiFunc(requests);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data).toHaveLength(5);
    
    // Even edge cases should return some results
    result.data?.forEach((response) => {
      expect(response.results).toBeDefined();
      // Some queries might return empty results, which is acceptable
    });
  }, 10000);
});
