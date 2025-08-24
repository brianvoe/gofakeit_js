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
      expect(Number(input.value)).toBeGreaterThan(0)
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
  })
})
