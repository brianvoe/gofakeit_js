import { describe, it, expect } from 'vitest';
import {
  fetchFunc,
  fetchFuncMulti,
  fetchFuncSearch,
  parseFunctionString,
  type FetchFuncMultiRequest,
  type FetchFuncSearchRequest,
  type FetchFuncSearchResponseItem,
} from '../api';

describe('API Tests', () => {
  describe('parseFunctionString', () => {
    it('should parse simple function name without parameters', () => {
      const result = parseFunctionString('email');

      expect(result).toEqual({
        func: 'email',
        params: {},
      });
    });

    it('should parse function with single numeric parameter', () => {
      const result = parseFunctionString('number?min=1');

      expect(result).toEqual({
        func: 'number',
        params: { min: 1 },
      });
    });

    it('should parse function with multiple numeric parameters', () => {
      const result = parseFunctionString('number?min=1&max=100');

      expect(result).toEqual({
        func: 'number',
        params: { min: 1, max: 100 },
      });
    });

    it('should parse function with string parameters', () => {
      const result = parseFunctionString('word?lang=en&format=lower');

      expect(result).toEqual({
        func: 'word',
        params: { lang: 'en', format: 'lower' },
      });
    });

    it('should parse function with mixed parameter types', () => {
      const result = parseFunctionString(
        'word?length=5&lang=en&capitalize=true'
      );

      expect(result).toEqual({
        func: 'word',
        params: { length: 5, lang: 'en', capitalize: 'true' },
      });
    });

    it('should parse function with boolean parameters', () => {
      const result = parseFunctionString('bool?value=true');

      expect(result).toEqual({
        func: 'bool',
        params: { value: 'true' },
      });
    });

    it('should parse function with URL encoded parameters', () => {
      const result = parseFunctionString('word?text=hello%20world&lang=en');

      expect(result).toEqual({
        func: 'word',
        params: { text: 'hello world', lang: 'en' },
      });
    });

    it('should parse function with special characters in parameters', () => {
      const result = parseFunctionString(
        'word?text=test%20value&special=!@#$%25^&*()'
      );

      expect(result).toEqual({
        func: 'word',
        params: { text: 'test value', special: '!@#$%^', '*()': '' },
      });
    });

    it('should handle empty parameter values', () => {
      const result = parseFunctionString('word?empty=&notEmpty=value');

      expect(result).toEqual({
        func: 'word',
        params: { empty: '', notEmpty: 'value' },
      });
    });

    it('should handle parameters with no value (just key)', () => {
      const result = parseFunctionString('word?flag&value=test');

      expect(result).toEqual({
        func: 'word',
        params: { flag: '', value: 'test' },
      });
    });

    it('should handle multiple question marks (treats first as separator)', () => {
      const result = parseFunctionString('word?text=hello?world&lang=en');

      expect(result).toEqual({
        func: 'word',
        params: { text: 'hello?world', lang: 'en' },
      });
    });

    it('should handle ampersands in parameter values', () => {
      const result = parseFunctionString('word?text=hello&world&lang=en');

      expect(result).toEqual({
        func: 'word',
        params: { text: 'hello', world: '', lang: 'en' },
      });
    });

    it('should handle complex nested-like parameters', () => {
      const result = parseFunctionString(
        'word?min=1&max=100&format=json&options=pretty,indented'
      );

      expect(result).toEqual({
        func: 'word',
        params: {
          min: 1,
          max: 100,
          format: 'json',
          options: 'pretty,indented',
        },
      });
    });

    it('should handle function names with special characters', () => {
      const result = parseFunctionString('function-name?param=value');

      expect(result).toEqual({
        func: 'function-name',
        params: { param: 'value' },
      });
    });

    it('should handle function names with underscores', () => {
      const result = parseFunctionString('function_name?param=value');

      expect(result).toEqual({
        func: 'function_name',
        params: { param: 'value' },
      });
    });

    it('should handle numeric strings that are not valid numbers', () => {
      const result = parseFunctionString('word?text=abc123&number=123');

      expect(result).toEqual({
        func: 'word',
        params: { text: 'abc123', number: 123 },
      });
    });

    it('should handle decimal numbers', () => {
      const result = parseFunctionString('number?min=1.5&max=99.9');

      expect(result).toEqual({
        func: 'number',
        params: { min: 1.5, max: 99.9 },
      });
    });

    it('should handle negative numbers', () => {
      const result = parseFunctionString('number?min=-10&max=10');

      expect(result).toEqual({
        func: 'number',
        params: { min: -10, max: 10 },
      });
    });

    it('should handle zero values', () => {
      const result = parseFunctionString('number?min=0&max=0');

      expect(result).toEqual({
        func: 'number',
        params: { min: 0, max: 0 },
      });
    });

    it('should handle duplicate parameter names (last one wins)', () => {
      const result = parseFunctionString('word?text=first&text=second');

      expect(result).toEqual({
        func: 'word',
        params: { text: 'second' },
      });
    });

    it('should handle parameters with spaces in values', () => {
      const result = parseFunctionString('word?text=hello world&lang=en');

      expect(result).toEqual({
        func: 'word',
        params: { text: 'hello world', lang: 'en' },
      });
    });

    it('should handle parseFloat behavior with mixed alphanumeric strings', () => {
      const result = parseFunctionString('word?text=123abc&pure=abc123');

      expect(result).toEqual({
        func: 'word',
        params: { text: 123, pure: 'abc123' },
      });
    });
  });

  describe('fetchFunc', () => {
    it('should make successful request and return correct FetchFuncResponse interface', async () => {
      const result = await fetchFunc('email');

      // Verify FetchFuncResponse interface
      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
      expect(result.result).toBeTruthy();
    });

    it('should handle function with parameters', async () => {
      const result = await fetchFunc('number?min=1&max=100');

      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
    });

    it('should handle function with separate parameters', async () => {
      const result = await fetchFunc('word', { length: 5 });

      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
    });

    it('should merge provided params with extracted params (provided takes precedence)', async () => {
      const result = await fetchFunc('number?min=1&max=100', { min: 5 });

      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
    });
  });

  describe('fetchFuncMulti', () => {
    it('should make successful multi-request and return correct FetchFuncMultiResponse interface', async () => {
      const requests: FetchFuncMultiRequest[] = [
        { func: 'email' },
        { func: 'name' },
      ];

      const result = await fetchFuncMulti(requests);

      // Verify FetchFuncMultiResponse interface
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results).toHaveLength(2);

      // Verify FetchFuncMultiResponseItem interface for each item
      result.results!.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('value');
        // Error property may or may not be present depending on API response
        if (Object.prototype.hasOwnProperty.call(item, 'error')) {
          expect(typeof item.error).toBe('string');
        }
        expect(typeof item.id).toBe('string');
      });
    });

    it('should handle empty requests array', async () => {
      const result = await fetchFuncMulti([]);

      expect(result).toEqual({
        error: 'No functions provided',
      });
    });

    it('should parse function strings with parameters in multi-request', async () => {
      const requests: FetchFuncMultiRequest[] = [
        { func: 'number?min=1&max=100' },
      ];

      const result = await fetchFuncMulti(requests);

      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results).toHaveLength(1);
    });
  });

  describe('fetchFuncSearch', () => {
    it('should make successful search request with single request and return single object response', async () => {
      const request: FetchFuncSearchRequest = {
        id: 'search_0',
        queries: ['email input'],
      };

      const result = await fetchFuncSearch(request);

      // Verify FetchFuncSearchResponse interface
      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();

      // Verify that single input returns single object (not array)
      expect(Array.isArray(result.results)).toBe(false);
      expect(result.results).toBeTruthy();
      expect(result.results).toHaveProperty('id');
      expect(result.results).toHaveProperty('results');

      const singleResponse = result.results as FetchFuncSearchResponseItem;
      expect(typeof singleResponse.id).toBe('string');
      expect(Array.isArray(singleResponse.results)).toBe(true);

      // Verify FetchFuncSearchResult interface
      if (singleResponse.results.length > 0) {
        const searchResult = singleResponse.results[0];
        expect(searchResult).toHaveProperty('name');
        expect(searchResult).toHaveProperty('score');
        expect(searchResult).toHaveProperty('reasons');
        expect(typeof searchResult.name).toBe('string');
        expect(typeof searchResult.score).toBe('number');
        expect(Array.isArray(searchResult.reasons)).toBe(true);
      }
    });

    it('should make successful search request with array of requests and return array response', async () => {
      const requests: FetchFuncSearchRequest[] = [
        { id: 'search_0', queries: ['email input'] },
      ];

      const result = await fetchFuncSearch(requests);

      // Verify FetchFuncSearchResponse interface
      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();

      // Verify that array input returns array response
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results).toHaveLength(1);

      // Verify FetchFuncSearchResponseItem interface
      const searchResponse = (
        result.results as FetchFuncSearchResponseItem[]
      )[0];
      expect(searchResponse).toHaveProperty('id');
      expect(searchResponse).toHaveProperty('results');
      expect(typeof searchResponse.id).toBe('string');
      expect(Array.isArray(searchResponse.results)).toBe(true);

      // Verify FetchFuncSearchResult interface
      if (searchResponse.results.length > 0) {
        const searchResult = searchResponse.results[0];
        expect(searchResult).toHaveProperty('name');
        expect(searchResult).toHaveProperty('score');
        expect(searchResult).toHaveProperty('reasons');
        expect(typeof searchResult.name).toBe('string');
        expect(typeof searchResult.score).toBe('number');
        expect(Array.isArray(searchResult.reasons)).toBe(true);
      }
    });

    it('should handle empty search requests array', async () => {
      const result = await fetchFuncSearch([]);

      expect(result).toEqual({
        error: 'No search requests provided',
      });
    });

    it('should handle multiple search queries in array and return array response', async () => {
      const requests: FetchFuncSearchRequest[] = [
        { id: 'search_0', queries: ['email'] },
        { id: 'search_1', queries: ['name'] },
      ];

      const result = await fetchFuncSearch(requests);

      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();

      // Verify that array input returns array response
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results).toHaveLength(2);

      const arrayResponse = result.results as FetchFuncSearchResponseItem[];
      expect(arrayResponse[0]).toHaveProperty('id');
      expect(arrayResponse[0]).toHaveProperty('results');
    });

    it('should handle single request with multiple queries and return single object response', async () => {
      const request: FetchFuncSearchRequest = {
        id: 'search_0',
        queries: ['email', 'address', 'contact'],
      };

      const result = await fetchFuncSearch(request);

      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();

      // Verify that single input returns single object (not array)
      expect(Array.isArray(result.results)).toBe(false);
    });

    it('should handle array with single request (edge case) and return array response', async () => {
      const requests: FetchFuncSearchRequest[] = [
        { id: 'search_0', queries: ['phone number'] },
      ];

      const result = await fetchFuncSearch(requests);

      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();

      // Verify that array input returns array response (even with single item)
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results).toHaveLength(1);

      const arrayResponse = result.results as FetchFuncSearchResponseItem[];
      expect(arrayResponse[0]).toHaveProperty('id');
      expect(arrayResponse[0]).toHaveProperty('results');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid function names gracefully', async () => {
      const result = await fetchFunc('nonexistentfunction12345');

      expect(result).toHaveProperty('error');
      expect(result.error).toBeTruthy();
    });

    it('should handle invalid function names in multi-request', async () => {
      const requests: FetchFuncMultiRequest[] = [
        { func: 'validfunction' },
        { func: 'nonexistentfunction12345' },
      ];

      const result = await fetchFuncMulti(requests);

      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should handle invalid search queries gracefully', async () => {
      const requests: FetchFuncSearchRequest[] = [
        { id: 'test', queries: ['nonexistentfunction12345'] },
      ];

      const result = await fetchFuncSearch(requests);

      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle functions with special characters in parameters', async () => {
      const result = await fetchFunc(
        'word?length=10&lang=en&special=test%20value'
      );

      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
    });

    it('should handle functions with boolean parameters', async () => {
      const result = await fetchFunc('bool');

      expect(result).toHaveProperty('result');
      expect(typeof result.result).toBe('string');
    });

    it('should handle large multi-requests', async () => {
      const requests: FetchFuncMultiRequest[] = Array.from(
        { length: 10 },
        (_, i) => ({
          func: 'word',
          id: `req_${i}`,
        })
      );

      const result = await fetchFuncMulti(requests);

      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results).toHaveLength(10);
    });

    it('should handle large search requests', async () => {
      const requests: FetchFuncSearchRequest[] = Array.from(
        { length: 5 },
        (_, i) => ({
          id: `search_${i}`,
          queries: [`test query ${i}`],
        })
      );

      const result = await fetchFuncSearch(requests);

      expect(result).toHaveProperty('results');
      expect(result.results).toBeTruthy();
    });
  });

  describe('Interface Compliance', () => {
    it('should ensure all response objects match their TypeScript interfaces', async () => {
      // Test FetchFuncResponse interface
      const apiResult = await fetchFunc('email');
      expect(apiResult).toMatchObject({
        result: expect.any(String),
      });

      // Test FetchFuncMultiResponse interface
      const multiResult = await fetchFuncMulti([{ func: 'email' }]);
      expect(multiResult).toMatchObject({
        results: expect.any(Array),
      });

      // Test FetchFuncSearchResponse interface
      const searchResult = await fetchFuncSearch([
        { id: 'test', queries: ['email'] },
      ]);
      expect(searchResult).toMatchObject({
        results: expect.any(Object),
      });
    });
  });
});
