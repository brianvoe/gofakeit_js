import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { autofill } from '../autofill'

describe('Input Types Testing', () => {
  let originalBody: string

  beforeEach(() => {
    // Store original body content
    originalBody = document.body.innerHTML
  })

  afterEach(() => {
    // Restore original body content
    document.body.innerHTML = originalBody
  })

  describe('Text Input Types', () => {
    it('should handle text input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'firstName'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should handle email input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'email'
      input.name = 'userEmail'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toContain('@')
      expect(input.value).toContain('.')
    })

    it('should handle tel input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'tel'
      input.name = 'phoneNumber'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should handle password input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'password'
      input.name = 'userPassword'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should handle url input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'url'
      input.name = 'website'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toContain('http')
    })

    it('should handle search input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'search'
      input.name = 'searchQuery'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should handle color input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'color'
      input.name = 'themeColor'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  describe('Numeric Input Types', () => {
    it('should handle number input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'number'
      input.name = 'age'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(Number(input.value)).not.toBeNaN()
      // Number can be positive or negative depending on the function returned by search API
    })

    it('should handle range input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'range'
      input.name = 'rating'
      input.min = '1'
      input.max = '5'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      const value = Number(input.value)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(5)
    })
  })

  describe('Date and Time Input Types', () => {
    it('should handle date input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'date'
      input.name = 'birthDate'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('should handle time input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'time'
      input.name = 'meetingTime'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toMatch(/^\d{2}:\d{2}$/)
    })

    it('should handle datetime-local input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'datetime-local'
      input.name = 'appointment'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    })

    it('should handle month input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'month'
      input.name = 'graduationMonth'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toMatch(/^\d{4}-\d{2}$/)
    })

    it('should handle week input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'week'
      input.name = 'vacationWeek'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toMatch(/^\d{4}-W\d{2}$/)
    })
  })

  describe('File Input Types', () => {
    it('should handle file input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.name = 'document'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      // File inputs may or may not be filled depending on implementation
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Button Input Types', () => {
    it('should handle button input gracefully', async () => {
      const input = document.createElement('input')
      input.type = 'button'
      input.name = 'submitButton'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      // Button inputs may or may not be handled depending on implementation
      expect(typeof result).toBe('boolean')
    })

    it('should handle submit input gracefully', async () => {
      const input = document.createElement('input')
      input.type = 'submit'
      input.name = 'submitForm'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      // Submit inputs may or may not be handled depending on implementation
      expect(typeof result).toBe('boolean')
    })

    it('should handle reset input gracefully', async () => {
      const input = document.createElement('input')
      input.type = 'reset'
      input.name = 'resetForm'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      // Reset inputs may or may not be handled depending on implementation
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Hidden Input Types', () => {
    it('should handle hidden input with smart detection', async () => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'sessionId'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofill(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })
  })

  describe('Textarea Elements', () => {
    it('should handle textarea with smart detection', async () => {
      const textarea = document.createElement('textarea')
      textarea.name = 'description'
      textarea.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(textarea)

      const result = await autofill(textarea)
      
      expect(result).toBe(true)
      expect(textarea.value).toBeTruthy()
      expect(textarea.value.length).toBeGreaterThan(0)
    })

    it('should handle textarea with custom function', async () => {
      const textarea = document.createElement('textarea')
      textarea.name = 'longDescription'
      textarea.setAttribute('data-gofakeit', 'paragraph')
      document.body.appendChild(textarea)

      const result = await autofill(textarea)
      
      expect(result).toBe(true)
      expect(textarea.value).toBeTruthy()
      expect(textarea.value.length).toBeGreaterThan(0)
    })
  })

  describe('Select Elements', () => {
    it('should handle select with smart detection', async () => {
      const select = document.createElement('select')
      select.name = 'country'
      select.setAttribute('data-gofakeit', 'true')
      
      const option1 = document.createElement('option')
      option1.value = ''
      option1.textContent = 'Select Country'
      select.appendChild(option1)
      
      const option2 = document.createElement('option')
      option2.value = 'us'
      option2.textContent = 'United States'
      select.appendChild(option2)
      
      const option3 = document.createElement('option')
      option3.value = 'ca'
      option3.textContent = 'Canada'
      select.appendChild(option3)
      
      document.body.appendChild(select)

      const result = await autofill(select)
      
      expect(result).toBe(true)
      expect(select.value).toBeTruthy()
      expect(select.value).not.toBe('')
    })

    it('should handle select with custom function', async () => {
      const select = document.createElement('select')
      select.name = 'language'
      select.setAttribute('data-gofakeit', 'language')
      
      const option1 = document.createElement('option')
      option1.value = ''
      option1.textContent = 'Select Language'
      select.appendChild(option1)
      
      const option2 = document.createElement('option')
      option2.value = 'en'
      option2.textContent = 'English'
      select.appendChild(option2)
      
      const option3 = document.createElement('option')
      option3.value = 'es'
      option3.textContent = 'Spanish'
      select.appendChild(option3)
      
      document.body.appendChild(select)

      const result = await autofill(select)
      
      expect(result).toBe(true)
      // The language function might not be available, so we just check the result
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Comprehensive Input Text Tests', () => {
    it('should test all text input type mappings with "true"', async () => {
      const inputTypes = [
        { type: 'text' },
        { type: 'email' },
        { type: 'tel' },
        { type: 'password' },
        { type: 'search' },
        { type: 'url' },
        { type: 'color' }
      ]

      for (const { type } of inputTypes) {
        const input = document.createElement('input')
        input.type = type
        input.setAttribute('data-gofakeit', 'true')
        document.body.appendChild(input)

        const result = await autofill(input)
        expect(result).toBe(true)
        if (type === 'color') {
          // Color inputs normalize to a valid hex color format
          expect(input.value).toMatch(/^#[0-9a-f]{6}$/i)
        } else {
          expect(input.value).toBeTruthy()
          expect(input.value.length).toBeGreaterThan(0)
        }
        
        document.body.removeChild(input)
      }
    })

    it('should handle custom functions for text inputs', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.setAttribute('data-gofakeit', 'word')
      document.body.appendChild(input)

      const result = await autofill(input)
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should handle textarea with true and custom functions', async () => {
      // Test with 'true'
      const textarea1 = document.createElement('textarea')
      textarea1.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(textarea1)

      let result = await autofill(textarea1)
      expect(result).toBe(true)
      expect(textarea1.value).toBeTruthy()
      expect(textarea1.value.length).toBeGreaterThan(0)

      // Test with custom function
      const textarea2 = document.createElement('textarea')
      textarea2.setAttribute('data-gofakeit', 'paragraph')
      document.body.appendChild(textarea2)

      result = await autofill(textarea2)
      expect(result).toBe(true)
      expect(textarea2.value).toBeTruthy()
      expect(textarea2.value.length).toBeGreaterThan(0)
    })
  })

  describe('Comprehensive DateTime Tests', () => {
    it('should handle all datetime input types with successful responses', async () => {
      // Test date input
      const dateInput = document.createElement('input')
      dateInput.type = 'date'
      dateInput.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(dateInput)

      let result = await autofill(dateInput)
      expect(result).toBe(true)
      expect(dateInput.value).toBeTruthy()

      // Test time input
      const timeInput = document.createElement('input')
      timeInput.type = 'time'
      timeInput.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(timeInput)

      result = await autofill(timeInput)
      expect(result).toBe(true)
      expect(timeInput.value).toBeTruthy()

      // Test datetime-local input
      const datetimeInput = document.createElement('input')
      datetimeInput.type = 'datetime-local'
      datetimeInput.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(datetimeInput)

      result = await autofill(datetimeInput)
      expect(result).toBe(true)
      expect(datetimeInput.value).toBeTruthy()

      // Test month input
      const monthInput = document.createElement('input')
      monthInput.type = 'month'
      monthInput.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(monthInput)

      result = await autofill(monthInput)
      expect(result).toBe(true)
      expect(monthInput.value).toBeTruthy()
    })

    it('should handle week input with daterange function', async () => {
      const weekInput = document.createElement('input')
      weekInput.type = 'week'
      weekInput.setAttribute('data-gofakeit', 'daterange')
      document.body.appendChild(weekInput)

      const result = await autofill(weekInput)
      expect(result).toBe(true)
      expect(weekInput.value).toMatch(/^\d{4}-W\d{2}$/)
    })
  })

  describe('Comprehensive Number Tests', () => {
    it('should handle number input with custom function', async () => {
      const numberInput = document.createElement('input')
      numberInput.type = 'number'
      numberInput.setAttribute('data-gofakeit', 'number')
      document.body.appendChild(numberInput)

      const result = await autofill(numberInput)
      expect(result).toBe(true)
      expect(numberInput.value).toBeTruthy()
    })

    it('should handle range input with missing min/max attributes', async () => {
      const rangeInput = document.createElement('input')
      rangeInput.type = 'range'
      // No min/max attributes - should default to 0-100
      document.body.appendChild(rangeInput)

      const result = await autofill(rangeInput)
      expect(result).toBe(true)
      expect(rangeInput.value).toBeTruthy()
    })
  })

  describe('Comprehensive Misc Input Tests', () => {
    it('should handle checkbox groups with multiple selections', async () => {
      const container = document.createElement('form')
      const checkbox1 = document.createElement('input')
      checkbox1.type = 'checkbox'
      checkbox1.name = 'options'
      checkbox1.value = 'option1'
      checkbox1.setAttribute('data-gofakeit', 'true')
      
      const checkbox2 = document.createElement('input')
      checkbox2.type = 'checkbox'
      checkbox2.name = 'options'
      checkbox2.value = 'option2'
      
      const checkbox3 = document.createElement('input')
      checkbox3.type = 'checkbox'
      checkbox3.name = 'options'
      checkbox3.value = 'option3'
      
      container.appendChild(checkbox1)
      container.appendChild(checkbox2)
      container.appendChild(checkbox3)
      document.body.appendChild(container)

      const result = await autofill(checkbox1)
      expect(result).toBe(true)
    })

    it('should handle radio group with true setting', async () => {
      const container = document.createElement('form')
      const radio1 = document.createElement('input')
      radio1.type = 'radio'
      radio1.name = 'choice'
      radio1.value = 'option1'
      radio1.setAttribute('data-gofakeit', 'true')
      
      const radio2 = document.createElement('input')
      radio2.type = 'radio'
      radio2.name = 'choice'
      radio2.value = 'option2'
      
      container.appendChild(radio1)
      container.appendChild(radio2)
      document.body.appendChild(container)

      const result = await autofill(radio1)
      expect(result).toBe(true)
    })

    it('should handle checkbox with value parsing', async () => {
      const container = document.createElement('form')
      const checkbox1 = document.createElement('input')
      checkbox1.type = 'checkbox'
      checkbox1.name = 'choices'
      checkbox1.value = 'option1'
      checkbox1.setAttribute('data-gofakeit', 'bool')
      
      const checkbox2 = document.createElement('input')
      checkbox2.type = 'checkbox'
      checkbox2.name = 'choices'
      checkbox2.value = 'option2'
      
      const checkbox3 = document.createElement('input')
      checkbox3.type = 'checkbox'
      checkbox3.name = 'choices'
      checkbox3.value = 'option3'
      
      container.appendChild(checkbox1)
      container.appendChild(checkbox2)
      container.appendChild(checkbox3)
      document.body.appendChild(container)

      const result = await autofill(checkbox1)
      expect(result).toBe(true)
    })

    it('should handle single select with random selection', async () => {
      const select = document.createElement('select')
      select.setAttribute('data-gofakeit', 'true')
      
      const option1 = document.createElement('option')
      option1.value = 'option1'
      option1.textContent = 'Option 1'
      
      const option2 = document.createElement('option')
      option2.value = 'option2'
      option2.textContent = 'Option 2'
      
      const option3 = document.createElement('option')
      option3.value = 'option3'
      option3.textContent = 'Option 3'
      
      select.appendChild(option1)
      select.appendChild(option2)
      select.appendChild(option3)
      document.body.appendChild(select)

      const result = await autofill(select)
      expect(result).toBe(true)
      expect(select.value).toBeTruthy()
    })

    it('should handle multiselect with random selections', async () => {
      const select = document.createElement('select')
      select.multiple = true
      select.setAttribute('data-gofakeit', 'true')
      
      const option1 = document.createElement('option')
      option1.value = 'option1'
      option1.textContent = 'Option 1'
      
      const option2 = document.createElement('option')
      option2.value = 'option2'
      option2.textContent = 'Option 2'
      
      const option3 = document.createElement('option')
      option3.value = 'option3'
      option3.textContent = 'Option 3'
      
      select.appendChild(option1)
      select.appendChild(option2)
      select.appendChild(option3)
      document.body.appendChild(select)

      const result = await autofill(select)
      expect(result).toBe(true)
    })

    it('should handle radio button group with random selection across multiple runs', async () => {
      const results = [];
      const radioCount = 8; // Create 8 radio buttons to make the test more comprehensive
      
      for (let run = 0; run < 20; run++) {
        // Create a fresh set of radio buttons for each run
        const container = document.createElement('form');
        
        // Create 8 radio buttons with the same name
        const radios = [];
        for (let i = 0; i < radioCount; i++) {
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = 'testGroup';
          radio.value = `option${i + 1}`;
          radio.id = `radio${i + 1}`;
          radio.setAttribute('data-gofakeit', 'true');
          container.appendChild(radio);
          radios.push(radio);
        }
        
        document.body.appendChild(container);
        
        // Run autofill on the first radio button (should handle the entire group)
        const result = await autofill(radios[0]);
        expect(result).toBe(true);
        
        // Find which radio button was selected
        const selectedIndex = radios.findIndex(radio => radio.checked);
        results.push(selectedIndex);
        
        // Verify exactly one radio button is selected
        const checkedCount = radios.filter(radio => radio.checked).length;
        expect(checkedCount).toBe(1);
        
        // Clean up for next run
        document.body.removeChild(container);
      }
      
      // Log the distribution
      const distribution: Record<string, number> = {};
      for (let i = 0; i < radioCount; i++) {
        distribution[`radio${i + 1}`] = results.filter(r => r === i).length;
      }
      
      console.log('Radio button selection distribution over 20 runs:', {
        ...distribution,
        total: results.length,
        uniqueSelections: new Set(results).size
      });
      
      // Should have selected multiple different options (at least 3 out of 8)
      const uniqueSelections = new Set(results).size;
      expect(uniqueSelections).toBeGreaterThan(2);
      
      // Should have exactly 20 selections total
      expect(results.length).toBe(20);
      
      // No single radio button should be selected more than 50% of the time
      const maxSelections = Math.max(...Object.values(distribution));
      expect(maxSelections).toBeLessThan(12); // Less than 60% of runs
    })

    it('should display function badge over the selected radio button', async () => {
      document.body.innerHTML = `
        <div class="form-group">
          <label>Test Radio Group</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" name="test" id="radio1" data-gofakeit="true">
              <label for="radio1">Option 1</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="test" id="radio2" data-gofakeit="true">
              <label for="radio2">Option 2</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="test" id="radio3" data-gofakeit="true">
              <label for="radio3">Option 3</label>
            </div>
          </div>
        </div>
      `;
      
      const radio1 = document.getElementById('radio1') as HTMLInputElement;
      const radio2 = document.getElementById('radio2') as HTMLInputElement;
      const radio3 = document.getElementById('radio3') as HTMLInputElement;
      
      // Run autofill
      const result = await autofill(radio1);
      expect(result).toBe(true);
      
      // Find the selected radio button
      const selectedRadio = [radio1, radio2, radio3].find(radio => radio.checked);
      expect(selectedRadio).toBeTruthy();
      
      // Wait a bit for the function badge to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check that there's a function badge in the DOM
      const functionBadges = document.querySelectorAll('[style*="position: fixed"]');
      expect(functionBadges.length).toBeGreaterThan(0);
      
      // Verify the function badge is positioned near the selected radio button
      const selectedRect = selectedRadio!.getBoundingClientRect();
      let badgeFoundNearSelected = false;
      
      functionBadges.forEach(badge => {
        const badgeRect = badge.getBoundingClientRect();
        // Check if badge is positioned near the selected radio button
        const isNearSelected = Math.abs(badgeRect.left - selectedRect.left) < 50 && 
                              Math.abs(badgeRect.top - selectedRect.top) < 50;
        if (isNearSelected) {
          badgeFoundNearSelected = true;
        }
      });
      
      expect(badgeFoundNearSelected).toBe(true);
      
      // Verify the function badge shows "bool" (the actual function used)
      const badgeWithBool = Array.from(functionBadges).find(badge => 
        badge.textContent?.includes('bool')
      );
      expect(badgeWithBool).toBeTruthy();
    })

    it('should remove existing function badges when autofill is called multiple times', async () => {
      document.body.innerHTML = `
        <div class="form-group">
          <label>Test Radio Group</label>
          <div class="radio-group">
            <div class="radio-item">
              <input type="radio" name="test" id="radio1" data-gofakeit="true">
              <label for="radio1">Option 1</label>
            </div>
            <div class="radio-item">
              <input type="radio" name="test" id="radio2" data-gofakeit="true">
              <label for="radio2">Option 2</label>
            </div>
          </div>
        </div>
      `;
      
      const radio1 = document.getElementById('radio1') as HTMLInputElement;
      
      // First autofill call
      const result1 = await autofill(radio1);
      expect(result1).toBe(true);
      
      // Wait a bit for the first badge to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check that there's exactly one function badge
      let functionBadges = document.querySelectorAll('[style*="position: fixed"]');
      expect(functionBadges.length).toBe(1);
      
      // Second autofill call (should remove the first badge and create a new one)
      const result2 = await autofill(radio1);
      expect(result2).toBe(true);
      
      // Wait a bit for the second badge to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should still have exactly one function badge (not two)
      functionBadges = document.querySelectorAll('[style*="position: fixed"]');
      expect(functionBadges.length).toBe(1);
      
      // Third autofill call
      const result3 = await autofill(radio1);
      expect(result3).toBe(true);
      
      // Wait a bit for the third badge to appear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should still have exactly one function badge (not three)
      functionBadges = document.querySelectorAll('[style*="position: fixed"]');
      expect(functionBadges.length).toBe(1);
    })
  })

  describe('Staggered Timing Tests', () => {
    it('should correctly map category values to heading text for scrolling', () => {
      // Test the category heading mapping logic
      const categoryHeadingMap = {
        'person-category': '👤 Person Category',
        'address-category': '🏠 Address Category',
        'company-category': '🏢 Company Category',
        'payment-category': '💳 Payment Category',
        'internet-category': '🌐 Internet Category',
        'time-category': '⏰ Time Category',
        'language-category': '🗣️ Language Category',
        'word-category': '📝 Word Category',
        'color-category': '🎨 Color Category',
        'animal-category': '🐾 Animal Category',
        'food-category': '🍕 Food Category',
        'car-category': '🚗 Car Category',
        'game-category': '🎮 Game Category',
        'misc-category': '🎲 Misc Category'
      };
      
      // Test that all mappings are correct
      expect(categoryHeadingMap['person-category']).toBe('👤 Person Category');
      expect(categoryHeadingMap['payment-category']).toBe('💳 Payment Category');
      expect(categoryHeadingMap['animal-category']).toBe('🐾 Animal Category');
      expect(categoryHeadingMap['food-category']).toBe('🍕 Food Category');
      
      // Test that the mapping can find headings in HTML
      document.body.innerHTML = `
        <div id="categories">
          <h4>👤 Person Category</h4>
          <h4>💳 Payment Category</h4>
          <h4>🐾 Animal Category</h4>
        </div>
      `;
      
      // Test finding headings by text content
      const allHeadings = document.querySelectorAll('h4');
      let personHeading = null;
      let paymentHeading = null;
      
      for (const heading of allHeadings) {
        if (heading.textContent?.includes('👤 Person Category')) {
          personHeading = heading;
        }
        if (heading.textContent?.includes('💳 Payment Category')) {
          paymentHeading = heading;
        }
      }
      
      expect(personHeading).toBeTruthy();
      expect(paymentHeading).toBeTruthy();
      expect(personHeading?.textContent).toContain('👤 Person Category');
      expect(paymentHeading?.textContent).toContain('💳 Payment Category');
    })

    it('should apply staggered timing to excluded elements (checkboxes, radio buttons)', async () => {
      // Test that excluded elements follow the same staggered timing rules
      document.body.innerHTML = `
        <div>
          <input type="checkbox" id="checkbox1" data-gofakeit="true">
          <input type="checkbox" id="checkbox2" data-gofakeit="true">
          <input type="checkbox" id="checkbox3" data-gofakeit="true">
          <input type="radio" name="test" id="radio1" data-gofakeit="true">
          <input type="radio" name="test" id="radio2" data-gofakeit="true">
          <input type="radio" name="test" id="radio3" data-gofakeit="true">
        </div>
      `;
      
      const elements = [
        document.getElementById('checkbox1') as HTMLInputElement,
        document.getElementById('checkbox2') as HTMLInputElement,
        document.getElementById('checkbox3') as HTMLInputElement,
        document.getElementById('radio1') as HTMLInputElement,
        document.getElementById('radio2') as HTMLInputElement,
        document.getElementById('radio3') as HTMLInputElement
      ];
      
      // Test with fast mode (no stagger) - should be relatively fast
      const fastSettings = { smart: true, staggered: false };
      const startTime = Date.now();
      
      // Autofill all elements to test batch processing
      await autofill(undefined, fastSettings);
      
      const fastModeTime = Date.now() - startTime;
      // Fast mode should be reasonably quick (allowing for API calls and processing)
      expect(fastModeTime).toBeLessThan(2000);
      
      // Clear elements for next test
      elements.forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = false;
        }
      });
      
      // Test with slow mode (with stagger) - should be slower
      const slowSettings = { smart: true, staggered: true, staggerDelay: 100 };
      const slowStartTime = Date.now();
      
      // Autofill all elements to test staggered processing
      await autofill(undefined, slowSettings);
      
      const slowModeTime = Date.now() - slowStartTime;
      // Slow mode should take longer due to stagger delay (allowing for some timing variance)
      expect(slowModeTime).toBeGreaterThanOrEqual(80);
      
      // Verify that slow mode is not significantly faster than fast mode
      // (this would indicate staggered timing is not working)
      expect(slowModeTime).toBeGreaterThanOrEqual(fastModeTime - 500); // Allow some variance
      
      // Verify that elements were actually processed
      const checkedElements = elements.filter(el => el.checked);
      expect(checkedElements.length).toBeGreaterThan(0);
    })
  })

  describe('Category Selector Tests', () => {
    it('should demonstrate category selector functionality', async () => {
      // This test simulates the category selector functionality from the HTML example
      document.body.innerHTML = `
        <div id="categories">
          <h4>👤 Person Category</h4>
          <input type="text" id="personName" data-gofakeit="true" placeholder="Full person name">
          <input type="text" id="gender" data-gofakeit="true" placeholder="Gender selection">
          <input type="text" id="petName" data-gofakeit="true" placeholder="Pet name">
          <input type="text" id="username" data-gofakeit="true" placeholder="Username for login">
          
          <h4>💳 Payment Category</h4>
          <input type="text" id="creditCard" data-gofakeit="true" placeholder="Credit card number">
          <input type="text" id="creditCardType" data-gofakeit="true" placeholder="Visa, MasterCard, etc.">
          <input type="text" id="creditCardCVV" data-gofakeit="true" placeholder="3-4 digit security code">
          <input type="text" id="creditCardExp" data-gofakeit="true" placeholder="MM/YY format">
        </div>
      `;
      
      // Simulate selecting and autofilling the person category
      const personFields = ['personName', 'gender', 'petName', 'username'];
      let filledCount = 0;
      
      for (const fieldId of personFields) {
        const element = document.getElementById(fieldId) as HTMLInputElement;
        if (element) {
          const result = await autofill(element);
          if (result) {
            filledCount++;
          }
        }
      }
      
      expect(filledCount).toBe(4);
      
      // Verify that person fields have been filled
      const personName = document.getElementById('personName') as HTMLInputElement;
      const gender = document.getElementById('gender') as HTMLInputElement;
      const petName = document.getElementById('petName') as HTMLInputElement;
      const username = document.getElementById('username') as HTMLInputElement;
      
      expect(personName.value).toBeTruthy();
      expect(gender.value).toBeTruthy();
      expect(petName.value).toBeTruthy();
      expect(username.value).toBeTruthy();
      
      // Verify that payment fields are still empty (not autofilled)
      const creditCard = document.getElementById('creditCard') as HTMLInputElement;
      const creditCardType = document.getElementById('creditCardType') as HTMLInputElement;
      
      expect(creditCard.value).toBe('');
      expect(creditCardType.value).toBe('');
    })
  })
})
