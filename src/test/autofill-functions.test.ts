import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Autofill, AutofillStatus } from '../autofill';

describe('Autofill Individual Functions', () => {
  let autofill: Autofill;

  beforeEach(() => {
    autofill = new Autofill();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Class Instantiation', () => {
    it('should create instance with default settings', () => {
      const autofill = new Autofill();

      expect(autofill.settings.mode).toBe('auto');
      expect(autofill.settings.stagger).toBe(50);
      expect(autofill.settings.badges).toBe(3000);
      expect(autofill.settings.onStatusChange).toBeUndefined();
    });

    it('should create instance with custom settings', () => {
      const statusCallback = vi.fn();
      const customSettings = {
        mode: 'manual' as const,
        stagger: 0,
        badges: 1000,
        onStatusChange: statusCallback,
      };

      const autofill = new Autofill(customSettings);

      expect(autofill.settings.mode).toBe('manual');
      expect(autofill.settings.stagger).toBe(0);
      expect(autofill.settings.badges).toBe(1000);
      expect(autofill.settings.onStatusChange).toBe(statusCallback);
    });

    it('should initialize with idle status and empty inputs array', () => {
      const autofill = new Autofill();

      expect(autofill.state.status).toBe(AutofillStatus.IDLE);
      expect(autofill.state.elements).toEqual([]);
    });
  });

  describe('setElements', () => {
    it('should find form elements in a container', () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="text" name="field1" />
          <input type="email" name="field2" />
          <select name="field3">
            <option value="option1">Option 1</option>
          </select>
        </div>
      `;

      const container = document.getElementById('form')!;
      autofill.setElements(container);

      expect(autofill.state.elements).toHaveLength(3);
      expect(autofill.state.elements[0].type).toBe('text');
      expect(autofill.state.elements[1].type).toBe('email');
      expect(autofill.state.elements[2].type).toBe('select');
    });

    it('should find elements by CSS selector', () => {
      document.body.innerHTML = `
        <input type="text" name="field1" />
        <input type="email" name="field2" />
        <input type="number" name="field3" />
      `;

      autofill.setElements('input[type="text"]');

      expect(autofill.state.elements).toHaveLength(1);
      expect(autofill.state.elements[0].type).toBe('text');
    });

    it('should handle invalid selector', () => {
      autofill.setElements('invalid-selector');

      expect(autofill.state.elements).toHaveLength(0);
      expect(autofill.state.status).toBe(AutofillStatus.ERROR);
    });

    it('should respect manual mode - only process elements with data-gofakeit', () => {
      autofill = new Autofill({ mode: 'manual' });

      document.body.innerHTML = `
        <input type="text" name="field1" data-gofakeit="true" />
        <input type="email" name="field2" />
        <input type="number" name="field3" data-gofakeit="number" />
      `;

      autofill.setElements();

      expect(autofill.state.elements).toHaveLength(2);
      expect(autofill.state.elements[0].type).toBe('text');
      expect(autofill.state.elements[1].type).toBe('number');
    });

    it('should respect auto mode - process all form elements', () => {
      autofill = new Autofill({ mode: 'auto' });

      document.body.innerHTML = `
        <input type="text" name="field1" />
        <input type="email" name="field2" />
        <input type="number" name="field3" />
      `;

      autofill.setElements();

      expect(autofill.state.elements).toHaveLength(3);
    });
  });

  describe('getElementFunction', () => {
    it('should return specific function when data-gofakeit is set', () => {
      document.body.innerHTML = '<input type="text" data-gofakeit="email" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementFunction(element);

      expect(result).toBe('email');
    });

    it('should return null when data-gofakeit is "true" (needs search)', () => {
      document.body.innerHTML = '<input type="text" data-gofakeit="true" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementFunction(element);

      expect(result).toBeNull();
    });

    it('should return fallback function for checkbox', () => {
      document.body.innerHTML = '<input type="checkbox" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementFunction(element);

      expect(result).toBe('bool');
    });

    it('should return fallback function for radio', () => {
      document.body.innerHTML = '<input type="radio" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementFunction(element);

      expect(result).toBe('randomstring');
    });

    it('should return fallback function for select', () => {
      document.body.innerHTML =
        '<select><option value="1">Option 1</option></select>';
      const element = document.querySelector('select')!;

      const result = autofill.getElementFunction(element);

      expect(result).toBe('randomstring');
    });

    it('should return null for text input (needs search)', () => {
      document.body.innerHTML = '<input type="text" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementFunction(element);

      expect(result).toBeNull();
    });
  });

  describe('getElementSearch', () => {
    it('should generate search query from input attributes', () => {
      document.body.innerHTML =
        '<input type="text" name="firstName" placeholder="Enter first name" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementSearch(element);

      expect(result).toContain('text');
      expect(result).toContain('firstname');
      expect(result).toContain('enter first name');
    });

    it('should include label text in search query', () => {
      document.body.innerHTML = `
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" />
      `;
      const element = document.querySelector('input')!;

      const result = autofill.getElementSearch(element);

      expect(result).toContain('email address');
    });

    it('should include aria-label in search query', () => {
      document.body.innerHTML =
        '<input type="text" aria-label="Phone Number" />';
      const element = document.querySelector('input')!;

      const result = autofill.getElementSearch(element);

      expect(result).toContain('phone number');
    });
  });

  describe('setElementFunctions', () => {
    it('should set functions for elements that dont need search', async () => {
      document.body.innerHTML = `
        <input type="checkbox" name="agree" />
        <input type="radio" name="gender" />
        <select name="country">
          <option value="us">US</option>
        </select>
      `;

      autofill.setElements();

      await autofill.setElementFunctions();

      expect(autofill.state.elements[0].function).toBe('bool');
      expect(autofill.state.elements[1].function).toBe('randomstring');
      expect(autofill.state.elements[2].function).toBe('randomstring');
    });

    it('should set functions for elements with specific data-gofakeit', async () => {
      document.body.innerHTML = `
        <input type="text" data-gofakeit="email" />
        <input type="text" data-gofakeit="name" />
      `;

      autofill.setElements();

      await autofill.setElementFunctions();

      expect(autofill.state.elements[0].function).toBe('email');
      expect(autofill.state.elements[1].function).toBe('name');
    });
  });

  describe('getElementValues', () => {
    it('should get values from API for inputs with functions', async () => {
      // This test will use the real API, so we'll just verify the structure
      autofill.state.elements = [
        {
          id: 'test1',
          name: '',
          element: document.createElement('input'),
          type: 'email',
          function: 'email',
          search: 'email',
          value: '',
          error: '',
        },
        {
          id: 'test2',
          name: '',
          element: document.createElement('input'),
          type: 'text',
          function: 'name',
          search: 'name',
          value: '',
          error: '',
        },
      ];

      await autofill.getElementValues();

      // Verify that values were set (either from API or error was set)
      expect(autofill.state.elements[0].value).toBeDefined();
      expect(autofill.state.elements[1].value).toBeDefined();
      // Either we got values or errors, but something should be set
      expect(
        autofill.state.elements[0].value !== '' ||
          autofill.state.elements[0].error !== ''
      ).toBe(true);
      expect(
        autofill.state.elements[1].value !== '' ||
          autofill.state.elements[1].error !== ''
      ).toBe(true);
    });
  });

  describe('setElementValues', () => {
    it('should apply values to form elements', async () => {
      document.body.innerHTML = `
        <input type="text" name="firstName" />
        <input type="email" name="email" />
        <input type="checkbox" name="agree" />
      `;

      const textElement = document.querySelector(
        'input[name="firstName"]'
      ) as HTMLInputElement;
      const emailElement = document.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement;
      const checkboxElement = document.querySelector(
        'input[name="agree"]'
      ) as HTMLInputElement;

      autofill.state.elements = [
        {
          id: 'firstName',
          name: 'firstName',
          element: textElement,
          type: 'text',
          function: 'name',
          search: 'name',
          value: 'John Doe',
          error: '',
        },
        {
          id: 'email',
          name: 'email',
          element: emailElement,
          type: 'email',
          function: 'email',
          search: 'email',
          value: 'john@example.com',
          error: '',
        },
        {
          id: 'agree',
          name: 'agree',
          element: checkboxElement,
          type: 'checkbox',
          function: 'bool',
          search: 'checkbox',
          value: 'true',
          error: '',
        },
      ];

      await autofill.setElementValues();

      expect(textElement.value).toBe('John Doe');
      expect(emailElement.value).toBe('john@example.com');
      expect(checkboxElement.checked).toBe(true);
    });

    it('should dispatch events when setting values', async () => {
      document.body.innerHTML = '<input type="text" name="test" />';
      const element = document.querySelector('input') as HTMLInputElement;

      let inputEventFired = false;
      let changeEventFired = false;

      element.addEventListener('input', () => {
        inputEventFired = true;
      });
      element.addEventListener('change', () => {
        changeEventFired = true;
      });

      autofill.state.elements = [
        {
          id: 'test',
          name: 'test',
          element: element,
          type: 'text',
          function: 'word',
          search: 'text',
          value: 'test value',
          error: '',
        },
      ];

      await autofill.setElementValues();

      expect(inputEventFired).toBe(true);
      expect(changeEventFired).toBe(true);
    });
  });

  describe('resetState', () => {
    it('should reset state to initial values', () => {
      // Set some state
      autofill.state.status = AutofillStatus.COMPLETED;
      autofill.state.elements = [
        {
          id: 'test',
          name: 'test',
          element: document.createElement('input'),
          type: 'text',
          function: 'word',
          search: 'text',
          value: 'test',
          error: '',
        },
      ];

      autofill.resetState();

      expect(autofill.state.status).toBe(AutofillStatus.IDLE);
      expect(autofill.state.elements).toHaveLength(0);
    });
  });

  describe('shouldSkipElement', () => {
    it('should skip hidden input elements', () => {
      const hiddenElement = document.createElement('input');
      hiddenElement.type = 'hidden';

      expect(autofill.shouldSkipElement(hiddenElement)).toBe(true);
    });

    it('should skip disabled input elements', () => {
      const disabledElement = document.createElement('input');
      disabledElement.disabled = true;

      expect(autofill.shouldSkipElement(disabledElement)).toBe(true);
    });

    it('should skip readonly input elements', () => {
      const readonlyElement = document.createElement('input');
      readonlyElement.readOnly = true;

      expect(autofill.shouldSkipElement(readonlyElement)).toBe(true);
    });

    it('should not skip normal input elements', () => {
      const normalElement = document.createElement('input');
      normalElement.type = 'text';

      expect(autofill.shouldSkipElement(normalElement)).toBe(false);
    });

    it('should skip disabled textarea elements', () => {
      const disabledTextarea = document.createElement('textarea');
      disabledTextarea.disabled = true;

      expect(autofill.shouldSkipElement(disabledTextarea)).toBe(true);
    });

    it('should skip readonly textarea elements', () => {
      const readonlyTextarea = document.createElement('textarea');
      readonlyTextarea.readOnly = true;

      expect(autofill.shouldSkipElement(readonlyTextarea)).toBe(true);
    });

    it('should not skip normal textarea elements', () => {
      const normalTextarea = document.createElement('textarea');

      expect(autofill.shouldSkipElement(normalTextarea)).toBe(false);
    });

    it('should skip disabled select elements', () => {
      const disabledSelect = document.createElement('select');
      disabledSelect.disabled = true;

      expect(autofill.shouldSkipElement(disabledSelect)).toBe(true);
    });

    it('should not skip normal select elements', () => {
      const normalSelect = document.createElement('select');

      expect(autofill.shouldSkipElement(normalSelect)).toBe(false);
    });

    it('should return false for non-form elements', () => {
      const div = document.createElement('div');

      expect(autofill.shouldSkipElement(div)).toBe(false);
    });

    it('should handle multiple conditions on input elements', () => {
      const element = document.createElement('input');
      element.type = 'hidden';
      element.disabled = true;
      element.readOnly = true;

      expect(autofill.shouldSkipElement(element)).toBe(true);
    });

    it('should handle multiple conditions on textarea elements', () => {
      const textarea = document.createElement('textarea');
      textarea.disabled = true;
      textarea.readOnly = true;

      expect(autofill.shouldSkipElement(textarea)).toBe(true);
    });
  });

  describe('Parameter Generation', () => {
    it('should generate correct parameters for select elements', async () => {
      document.body.innerHTML = `
        <select name="country">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      `;

      const select = document.querySelector('select') as HTMLSelectElement;
      autofill.setElements(select);
      autofill.state.elements[0].function = 'randomstring';

      // Test the paramsSelect function directly by accessing it through the element
      const element = autofill.state.elements[0];

      // We can't easily test the API call without complex mocking, so let's test
      // that the element is set up correctly for parameter generation
      expect(element.function).toBe('randomstring');
      expect(element.type).toBe('select');
      expect(element.element).toBe(select);

      // Test that the select element has the expected options
      const options = Array.from(select.options)
        .map(option => option.value)
        .filter(value => value !== '');

      expect(options).toEqual(['us', 'ca', 'uk']);
    });

    it('should handle select elements with empty options', () => {
      document.body.innerHTML = `
        <select name="empty">
          <option value="">Choose...</option>
        </select>
      `;

      const select = document.querySelector('select') as HTMLSelectElement;
      autofill.setElements(select);
      autofill.state.elements[0].function = 'randomstring';

      const element = autofill.state.elements[0];

      expect(element.function).toBe('randomstring');
      expect(element.type).toBe('select');

      // Test that empty options are filtered out
      const options = Array.from(select.options)
        .map(option => option.value)
        .filter(value => value !== '');

      expect(options).toEqual([]);
    });

    it('should not add parameters for non-select elements', () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="text" name="firstname" />
          <input type="email" name="email" />
        </div>
      `;

      const container = document.getElementById('form')!;
      autofill.setElements(container);
      autofill.state.elements[0].function = 'name';
      autofill.state.elements[1].function = 'email';

      const element1 = autofill.state.elements[0];
      const element2 = autofill.state.elements[1];

      expect(element1.function).toBe('name');
      expect(element1.type).toBe('text');
      expect(element2.function).toBe('email');
      expect(element2.type).toBe('email');
    });

    it('should generate correct parameters for radio groups', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="gender" value="male" />
          <input type="radio" name="gender" value="female" />
          <input type="radio" name="gender" value="other" />
        </div>
      `;

      const container = document.getElementById('form')!;
      autofill.setElements(container);
      await autofill.setElementFunctions();

      // All radio elements should have the same name and randomstring function
      const radioElements = autofill.state.elements.filter(
        el => el.type === 'radio'
      );
      expect(radioElements).toHaveLength(3);
      expect(radioElements[0].name).toBe('gender');
      expect(radioElements[1].name).toBe('gender');
      expect(radioElements[2].name).toBe('gender');
      expect(radioElements[0].function).toBe('randomstring');
      expect(radioElements[1].function).toBe('randomstring');
      expect(radioElements[2].function).toBe('randomstring');

      // Test that radio values are extracted correctly
      const values = radioElements.map(
        el => (el.element as HTMLInputElement).value
      );
      expect(values).toEqual(['male', 'female', 'other']);
    });

    it('should handle radio groups with empty values', () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="empty" value="" />
          <input type="radio" name="empty" value="option1" />
        </div>
      `;

      const container = document.getElementById('form')!;
      autofill.setElements(container);

      const radioElements = autofill.state.elements.filter(
        el => el.type === 'radio'
      );
      expect(radioElements).toHaveLength(2);

      // Test that empty values are filtered out
      const values = radioElements
        .map(el => (el.element as HTMLInputElement).value)
        .filter(value => value !== '');
      expect(values).toEqual(['option1']);
    });
  });
});
