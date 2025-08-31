import { describe, it, expect, beforeEach } from 'vitest';
import { autofill } from '../autofill';

describe('Autofill Smart Mode', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="test-container">
        <input type="text" id="field1" data-gofakeit="true" placeholder="Field 1">
        <input type="email" id="field2" placeholder="Email field">
        <input type="text" id="field3" data-gofakeit="false" placeholder="Excluded field">
        <input type="text" id="field4" placeholder="Smart field">
      </div>
    `;
  });

  describe('Smart Mode (default)', () => {
    it('should fill all form fields when smart is true', async () => {
      const container = document.getElementById('test-container') as HTMLElement;
      
      await autofill(container, { smart: true });
      
      // Should fill field1 (has data-gofakeit="true")
      const field1 = document.getElementById('field1') as HTMLInputElement;
      expect(field1.value).toBeTruthy();
      
      // Should fill field2 (email field detected by smart mode)
      const field2 = document.getElementById('field2') as HTMLInputElement;
      expect(field2.value).toBeTruthy();
      expect(field2.value).toContain('@');
      
      // Should fill field4 (text field detected by smart mode)
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field4.value).toBeTruthy();
      
      // Should NOT fill field3 (has data-gofakeit="false")
      const field3 = document.getElementById('field3') as HTMLInputElement;
      expect(field3.value).toBe('');
    });

    it('should use smart mode by default when no settings provided', async () => {
      const container = document.getElementById('test-container') as HTMLElement;
      
      await autofill(container);
      
      // Should still fill smart-detected fields
      const field2 = document.getElementById('field2') as HTMLInputElement;
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field2.value).toBeTruthy();
      expect(field4.value).toBeTruthy();
    });
  });

  describe('Manual Mode', () => {
    it('should only fill fields with data-gofakeit attributes when smart is false', async () => {
      const container = document.getElementById('test-container') as HTMLElement;
      
      await autofill(container, { smart: false });
      
      // Should fill field1 (has data-gofakeit="true")
      const field1 = document.getElementById('field1') as HTMLInputElement;
      expect(field1.value).toBeTruthy();
      
      // Should NOT fill field2 (no data-gofakeit attribute)
      const field2 = document.getElementById('field2') as HTMLInputElement;
      expect(field2.value).toBe('');
      
      // Should NOT fill field4 (no data-gofakeit attribute)
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field4.value).toBe('');
      
      // Should NOT fill field3 (has data-gofakeit="false")
      const field3 = document.getElementById('field3') as HTMLInputElement;
      expect(field3.value).toBe('');
    });

    it('should handle container with no data-gofakeit fields gracefully', async () => {
      document.body.innerHTML = `
        <div id="empty-container">
          <input type="text" id="field1" placeholder="No data-gofakeit">
          <input type="email" id="field2" placeholder="Email without data-gofakeit">
        </div>
      `;
      
      const container = document.getElementById('empty-container') as HTMLElement;
      
      await autofill(container, { smart: false });
      
      // Fields should remain empty
      const field1 = document.getElementById('field1') as HTMLInputElement;
      const field2 = document.getElementById('field2') as HTMLInputElement;
      expect(field1.value).toBe('');
      expect(field2.value).toBe('');
    });
  });

  describe('Single Element with Settings', () => {
    it('should respect smart setting for single element', async () => {
      const field = document.getElementById('field2') as HTMLInputElement; // email field
      
      // Smart mode should fill the email field
      await autofill(field, { smart: true });
      expect(field.value).toBeTruthy();
      expect(field.value).toContain('@');
      
      // Reset
      field.value = '';
      
      // Manual mode should not fill the field (no data-gofakeit attribute)
      await autofill(field, { smart: false });
      expect(field.value).toBe('');
    });

    it('should fill single element with data-gofakeit attribute regardless of smart setting', async () => {
      const field = document.getElementById('field1') as HTMLInputElement; // has data-gofakeit="true"
      
      // Should fill in both modes
      await autofill(field, { smart: true });
      expect(field.value).toBeTruthy();
      
      // Reset
      field.value = '';
      
      await autofill(field, { smart: false });
      expect(field.value).toBeTruthy();
    });
  });

  describe('Global Autofill with Settings', () => {
    it('should apply smart setting to all fields on page', async () => {
      await autofill(undefined, { smart: true });
      
      // Should fill all form fields
      const field1 = document.getElementById('field1') as HTMLInputElement;
      const field2 = document.getElementById('field2') as HTMLInputElement;
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field1.value).toBeTruthy();
      expect(field2.value).toBeTruthy();
      expect(field4.value).toBeTruthy();
    });

    it('should only fill data-gofakeit fields when smart is false', async () => {
      await autofill(undefined, { smart: false });
      
      // Should only fill field1 (has data-gofakeit="true")
      const field1 = document.getElementById('field1') as HTMLInputElement;
      expect(field1.value).toBeTruthy();
      
      // Should not fill other fields
      const field2 = document.getElementById('field2') as HTMLInputElement;
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field2.value).toBe('');
      expect(field4.value).toBe('');
    });
  });

  describe('Settings Validation', () => {
    it('should handle undefined settings gracefully', async () => {
      const container = document.getElementById('test-container') as HTMLElement;
      
      // @ts-ignore - Testing undefined settings
      await autofill(container, undefined);
      
      // Should default to smart mode
      const field2 = document.getElementById('field2') as HTMLInputElement;
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field2.value).toBeTruthy();
      expect(field4.value).toBeTruthy();
    });

    it('should handle empty settings object gracefully', async () => {
      const container = document.getElementById('test-container') as HTMLElement;
      
      await autofill(container, {});
      
      // Should default to smart mode
      const field2 = document.getElementById('field2') as HTMLInputElement;
      const field4 = document.getElementById('field4') as HTMLInputElement;
      expect(field2.value).toBeTruthy();
      expect(field4.value).toBeTruthy();
    });
  });
});
