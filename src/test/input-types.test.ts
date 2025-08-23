import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { autofillElement } from '../autofill'

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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
      // Button inputs may or may not be handled depending on implementation
      expect(typeof result).toBe('boolean')
    })

    it('should handle submit input gracefully', async () => {
      const input = document.createElement('input')
      input.type = 'submit'
      input.name = 'submitForm'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      // Submit inputs may or may not be handled depending on implementation
      expect(typeof result).toBe('boolean')
    })

    it('should handle reset input gracefully', async () => {
      const input = document.createElement('input')
      input.type = 'reset'
      input.name = 'resetForm'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(input)
      
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

      const result = await autofillElement(textarea)
      
      expect(result).toBe(true)
      expect(textarea.value).toBeTruthy()
      expect(textarea.value.length).toBeGreaterThan(0)
    })

    it('should handle textarea with custom function', async () => {
      const textarea = document.createElement('textarea')
      textarea.name = 'longDescription'
      textarea.setAttribute('data-gofakeit', 'paragraph')
      document.body.appendChild(textarea)

      const result = await autofillElement(textarea)
      
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

      const result = await autofillElement(select)
      
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

      const result = await autofillElement(select)
      
      expect(result).toBe(true)
      // The language function might not be available, so we just check the result
      expect(typeof result).toBe('boolean')
    })
  })
})
