import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Autofill } from '../autofill';

describe('Input Type Handlers', () => {
  let originalBody: string;

  beforeEach(() => {
    originalBody = document.body.innerHTML || '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = originalBody || '';
  });

  describe('Text Input Handlers', () => {
    it('should handle text input with data-gofakeit="true"', async () => {
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

    it('should handle email input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="email" name="userEmail" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="userEmail"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toContain('@');
      expect(input.value).toContain('.');
    });

    it('should handle tel input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="tel" name="phoneNumber" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="phoneNumber"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value.length).toBeGreaterThan(0);
    });

    it('should handle password input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="password" name="userPassword" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="userPassword"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value.length).toBeGreaterThan(0);
    });

    it('should handle search input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="search" name="searchQuery" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="searchQuery"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value.length).toBeGreaterThan(0);
    });

    it('should handle url input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="url" name="website" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="website"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toContain('http');
    });

    it('should handle color input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="color" name="themeColor" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="themeColor"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('Number Input Handlers', () => {
    it('should handle number input with data-gofakeit="true"', async () => {
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

    it('should handle range input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="range" name="rating" min="1" max="5" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="rating"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      const value = Number(input.value);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    });
  });

  describe('Date/Time Input Handlers', () => {
    it('should handle date input with local generation', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="date" name="birthDate" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="birthDate"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should handle time input with local generation', async () => {
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

    it('should handle datetime-local input with local generation', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="datetime-local" name="appointment" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="appointment"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('should handle month input with local generation', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="month" name="graduationMonth" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="graduationMonth"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^\d{4}-\d{2}$/);
    });

    it('should handle week input with local generation', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="week" name="vacationWeek" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="vacationWeek"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBeTruthy();
      expect(input.value).toMatch(/^\d{4}-W\d{2}$/);
    });
  });

  describe('Misc Input Handlers', () => {
    it('should handle checkbox input with data-gofakeit="true"', async () => {
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

    it('should handle radio input with data-gofakeit="true"', async () => {
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

    it('should handle select input with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <select name="country" data-gofakeit="true">
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
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

    it('should handle textarea with data-gofakeit="true"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <textarea name="description" data-gofakeit="true"></textarea>
      `;

      const textarea = document.querySelector(
        'textarea[name="description"]'
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

    it('should handle textarea with custom function', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <textarea name="longDescription" data-gofakeit="paragraph"></textarea>
      `;

      const textarea = document.querySelector(
        'textarea[name="longDescription"]'
      ) as HTMLTextAreaElement;
      const result = await autofill.autofill(textarea);

      expect(result).toBe(true);
      expect(textarea.value).toBeTruthy();
      expect(textarea.value.length).toBeGreaterThan(0);
    });

    it('should handle select with custom function', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <select name="language" data-gofakeit="language">
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      `;

      const select = document.querySelector(
        'select[name="language"]'
      ) as HTMLSelectElement;
      const result = await autofill.autofill(select);

      expect(result).toBe(true);
      expect(select.value).toBeTruthy();
    });
  });

  describe('Event Dispatching', () => {
    it('should dispatch input and change events for text inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="test" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="test"]'
      ) as HTMLInputElement;

      let inputEventFired = false;
      let changeEventFired = false;

      input.addEventListener('input', () => {
        inputEventFired = true;
      });
      input.addEventListener('change', () => {
        changeEventFired = true;
      });

      await autofill.autofill(input);

      expect(inputEventFired).toBe(true);
      expect(changeEventFired).toBe(true);
    });

    it('should dispatch change events for checkbox inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="checkbox" name="test" data-gofakeit="true">
      `;

      const input = document.querySelector(
        'input[name="test"]'
      ) as HTMLInputElement;

      let changeEventFired = false;

      input.addEventListener('change', () => {
        changeEventFired = true;
      });

      await autofill.autofill(input);

      // Change event should fire regardless of the final value
      expect(changeEventFired).toBe(true);
    });

    it('should dispatch change events for radio inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="radio" name="test" value="option1" data-gofakeit="true">
        <input type="radio" name="test" value="option2" data-gofakeit="true">
      `;

      const input1 = document.querySelector(
        'input[value="option1"]'
      ) as HTMLInputElement;
      const input2 = document.querySelector(
        'input[value="option2"]'
      ) as HTMLInputElement;

      let changeEventFired = false;

      input1.addEventListener('change', () => {
        changeEventFired = true;
      });
      input2.addEventListener('change', () => {
        changeEventFired = true;
      });

      await autofill.autofill(input1);

      expect(changeEventFired).toBe(true);
    });

    it('should dispatch change events for select inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <select name="test" data-gofakeit="true">
          <option value="">Select</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      `;

      const select = document.querySelector(
        'select[name="test"]'
      ) as HTMLSelectElement;

      let changeEventFired = false;

      select.addEventListener('change', () => {
        changeEventFired = true;
      });

      await autofill.autofill(select);

      expect(changeEventFired).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle inputs with data-gofakeit="false"', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="excluded" data-gofakeit="false">
      `;

      const input = document.querySelector(
        'input[name="excluded"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      expect(input.value).toBe(''); // Should remain empty
    });

    it('should handle inputs without data-gofakeit attribute', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="noAttribute">
      `;

      const input = document.querySelector(
        'input[name="noAttribute"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      // Behavior depends on mode setting
    });

    it('should handle disabled inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="disabled" data-gofakeit="true" disabled>
      `;

      const input = document.querySelector(
        'input[name="disabled"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      // Disabled inputs should still be processed
    });

    it('should handle readonly inputs', async () => {
      const autofill = new Autofill();

      document.body.innerHTML = `
        <input type="text" name="readonly" data-gofakeit="true" readonly>
      `;

      const input = document.querySelector(
        'input[name="readonly"]'
      ) as HTMLInputElement;
      const result = await autofill.autofill(input);

      expect(result).toBe(true);
      // Readonly inputs should still be processed
    });
  });
});
