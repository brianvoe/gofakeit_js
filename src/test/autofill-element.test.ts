import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { autofillElement, isFormField, hasFormFields } from '../autofill'

describe('Autofill Single Element', () => {
  let originalBody: string

  beforeEach(() => {
    // Store original body content
    originalBody = document.body.innerHTML
  })

  afterEach(() => {
    // Restore original body content
    document.body.innerHTML = originalBody
  })

  describe('Text Input Elements', () => {
    it('should autofill a text input with data-gofakeit="true"', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should autofill an email input', async () => {
      const input = document.createElement('input')
      input.type = 'email'
      input.name = 'emailField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value).toContain('@')
    })

    it('should autofill a phone input', async () => {
      const input = document.createElement('input')
      input.type = 'tel'
      input.name = 'phoneField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should not autofill when data-gofakeit="false"', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'disabledField'
      input.setAttribute('data-gofakeit', 'false')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(false)
      expect(input.value).toBe('')
    })
  })

  describe('Textarea Elements', () => {
    it('should autofill a textarea', async () => {
      const textarea = document.createElement('textarea')
      textarea.name = 'bioField'
      textarea.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(textarea)

      const result = await autofillElement(textarea)
      
      expect(result).toBe(true)
      expect(textarea.value).toBeTruthy()
      expect(textarea.value.length).toBeGreaterThan(0)
    })
  })

  describe('Select Elements', () => {
    it('should autofill a select dropdown', async () => {
      const select = document.createElement('select')
      select.name = 'countryField'
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
  })

  describe('Number Input Elements', () => {
    it('should autofill a number input', async () => {
      const input = document.createElement('input')
      input.type = 'number'
      input.name = 'ageField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
      expect(Number(input.value)).not.toBeNaN()
    })

    it('should autofill a range input', async () => {
      const input = document.createElement('input')
      input.type = 'range'
      input.name = 'ratingField'
      input.min = '1'
      input.max = '10'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
      const value = Number(input.value)
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)
    })
  })

  describe('Date/Time Input Elements', () => {
    it('should autofill a date input', async () => {
      const input = document.createElement('input')
      input.type = 'date'
      input.name = 'birthdateField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should autofill a time input', async () => {
      const input = document.createElement('input')
      input.type = 'time'
      input.name = 'meetingTimeField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })
  })

  describe('Checkbox and Radio Elements', () => {
    it('should autofill a checkbox', async () => {
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.name = 'newsletterField'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      // Checkbox state is random, so we just verify it's a boolean
      expect(typeof input.checked).toBe('boolean')
    })

    it('should autofill a radio button', async () => {
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = 'genderField'
      input.value = 'male'
      input.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      // Radio state is random, so we just verify it's a boolean
      expect(typeof input.checked).toBe('boolean')
    })
  })

  describe('Non-Form Elements', () => {
    it('should handle div elements gracefully', async () => {
      const div = document.createElement('div')
      div.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(div)

      const result = await autofillElement(div)
      
      expect(result).toBe(false)
    })

    it('should handle span elements gracefully', async () => {
      const span = document.createElement('span')
      span.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(span)

      const result = await autofillElement(span)
      
      expect(result).toBe(false)
    })
  })

  describe('Custom Function Names', () => {
    it('should use custom function when specified', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'customField'
      input.setAttribute('data-gofakeit', 'company')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('should handle function with parameters', async () => {
      const input = document.createElement('input')
      input.type = 'number'
      input.name = 'ageField'
      input.setAttribute('data-gofakeit', 'number?min=18&max=65')
      document.body.appendChild(input)

      const result = await autofillElement(input)
      
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
      const value = Number(input.value)
      expect(value).toBeGreaterThanOrEqual(18)
      expect(value).toBeLessThanOrEqual(65)
    })
  })

  describe('Utility Functions', () => {
    describe('isFormField', () => {
      it('should identify input elements with data-gofakeit as form fields', () => {
        const input = document.createElement('input')
        input.type = 'text'
        input.setAttribute('data-gofakeit', 'true')
        expect(isFormField(input)).toBe(true)
      })

      it('should identify textarea elements with data-gofakeit as form fields', () => {
        const textarea = document.createElement('textarea')
        textarea.setAttribute('data-gofakeit', 'true')
        expect(isFormField(textarea)).toBe(true)
      })

      it('should identify select elements with data-gofakeit as form fields', () => {
        const select = document.createElement('select')
        select.setAttribute('data-gofakeit', 'true')
        expect(isFormField(select)).toBe(true)
      })

      it('should not identify elements without data-gofakeit as form fields', () => {
        const input = document.createElement('input')
        input.type = 'text'
        expect(isFormField(input)).toBe(false)
      })

      it('should not identify div elements as form fields', () => {
        const div = document.createElement('div')
        div.setAttribute('data-gofakeit', 'true')
        expect(isFormField(div)).toBe(false)
      })
    })

    describe('hasFormFields', () => {
      it('should return true when container has form fields with data-gofakeit', () => {
        const container = document.createElement('div')
        container.innerHTML = '<input type="text" data-gofakeit="true" />'
        expect(hasFormFields(container)).toBe(true)
      })

      it('should return false when container has no form fields with data-gofakeit', () => {
        const container = document.createElement('div')
        container.innerHTML = '<input type="text" />'
        expect(hasFormFields(container)).toBe(false)
      })

      it('should return false when container has no form fields', () => {
        const container = document.createElement('div')
        container.innerHTML = '<div>No form fields</div>'
        expect(hasFormFields(container)).toBe(false)
      })
    })
  })
})
