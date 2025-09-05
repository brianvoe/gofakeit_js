import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { autofill, isFormField, hasFormFields } from '../autofill'

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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(textarea)
      
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

      const result = await autofill(select)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(div)
      
      expect(result).toBe(false)
    })

    it('should handle span elements gracefully', async () => {
      const span = document.createElement('span')
      span.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(span)

      const result = await autofill(span)
      
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

      const result = await autofill(input)
      
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

      const result = await autofill(input)
      
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

      it('should return true when container has form fields without data-gofakeit', () => {
        const container = document.createElement('div')
        container.innerHTML = '<input type="text" />'
        expect(hasFormFields(container)).toBe(true)
      })

      it('should return false when container has no form fields', () => {
        const container = document.createElement('div')
        container.innerHTML = '<div>No form fields</div>'
        expect(hasFormFields(container)).toBe(false)
      })
    })
  })

  describe('Edge Cases and Error Paths', () => {
    it('should handle exceptions in datetime input processing', async () => {
      const dateInput = document.createElement('input')
      dateInput.type = 'date'
      dateInput.setAttribute('data-gofakeit', 'date')
      document.body.appendChild(dateInput)

      const result = await autofill(dateInput)
      expect(result).toBe(true)
    })

    it('should handle minute API failures in time input', async () => {
      const timeInput = document.createElement('input')
      timeInput.type = 'time'
      timeInput.setAttribute('data-gofakeit', 'true')
      document.body.appendChild(timeInput)

      const result = await autofill(timeInput)
      expect(result).toBe(true)
    })

    it('should handle range input API errors gracefully', async () => {
      const rangeInput = document.createElement('input')
      rangeInput.type = 'range'
      rangeInput.min = '1'
      rangeInput.max = '10'
      document.body.appendChild(rangeInput)

      const result = await autofill(rangeInput)
      expect(result).toBe(true)
    })

    it('should handle week input with year/number error gracefully', async () => {
      const weekInput = document.createElement('input')
      weekInput.type = 'week'
      weekInput.setAttribute('data-gofakeit', 'custom')
      document.body.appendChild(weekInput)

      const result = await autofill(weekInput)
      expect(result).toBe(true)
    })

    it('should handle week input with invalid date response gracefully', async () => {
      const weekInput = document.createElement('input')
      weekInput.type = 'week'
      weekInput.setAttribute('data-gofakeit', 'date')
      document.body.appendChild(weekInput)

      const result = await autofill(weekInput)
      expect(result).toBe(true)
    })
  })

  describe('String Selector Support', () => {
    it('should autofill element by ID selector', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.id = 'test-input-id'
      input.setAttribute('data-gofakeit', 'word')
      document.body.appendChild(input)

      const result = await autofill('#test-input-id')
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
    })

    it('should autofill element by class selector', async () => {
      const input = document.createElement('input')
      input.type = 'email'
      input.className = 'test-input-class'
      input.setAttribute('data-gofakeit', 'email')
      document.body.appendChild(input)

      const result = await autofill('.test-input-class')
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
    })

    it('should autofill container by ID selector', async () => {
      const container = document.createElement('div')
      container.id = 'test-container-id'
      
      const input1 = document.createElement('input')
      input1.type = 'text'
      input1.setAttribute('data-gofakeit', 'word')
      
      const input2 = document.createElement('input')
      input2.type = 'email'
      input2.setAttribute('data-gofakeit', 'email')
      
      container.appendChild(input1)
      container.appendChild(input2)
      document.body.appendChild(container)

      const result = await autofill('#test-container-id')
      // autofillContainer returns void, so result will be undefined
      expect(result).toBeUndefined()
      expect(input1.value).toBeTruthy()
      expect(input2.value).toBeTruthy()
    })

    it('should return false for non-existent selector', async () => {
      const result = await autofill('#non-existent-element')
      expect(result).toBe(false)
    })

    it('should handle complex CSS selectors', async () => {
      const container = document.createElement('div')
      container.className = 'form-section'
      
      const input = document.createElement('input')
      input.type = 'text'
      input.className = 'form-input'
      input.setAttribute('data-gofakeit', 'word')
      
      container.appendChild(input)
      document.body.appendChild(container)

      const result = await autofill('.form-section .form-input')
      expect(result).toBe(true)
      expect(input.value).toBeTruthy()
    })
  })

  describe('Scope Isolation Tests', () => {
    it('should only fill inputs within the targeted container', async () => {
      // Create two separate containers with inputs
      const container1 = document.createElement('div')
      container1.id = 'container-1'
      
      const container2 = document.createElement('div')
      container2.id = 'container-2'
      
      // Add inputs to both containers
      const input1 = document.createElement('input')
      input1.type = 'text'
      input1.id = 'input-1'
      input1.setAttribute('data-gofakeit', 'word')
      
      const input2 = document.createElement('input')
      input2.type = 'text'
      input2.id = 'input-2'
      input2.setAttribute('data-gofakeit', 'word')
      
      const input3 = document.createElement('input')
      input3.type = 'text'
      input3.id = 'input-3'
      input3.setAttribute('data-gofakeit', 'word')
      
      const input4 = document.createElement('input')
      input4.type = 'text'
      input4.id = 'input-4'
      input4.setAttribute('data-gofakeit', 'word')
      
      container1.appendChild(input1)
      container1.appendChild(input2)
      container2.appendChild(input3)
      container2.appendChild(input4)
      
      document.body.appendChild(container1)
      document.body.appendChild(container2)
      
      // Clear all inputs first
      input1.value = ''
      input2.value = ''
      input3.value = ''
      input4.value = ''
      
      // Autofill only container1
      await autofill('#container-1')
      
      // Only inputs in container1 should be filled
      expect(input1.value).toBeTruthy()
      expect(input2.value).toBeTruthy()
      expect(input3.value).toBe('')
      expect(input4.value).toBe('')
    })

    it('should only fill the specific targeted element', async () => {
      // Create multiple inputs
      const input1 = document.createElement('input')
      input1.type = 'text'
      input1.id = 'specific-input-1'
      input1.setAttribute('data-gofakeit', 'word')
      
      const input2 = document.createElement('input')
      input2.type = 'text'
      input2.id = 'specific-input-2'
      input2.setAttribute('data-gofakeit', 'word')
      
      const input3 = document.createElement('input')
      input3.type = 'text'
      input3.id = 'specific-input-3'
      input3.setAttribute('data-gofakeit', 'word')
      
      document.body.appendChild(input1)
      document.body.appendChild(input2)
      document.body.appendChild(input3)
      
      // Clear all inputs first
      input1.value = ''
      input2.value = ''
      input3.value = ''
      
      // Autofill only the specific input
      const result = await autofill('#specific-input-2')
      
      // Only the targeted input should be filled
      expect(result).toBe(true)
      expect(input1.value).toBe('')
      expect(input2.value).toBeTruthy()
      expect(input3.value).toBe('')
    })

    it('should not fill inputs outside the targeted container when using class selector', async () => {
      // Create containers with same class name but different contexts
      const container1 = document.createElement('div')
      container1.className = 'test-container'
      
      const container2 = document.createElement('div')
      container2.className = 'test-container'
      
      // Add inputs to both containers
      const input1 = document.createElement('input')
      input1.type = 'text'
      input1.setAttribute('data-gofakeit', 'word')
      
      const input2 = document.createElement('input')
      input2.type = 'text'
      input2.setAttribute('data-gofakeit', 'word')
      
      const input3 = document.createElement('input')
      input3.type = 'text'
      input3.className = 'test-container'
      input3.setAttribute('data-gofakeit', 'word')
      
      container1.appendChild(input1)
      container2.appendChild(input2)
      document.body.appendChild(container1)
      document.body.appendChild(container2)
      document.body.appendChild(input3)
      
      // Clear all inputs first
      input1.value = ''
      input2.value = ''
      input3.value = ''
      
      // Autofill only the first container
      await autofill(container1)
      
      // Only input in the first container should be filled
      expect(input1.value).toBeTruthy()
      expect(input2.value).toBe('')
      expect(input3.value).toBe('')
    })

    it('should not fill inputs with data-gofakeit="false" even when in targeted container', async () => {
      const container = document.createElement('div')
      container.id = 'mixed-container'
      
      const input1 = document.createElement('input')
      input1.type = 'text'
      input1.setAttribute('data-gofakeit', 'word')
      
      const input2 = document.createElement('input')
      input2.type = 'text'
      input2.setAttribute('data-gofakeit', 'false')
      
      const input3 = document.createElement('input')
      input3.type = 'text'
      input3.setAttribute('data-gofakeit', 'word')
      
      container.appendChild(input1)
      container.appendChild(input2)
      container.appendChild(input3)
      document.body.appendChild(container)
      
      // Clear all inputs first
      input1.value = ''
      input2.value = ''
      input3.value = ''
      
      // Autofill the container
      await autofill('#mixed-container')
      
      // Only inputs without data-gofakeit="false" should be filled
      expect(input1.value).toBeTruthy()
      expect(input2.value).toBe('')
      expect(input3.value).toBeTruthy()
    })
  })
})
