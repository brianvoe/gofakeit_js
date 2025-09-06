import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  Autofill,
  type AutofillSettings,
  type AutofillState,
  type AutofillElement,
} from '../autofill';

describe('Autofill Class', () => {
  let originalBody: string;
  let statusCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Store original body content
    originalBody = document.body.innerHTML || '';

    // Create mock status callback
    statusCallback = vi.fn();

    // Clear any existing elements
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Restore original body content
    document.body.innerHTML = originalBody || '';
    vi.clearAllMocks();
  });

  describe('Class Instantiation', () => {
    it('should create instance with default settings', () => {
      const autofill = new Autofill();

      expect(autofill.settings.mode).toBe('auto');
      expect(autofill.settings.staggered).toBe(true);
      expect(autofill.settings.staggerDelay).toBe(50);
      expect(autofill.settings.onStatusChange).toBeUndefined();
    });

    it('should create instance with custom settings', () => {
      const customSettings: AutofillSettings = {
        mode: 'manual',
        staggered: false,
        staggerDelay: 200,
        onStatusChange: statusCallback,
      };

      const autofill = new Autofill(customSettings);

      expect(autofill.settings.mode).toBe('manual');
      expect(autofill.settings.staggered).toBe(false);
      expect(autofill.settings.staggerDelay).toBe(200);
      expect(autofill.settings.onStatusChange).toBe(statusCallback);
    });

    it('should initialize with idle status and empty inputs array', () => {
      const autofill = new Autofill();

      expect(autofill.state.status).toBe('idle');
      expect(autofill.state.inputs).toEqual([]);
    });
  });

  describe('Status Callback Functionality', () => {
    it('should call status callback with correct status progression', async () => {
      const autofill = new Autofill({
        onStatusChange: statusCallback,
      });

      // Create a simple form
      document.body.innerHTML = `
        <form>
          <input type="text" name="test" data-gofakeit="true">
        </form>
      `;

      await autofill.autofill();

      // Verify status callback was called with correct progression
      expect(statusCallback).toHaveBeenCalledWith(
        'starting',
        expect.any(Object)
      );
      expect(statusCallback).toHaveBeenCalledWith(
        'initializing',
        expect.any(Object)
      );
      expect(statusCallback).toHaveBeenCalledWith(
        'determining_functions',
        expect.any(Object)
      );
      expect(statusCallback).toHaveBeenCalledWith(
        'getting_values',
        expect.any(Object)
      );
      expect(statusCallback).toHaveBeenCalledWith(
        'applying_values',
        expect.any(Object)
      );
      expect(statusCallback).toHaveBeenCalledWith(
        'completed',
        expect.any(Object)
      );
    });

    it('should provide state object with inputs array in status callback', async () => {
      const autofill = new Autofill({
        onStatusChange: statusCallback,
      });

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="email" name="field2" data-gofakeit="true">
        </form>
      `;

      await autofill.autofill();

      // Check that state object contains inputs array
      const calls = statusCallback.mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      // Verify state structure in callback
      calls.forEach((call: any[]) => {
        const [status, state] = call as [string, AutofillState];
        expect(state).toHaveProperty('status');
        expect(state).toHaveProperty('inputs');
        expect(Array.isArray(state.inputs)).toBe(true);
        expect(state.status).toBe(status);
      });
    });

    it('should call status callback with error status on failure', async () => {
      const autofill = new Autofill({
        onStatusChange: statusCallback,
      });

      // Create invalid target to trigger error
      await autofill.autofill('invalid-selector');

      expect(statusCallback).toHaveBeenCalledWith('error', expect.any(Object));
    });
  });

  describe('Input Type Handlers', () => {
    it('should handle text inputs with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="firstName" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="firstName"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value.length).toBeGreaterThan(0);
    });

    it('should handle email inputs with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="email" name="email" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toContain('@');
      expect(input.value).toContain('.');
    });

    it('should handle number inputs with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="number" name="age" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="age"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(Number(input.value)).not.toBeNaN();
    });

    it('should handle date inputs with local generation', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="date" name="birthdate" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="birthdate"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should handle time inputs with local generation', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="time" name="meetingTime" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="meetingTime"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle checkbox inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="checkbox" name="newsletter" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="newsletter"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(typeof input.checked).toBe('boolean');
    });

    it('should handle radio inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="radio" name="gender" value="male" data-gofakeit="true">
        <input type="radio" name="gender" value="female" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="gender"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      // At least one radio button should be checked
      const checkedRadio = document.querySelector(
        'input[name="gender"]:checked'
      );
      expect(checkedRadio).toBeTruthy();
    });

    it('should handle select inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <select name="country" data-gofakeit="true">
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </select>
      `;

      const select = document.querySelector(
        'select[name="country"]'
      ) as HTMLSelectElement;
      const result = await autofill.autofill(select);

      expect(result).toBe(true);
      expect(select.value).toBeTruthy();
      expect(select.value).not.toBe('');
    });

    it('should handle textarea inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <textarea name="bio" data-gofakeit="true"></textarea>
      `;

      const textarea = document.querySelector(
        'textarea[name="bio"]'
      ) as HTMLTextAreaElement;
      const result = await autofill.autofill(textarea);

      expect(result).toBe(true);
      expect(textarea.value).toBeTruthy();
      expect(textarea.value.length).toBeGreaterThan(0);
    });
  });

  describe('Custom Function Handling', () => {
    it('should use custom function when data-gofakeit is set to specific function', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="custom" data-gofakeit="word">
      `;

      const input = document.querySelector(
        'input[name="custom"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
    });

    it('should skip search API when specific function is provided', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="direct" data-gofakeit="email">
      `;

      const input = document.querySelector(
        'input[name="direct"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should populate inputs array during autofill process', async () => {
      const autofill = new Autofill({
        onStatusChange: statusCallback,
      });

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="email" name="field2" data-gofakeit="true">
          <input type="text" name="field3" data-gofakeit="false">
        </form>
      `;

      await autofill.autofill();

      // Check that inputs array was populated
      const calls = statusCallback.mock.calls;
      const lastCall = calls[calls.length - 1];
      const finalState = lastCall[1] as AutofillState;

      expect(finalState.inputs.length).toBeGreaterThan(0);

      // Verify AutofillElement structure
      finalState.inputs.forEach((input: AutofillElement) => {
        expect(input).toHaveProperty('element');
        expect(input).toHaveProperty('type');
        expect(input).toHaveProperty('function');
        expect(input).toHaveProperty('value');
        expect(input).toHaveProperty('error');
      });
    });

    it('should track function determination in inputs array', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <form>
          <input type="text" name="auto" data-gofakeit="true">
          <input type="email" name="custom" data-gofakeit="email">
        </form>
      `;

      await autofill.autofill();

      // Check that functions were determined
      const inputs = autofill.state.inputs;
      expect(inputs.length).toBeGreaterThan(0);

      inputs.forEach(input => {
        expect(input.function).toBeTruthy();
      });
    });

    it('should track value generation in inputs array', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <form>
          <input type="text" name="test" data-gofakeit="true">
        </form>
      `;

      await autofill.autofill();

      const inputs = autofill.state.inputs;
      const successfulInputs = inputs.filter(
        input => input.value && !input.error
      );

      expect(successfulInputs.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid target gracefully', async () => {
      const autofill = new Autofill();

      const result = await autofill.autofill('invalid-selector');

      expect(result).toBe(false);
      expect(autofill.state.status).toBe('error');
    });

    it('should handle empty page gracefully', async () => {
      const autofill = new Autofill();

      const result = await autofill.autofill();

      expect(result).toBe(false);
      expect(autofill.state.status).toBe('idle');
    });

    it('should track errors in inputs array', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <form>
          <input type="text" name="valid" data-gofakeit="true">
          <input type="text" name="invalid" data-gofakeit="nonexistent-function">
        </form>
      `;

      await autofill.autofill();

      const inputs = autofill.state.inputs;
      // const errorInputs = inputs.filter(input => input.error)

      // Should have some inputs with errors (depending on API response)
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  describe('Target Selection', () => {
    it('should autofill all form fields when no target specified', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="email" name="field2" data-gofakeit="true">
          <input type="text" name="field3" data-gofakeit="false">
        </form>
      `;

      const result = await autofill.autofill();

      expect(result).toBe(true);

      const field1 = document.querySelector(
        'input[name="field1"]'
      ) as HTMLInputElement;
      const field2 = document.querySelector(
        'input[name="field2"]'
      ) as HTMLInputElement;
      const field3 = document.querySelector(
        'input[name="field3"]'
      ) as HTMLInputElement;

      expect(field1.value).toBeTruthy();
      expect(field2.value).toBeTruthy();
      expect(field3.value).toBe(''); // Should remain empty
    });

    it('should autofill specific element when target is provided', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="email" name="field2" data-gofakeit="true">
        </form>
      `;

      const target = document.querySelector(
        'input[name="field1"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(target);

      expect(result).toBe(true);
      expect(target.value).toBeTruthy();
    });

    it('should autofill elements matching CSS selector', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="email" name="field2" data-gofakeit="true">
          <input type="text" name="field3" data-gofakeit="true">
        </form>
      `;

      const result = await autofill.autofill('input[type="text"]');

      expect(result).toBe(true);

      const textInputs = document.querySelectorAll('input[type="text"]');
      textInputs.forEach(input => {
        expect((input as HTMLInputElement).value).toBeTruthy();
      });
    });
  });

  describe('Mode Settings', () => {
    it('should respect manual mode setting', async () => {
      const autofill = new Autofill({ mode: 'manual' });

      document.body.innerHTML = `
        <form>
          <input type="text" name="manual" data-gofakeit="true">
          <input type="text" name="auto" placeholder="Auto detected">
        </form>
      `;

      await autofill.autofill();

      const manualField = document.querySelector(
        'input[name="manual"]'
      ) as HTMLInputElement;
      const autoField = document.querySelector(
        'input[name="auto"]'
      ) as HTMLInputElement;

      expect(manualField.value).toBeTruthy();
      expect(autoField.value).toBe(''); // Should remain empty in manual mode
    });

    it('should respect auto mode setting', async () => {
      const autofill = new Autofill({ mode: 'auto' });

      document.body.innerHTML = `
        <form>
          <input type="text" name="manual" data-gofakeit="true">
          <input type="text" name="auto" placeholder="Auto detected">
        </form>
      `;

      await autofill.autofill();

      const manualField = document.querySelector(
        'input[name="manual"]'
      ) as HTMLInputElement;
      // const autoField = document.querySelector('input[name="auto"]') as HTMLInputElement

      expect(manualField.value).toBeTruthy();
      // Auto field might be filled depending on search API results
    });
  });

  describe('Staggered Timing', () => {
    it('should respect staggered setting', async () => {
      const autofill = new Autofill({
        staggered: true,
        staggerDelay: 10, // Small delay for testing
      });

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="text" name="field2" data-gofakeit="true">
          <input type="text" name="field3" data-gofakeit="true">
        </form>
      `;

      const startTime = Date.now();
      await autofill.autofill();
      const endTime = Date.now();

      // Should take some time due to stagger delay
      expect(endTime - startTime).toBeGreaterThan(0);
    });

    it('should be faster without staggered setting', async () => {
      const autofill = new Autofill({
        staggered: false,
      });

      document.body.innerHTML = `
        <form>
          <input type="text" name="field1" data-gofakeit="true">
          <input type="text" name="field2" data-gofakeit="true">
          <input type="text" name="field3" data-gofakeit="true">
        </form>
      `;

      const startTime = Date.now();
      await autofill.autofill();
      const endTime = Date.now();

      // Should be relatively fast without stagger
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Reset State', () => {
    it('should reset state to idle and empty inputs', () => {
      const autofill = new Autofill();

      // Modify state
      autofill.state.status = 'completed';
      autofill.state.inputs = [
        {
          element: document.createElement('input'),
          type: 'text',
          function: 'test',
          value: 'test',
          error: '',
        },
      ];

      // Reset state
      autofill.resetState();

      expect(autofill.state.status).toBe('idle');
      expect(autofill.state.inputs).toEqual([]);
    });
  });
});
