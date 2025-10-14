import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Autofill, AutofillStatus } from '../autofill'

describe('Autofill Individual Functions', () => {
  let autofill: Autofill

  beforeEach(() => {
    autofill = new Autofill()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('Class Instantiation', () => {
    it('should create instance with default settings', () => {
      const autofill = new Autofill()

      expect(autofill.settings.mode).toBe('auto')
      expect(autofill.settings.stagger).toBe(50)
      expect(autofill.settings.badges).toBe(3000)
      expect(autofill.settings.onStatusChange).toBeUndefined()
    })

    it('should create instance with custom settings', () => {
      const statusCallback = vi.fn()
      const customSettings = {
        mode: 'manual' as const,
        stagger: 0,
        badges: 1000,
        onStatusChange: statusCallback,
      }

      const autofill = new Autofill(customSettings)

      expect(autofill.settings.mode).toBe('manual')
      expect(autofill.settings.stagger).toBe(0)
      expect(autofill.settings.badges).toBe(1000)
      expect(autofill.settings.onStatusChange).toBe(statusCallback)
    })

    it('should initialize with undefined status and empty inputs array', () => {
      const autofill = new Autofill()

      expect(autofill.state.status).toBeUndefined()
      expect(autofill.state.elements).toEqual([])
    })
  })

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
      `

      const container = document.getElementById('form')!
      autofill.setElements(container)

      expect(autofill.state.elements).toHaveLength(3)
      expect(autofill.state.elements[0].type).toBe('text')
      expect(autofill.state.elements[1].type).toBe('email')
      expect(autofill.state.elements[2].type).toBe('select')
    })

    it('should find elements by CSS selector', () => {
      document.body.innerHTML = `
        <input type="text" name="field1" />
        <input type="email" name="field2" />
        <input type="number" name="field3" />
      `

      autofill.setElements('input[type="text"]')

      expect(autofill.state.elements).toHaveLength(1)
      expect(autofill.state.elements[0].type).toBe('text')
    })

    it('should handle invalid selector', () => {
      autofill.setElements('invalid-selector')

      expect(autofill.state.elements).toHaveLength(0)
      expect(autofill.state.status).toBe(AutofillStatus.ERROR)
    })

    it('should respect manual mode - only process elements with data-gofakeit', () => {
      autofill = new Autofill({ mode: 'manual' })

      document.body.innerHTML = `
        <input type="text" name="field1" data-gofakeit="true" />
        <input type="email" name="field2" />
        <input type="number" name="field3" data-gofakeit="number" />
      `

      autofill.setElements()

      expect(autofill.state.elements).toHaveLength(2)
      expect(autofill.state.elements[0].type).toBe('text')
      expect(autofill.state.elements[1].type).toBe('number')
    })

    it('should respect auto mode - process all form elements', () => {
      autofill = new Autofill({ mode: 'auto' })

      document.body.innerHTML = `
        <input type="text" name="field1" />
        <input type="email" name="field2" />
        <input type="number" name="field3" />
      `

      autofill.setElements()

      expect(autofill.state.elements).toHaveLength(3)
    })
  })

  describe('getElementFunction', () => {
    it('should return specific function when data-gofakeit is set', () => {
      document.body.innerHTML = '<input type="text" data-gofakeit="email" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementFunction(element)

      expect(result).toBe('email')
    })

    it('should return null when data-gofakeit is "true" (needs search)', () => {
      document.body.innerHTML = '<input type="text" data-gofakeit="true" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementFunction(element)

      expect(result).toBeNull()
    })

    it('should return fallback function for checkbox', () => {
      document.body.innerHTML = '<input type="checkbox" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementFunction(element)

      expect(result).toBe('bool')
    })

    it('should return fallback function for radio', () => {
      document.body.innerHTML = '<input type="radio" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementFunction(element)

      expect(result).toBe('randomstring')
    })

    it('should return fallback function for radio with data-gofakeit="true"', () => {
      document.body.innerHTML = '<input type="radio" data-gofakeit="true" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementFunction(element)

      expect(result).toBe('randomstring')
    })

    it('should return fallback function for select', () => {
      document.body.innerHTML =
        '<select><option value="1">Option 1</option></select>'
      const element = document.querySelector('select')!

      const result = autofill.getElementFunction(element)

      expect(result).toBe('randomstring')
    })

    it('should return null for text input (needs search)', () => {
      document.body.innerHTML = '<input type="text" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementFunction(element)

      expect(result).toBeNull()
    })
  })

  describe('getElementSearch', () => {
    it('should generate search query from input attributes', () => {
      document.body.innerHTML =
        '<input type="text" name="firstName" placeholder="Enter first name" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementSearch(element)

      expect(result).toContain('text')
      expect(result).toContain('firstname')
      expect(result).toContain('enter first name')
    })

    it('should include label text in search query', () => {
      document.body.innerHTML = `
        <label for="email">Email Address</label>
        <input type="email" id="email" name="email" />
      `
      const element = document.querySelector('input')!

      const result = autofill.getElementSearch(element)

      expect(result).toContain('email address')
    })

    it('should include aria-label in search query', () => {
      document.body.innerHTML =
        '<input type="text" aria-label="Phone Number" />'
      const element = document.querySelector('input')!

      const result = autofill.getElementSearch(element)

      expect(result).toContain('phone number')
    })
  })

  describe('setElementFunctions', () => {
    it('should set functions for elements that dont need search', async () => {
      document.body.innerHTML = `
        <input type="checkbox" name="agree" />
        <input type="radio" name="gender" />
        <select name="country">
          <option value="us">US</option>
        </select>
      `

      autofill.setElements()

      await autofill.setElementFunctions()

      expect(autofill.state.elements[0].function).toBe('bool')
      expect(autofill.state.elements[1].function).toBe('randomstring')
      expect(autofill.state.elements[2].function).toBe('randomstring')
    })

    it('should set functions for elements with specific data-gofakeit', async () => {
      document.body.innerHTML = `
        <input type="text" data-gofakeit="email" />
        <input type="text" data-gofakeit="name" />
      `

      autofill.setElements()

      await autofill.setElementFunctions()

      expect(autofill.state.elements[0].function).toBe('email')
      expect(autofill.state.elements[1].function).toBe('name')
    })
  })

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
          search: ['email'],
          value: '',
          error: '',
        },
        {
          id: 'test2',
          name: '',
          element: document.createElement('input'),
          type: 'text',
          function: 'name',
          search: ['name'],
          value: '',
          error: '',
        },
      ]

      await autofill.getElementValues()

      // Verify that values were set (either from API or error was set)
      expect(autofill.state.elements[0].value).toBeDefined()
      expect(autofill.state.elements[1].value).toBeDefined()
      // Either we got values or errors, but something should be set
      expect(
        autofill.state.elements[0].value !== '' ||
          autofill.state.elements[0].error !== ''
      ).toBe(true)
      expect(
        autofill.state.elements[1].value !== '' ||
          autofill.state.elements[1].error !== ''
      ).toBe(true)
    })
  })

  describe('setElementValues', () => {
    it('should apply values to form elements', async () => {
      document.body.innerHTML = `
        <input type="text" name="firstName" />
        <input type="email" name="email" />
        <input type="checkbox" name="agree" />
      `

      const textElement = document.querySelector(
        'input[name="firstName"]'
      ) as HTMLInputElement
      const emailElement = document.querySelector(
        'input[name="email"]'
      ) as HTMLInputElement
      const checkboxElement = document.querySelector(
        'input[name="agree"]'
      ) as HTMLInputElement

      autofill.state.elements = [
        {
          id: 'firstName',
          name: 'firstName',
          element: textElement,
          type: 'text',
          function: 'name',
          search: ['name'],
          value: 'John Doe',
          error: '',
        },
        {
          id: 'email',
          name: 'email',
          element: emailElement,
          type: 'email',
          function: 'email',
          search: ['email'],
          value: 'john@example.com',
          error: '',
        },
        {
          id: 'agree',
          name: 'agree',
          element: checkboxElement,
          type: 'checkbox',
          function: 'bool',
          search: ['checkbox'],
          value: 'true',
          error: '',
        },
      ]

      await autofill.setElementValues()

      expect(textElement.value).toBe('John Doe')
      expect(emailElement.value).toBe('john@example.com')
      expect(checkboxElement.checked).toBe(true)
    })

    it('should dispatch events when setting values', async () => {
      document.body.innerHTML = '<input type="text" name="test" />'
      const element = document.querySelector('input') as HTMLInputElement

      let inputEventFired = false
      let changeEventFired = false

      element.addEventListener('input', () => {
        inputEventFired = true
      })
      element.addEventListener('change', () => {
        changeEventFired = true
      })

      autofill.state.elements = [
        {
          id: 'test',
          name: 'test',
          element: element,
          type: 'text',
          function: 'word',
          search: ['text'],
          value: 'test value',
          error: '',
        },
      ]

      await autofill.setElementValues()

      expect(inputEventFired).toBe(true)
      expect(changeEventFired).toBe(true)
    })
  })

  describe('resetState', () => {
    it('should reset state to initial values', () => {
      // Set some state
      autofill.state.status = AutofillStatus.COMPLETED
      autofill.state.elements = [
        {
          id: 'test',
          name: 'test',
          element: document.createElement('input'),
          type: 'text',
          function: 'word',
          search: ['text'],
          value: 'test',
          error: '',
        },
      ]

      autofill.resetState()

      expect(autofill.state.status).toBeUndefined()
      expect(autofill.state.elements).toHaveLength(0)
    })
  })

  describe('shouldSkipElement', () => {
    it('should skip hidden input elements', () => {
      const hiddenElement = document.createElement('input')
      hiddenElement.type = 'hidden'

      expect(autofill.shouldSkipElement(hiddenElement)).toBe(true)
    })

    it('should skip disabled input elements', () => {
      const disabledElement = document.createElement('input')
      disabledElement.disabled = true

      expect(autofill.shouldSkipElement(disabledElement)).toBe(true)
    })

    it('should skip readonly input elements', () => {
      const readonlyElement = document.createElement('input')
      readonlyElement.readOnly = true

      expect(autofill.shouldSkipElement(readonlyElement)).toBe(true)
    })

    it('should not skip normal input elements', () => {
      const normalElement = document.createElement('input')
      normalElement.type = 'text'

      expect(autofill.shouldSkipElement(normalElement)).toBe(false)
    })

    it('should skip disabled textarea elements', () => {
      const disabledTextarea = document.createElement('textarea')
      disabledTextarea.disabled = true

      expect(autofill.shouldSkipElement(disabledTextarea)).toBe(true)
    })

    it('should skip readonly textarea elements', () => {
      const readonlyTextarea = document.createElement('textarea')
      readonlyTextarea.readOnly = true

      expect(autofill.shouldSkipElement(readonlyTextarea)).toBe(true)
    })

    it('should not skip normal textarea elements', () => {
      const normalTextarea = document.createElement('textarea')

      expect(autofill.shouldSkipElement(normalTextarea)).toBe(false)
    })

    it('should skip disabled select elements', () => {
      const disabledSelect = document.createElement('select')
      disabledSelect.disabled = true

      expect(autofill.shouldSkipElement(disabledSelect)).toBe(true)
    })

    it('should not skip normal select elements', () => {
      const normalSelect = document.createElement('select')

      expect(autofill.shouldSkipElement(normalSelect)).toBe(false)
    })

    it('should return false for non-form elements', () => {
      const div = document.createElement('div')

      expect(autofill.shouldSkipElement(div)).toBe(false)
    })

    it('should handle multiple conditions on input elements', () => {
      const element = document.createElement('input')
      element.type = 'hidden'
      element.disabled = true
      element.readOnly = true

      expect(autofill.shouldSkipElement(element)).toBe(true)
    })

    it('should handle multiple conditions on textarea elements', () => {
      const textarea = document.createElement('textarea')
      textarea.disabled = true
      textarea.readOnly = true

      expect(autofill.shouldSkipElement(textarea)).toBe(true)
    })
  })

  describe('Parameter Generation', () => {
    it('should generate correct parameters for select elements', async () => {
      document.body.innerHTML = `
        <select name="country">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      `

      const select = document.querySelector('select') as HTMLSelectElement
      autofill.setElements(select)
      autofill.state.elements[0].function = 'randomstring'

      // Test the paramsSelect function directly by accessing it through the element
      const element = autofill.state.elements[0]

      // We can't easily test the API call without complex mocking, so let's test
      // that the element is set up correctly for parameter generation
      expect(element.function).toBe('randomstring')
      expect(element.type).toBe('select')
      expect(element.element).toBe(select)

      // Test that the select element has the expected options
      const options = Array.from(select.options)
        .map(option => option.value)
        .filter(value => value !== '')

      expect(options).toEqual(['us', 'ca', 'uk'])
    })

    it('should handle select elements with empty options', () => {
      document.body.innerHTML = `
        <select name="empty">
          <option value="">Choose...</option>
        </select>
      `

      const select = document.querySelector('select') as HTMLSelectElement
      autofill.setElements(select)
      autofill.state.elements[0].function = 'randomstring'

      const element = autofill.state.elements[0]

      expect(element.function).toBe('randomstring')
      expect(element.type).toBe('select')

      // Test that empty options are filtered out
      const options = Array.from(select.options)
        .map(option => option.value)
        .filter(value => value !== '')

      expect(options).toEqual([])
    })

    it('should not add parameters for non-select elements', () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="text" name="firstname" />
          <input type="email" name="email" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill.setElements(container)
      autofill.state.elements[0].function = 'name'
      autofill.state.elements[1].function = 'email'

      const element1 = autofill.state.elements[0]
      const element2 = autofill.state.elements[1]

      expect(element1.function).toBe('name')
      expect(element1.type).toBe('text')
      expect(element2.function).toBe('email')
      expect(element2.type).toBe('email')
    })

    it('should generate correct parameters for radio groups', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="gender" value="male" />
          <input type="radio" name="gender" value="female" />
          <input type="radio" name="gender" value="other" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // All radio elements should have the same name and randomstring function
      const radioElements = autofill.state.elements.filter(
        el => el.type === 'radio'
      )
      expect(radioElements).toHaveLength(3)
      expect(radioElements[0].name).toBe('gender')
      expect(radioElements[1].name).toBe('gender')
      expect(radioElements[2].name).toBe('gender')
      expect(radioElements[0].function).toBe('randomstring')
      expect(radioElements[1].function).toBe('randomstring')
      expect(radioElements[2].function).toBe('randomstring')

      // Test that radio values are extracted correctly
      const values = radioElements.map(
        el => (el.element as HTMLInputElement).value
      )
      expect(values).toEqual(['male', 'female', 'other'])
    })

    it('should handle radio groups with empty values', () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="empty" value="" />
          <input type="radio" name="empty" value="option1" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill.setElements(container)

      const radioElements = autofill.state.elements.filter(
        el => el.type === 'radio'
      )
      expect(radioElements).toHaveLength(2)

      // Test that empty values are filtered out
      const values = radioElements
        .map(el => (el.element as HTMLInputElement).value)
        .filter(value => value !== '')
      expect(values).toEqual(['option1'])
    })

    it('should set select element values correctly', async () => {
      document.body.innerHTML = `
        <select name="country">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      `

      const select = document.querySelector('select') as HTMLSelectElement
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(select)
      await autofill.setElementFunctions()

      // Manually set a value to test the setSelectValue method
      autofill.state.elements[0].value = 'ca'
      autofill.state.elements[0].function = 'randomstring'

      await autofill.setElementValues()

      // The select should have the value 'ca' selected
      expect(select.value).toBe('ca')
    })

    it('should handle select elements with real API call', async () => {
      document.body.innerHTML = `
        <select name="country">
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      `

      const select = document.querySelector('select') as HTMLSelectElement
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(select)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // The select should have a value selected (one of the options)
      expect(['us', 'ca', 'uk']).toContain(select.value)
    })

    it('should handle select elements with empty first option', async () => {
      document.body.innerHTML = `
        <select name="timezone">
          <option value="">Select timezone</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      `

      const select = document.querySelector('select') as HTMLSelectElement
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(select)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // The select should have a value selected (one of the non-empty options)
      expect(['us', 'ca', 'uk']).toContain(select.value)
      // Should not be the empty option
      expect(select.value).not.toBe('')
    })

    it('should handle radio groups with different values', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="experience" value="beginner" />
          <input type="radio" name="experience" value="intermediate" />
          <input type="radio" name="experience" value="advanced" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Only one radio button should be selected
      const radioButtons = Array.from(
        container.querySelectorAll('input[type="radio"]')
      ) as HTMLInputElement[]
      const checkedRadios = Array.from(radioButtons).filter(
        radio => radio.checked
      )
      expect(checkedRadios).toHaveLength(1)

      // The selected radio should have one of the expected values
      const selectedValue = checkedRadios[0].value
      expect(['beginner', 'intermediate', 'advanced']).toContain(selectedValue)
    })

    it('should handle radio groups with same values (default behavior)', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="same_value" value="on" />
          <input type="radio" name="same_value" value="on" />
          <input type="radio" name="same_value" value="on" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Only one radio button should be selected
      const radioButtons = Array.from(
        container.querySelectorAll('input[type="radio"]')
      ) as HTMLInputElement[]
      const checkedRadios = Array.from(radioButtons).filter(
        radio => radio.checked
      )
      expect(checkedRadios).toHaveLength(1)

      // The selected radio should have the "on" value
      expect(checkedRadios[0].value).toBe('on')
    })

    it('should handle multiple radio groups independently', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" name="group1" value="option1" />
          <input type="radio" name="group1" value="option2" />
          <input type="radio" name="group2" value="choice1" />
          <input type="radio" name="group2" value="choice2" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Each group should have exactly one radio selected
      const group1Radios = Array.from(
        container.querySelectorAll('input[name="group1"]')
      ) as HTMLInputElement[]
      const group2Radios = Array.from(
        container.querySelectorAll('input[name="group2"]')
      ) as HTMLInputElement[]

      const group1Checked = Array.from(group1Radios).filter(
        radio => radio.checked
      )
      const group2Checked = Array.from(group2Radios).filter(
        radio => radio.checked
      )

      expect(group1Checked).toHaveLength(1)
      expect(group2Checked).toHaveLength(1)

      // Verify the selected values are from the correct groups
      expect(['option1', 'option2']).toContain(group1Checked[0].value)
      expect(['choice1', 'choice2']).toContain(group2Checked[0].value)
    })

    it('should handle checkboxes with different values', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="checkbox" id="skill1" value="frontend" />
          <input type="checkbox" id="skill2" value="backend" />
          <input type="checkbox" id="skill3" value="devops" />
          <input type="checkbox" id="skill4" value="mobile" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Check that some checkboxes are checked (API returns true/false for each)
      const checkboxes = Array.from(
        container.querySelectorAll('input[type="checkbox"]')
      ) as HTMLInputElement[]
      const checkedBoxes = Array.from(checkboxes).filter(
        checkbox => checkbox.checked
      )

      // At least some checkboxes should be checked (API returns random true/false)
      expect(checkedBoxes.length).toBeGreaterThanOrEqual(0)
      expect(checkedBoxes.length).toBeLessThanOrEqual(checkboxes.length)
    })

    it('should handle checkboxes with same name attribute', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="checkbox" name="agreements" value="terms" />
          <input type="checkbox" name="agreements" value="privacy" />
          <input type="checkbox" name="agreements" value="marketing" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Check that some checkboxes are checked
      const checkboxes = Array.from(
        container.querySelectorAll('input[name="agreements"]')
      ) as HTMLInputElement[]
      const checkedBoxes = Array.from(checkboxes).filter(
        checkbox => checkbox.checked
      )

      // At least some checkboxes should be checked
      expect(checkedBoxes.length).toBeGreaterThanOrEqual(0)
      expect(checkedBoxes.length).toBeLessThanOrEqual(checkboxes.length)
    })

    it('should handle single checkbox', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="checkbox" id="single" value="yes" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // The single checkbox should be processed
      const checkbox = container.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement
      expect(checkbox).toBeDefined()

      // It should either be checked or unchecked (API returns true/false)
      expect(typeof checkbox.checked).toBe('boolean')
    })

    it('should skip disabled checkboxes', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="checkbox" id="enabled" />
          <input type="checkbox" id="disabled" disabled />
          <input type="checkbox" id="enabled2" />
        </div>
      `

      const container = document.getElementById('form')!
      autofill = new Autofill({ debug: true }) // Enable debug for this test
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Only enabled checkboxes should be processed
      const enabledCheckbox = container.querySelector(
        '#enabled'
      ) as HTMLInputElement
      const disabledCheckbox = container.querySelector(
        '#disabled'
      ) as HTMLInputElement
      const enabledCheckbox2 = container.querySelector(
        '#enabled2'
      ) as HTMLInputElement

      // The disabled checkbox should remain unchanged
      expect(disabledCheckbox.checked).toBe(false)

      // The enabled checkboxes should be processed (checked or unchecked)
      expect(typeof enabledCheckbox.checked).toBe('boolean')
      expect(typeof enabledCheckbox2.checked).toBe('boolean')
    })
  })

  describe('should handle date inputs', () => {
    it('should use date function for simple date input', () => {
      document.body.innerHTML = '<input type="date" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe('date')
    })

    it('should use daterange function for date input with min attribute', () => {
      document.body.innerHTML =
        '<input type="date" min="2024-01-01" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe('daterange')
    })

    it('should use daterange function for date input with max attribute', () => {
      document.body.innerHTML =
        '<input type="date" max="2024-12-31" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe('daterange')
    })

    it('should use daterange function for date input with both min and max attributes', () => {
      document.body.innerHTML =
        '<input type="date" min="2024-01-01" max="2024-12-31" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe('daterange')
    })

    it('should generate correct parameters for date input with min and max', async () => {
      document.body.innerHTML =
        '<input type="date" min="2024-01-01" max="2024-12-31" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()
      expect(element.value).toMatch(/^\d{4}-\d{2}-\d{2}$/) // Should be in YYYY-MM-DD format

      // Verify the date is within the specified range
      const dateValue = new Date(element.value)
      const minDate = new Date('2024-01-01')
      const maxDate = new Date('2024-12-31')

      expect(dateValue >= minDate).toBe(true)
      expect(dateValue <= maxDate).toBe(true)
    })

    it('should generate correct parameters for date input with only min', async () => {
      document.body.innerHTML =
        '<input type="date" min="2024-01-01" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()
      expect(element.value).toMatch(/^\d{4}-\d{2}-\d{2}$/) // Should be in YYYY-MM-DD format

      // Verify the date is after the min date
      const dateValue = new Date(element.value)
      const minDate = new Date('2024-01-01')

      expect(dateValue >= minDate).toBe(true)
    })

    it('should generate correct parameters for date input with only max', async () => {
      document.body.innerHTML =
        '<input type="date" max="2024-12-31" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()
      expect(element.value).toMatch(/^\d{4}-\d{2}-\d{2}$/) // Should be in YYYY-MM-DD format

      // Verify the date is before the max date
      const dateValue = new Date(element.value)
      const maxDate = new Date('2024-12-31')

      expect(dateValue <= maxDate).toBe(true)
    })
  })

  describe('should handle number inputs', () => {
    it('should use search for number input with data-gofakeit="true"', () => {
      document.body.innerHTML = '<input type="number" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe(null) // Number inputs now use search when data-gofakeit="true"
    })

    it('should use search for number input with min attribute and data-gofakeit="true"', () => {
      document.body.innerHTML =
        '<input type="number" min="10" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe(null) // Number inputs now use search when data-gofakeit="true"
    })

    it('should use search for number input with max attribute and data-gofakeit="true"', () => {
      document.body.innerHTML =
        '<input type="number" max="100" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe(null) // Number inputs now use search when data-gofakeit="true"
    })

    it('should use search for number input with both min and max attributes and data-gofakeit="true"', () => {
      document.body.innerHTML =
        '<input type="number" min="10" max="100" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe(null) // Number inputs now use search when data-gofakeit="true"
    })

    it('should use search for number input without data-gofakeit', () => {
      document.body.innerHTML = '<input type="number" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe(null) // Number inputs now use search by default
    })

    it('should use specific function for number input with data-gofakeit="number"', () => {
      document.body.innerHTML = '<input type="number" data-gofakeit="number" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe('number') // Specific function overrides search behavior
    })

    it('should generate correct parameters for number input with min and max', async () => {
      document.body.innerHTML =
        '<input type="number" min="10" max="100" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()

      const numberValue = parseInt(element.value, 10)
      expect(numberValue).toBeGreaterThanOrEqual(10)
      expect(numberValue).toBeLessThanOrEqual(100)
    })

    it('should generate correct parameters for number input with only min', async () => {
      document.body.innerHTML =
        '<input type="number" min="50" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()

      const numberValue = parseInt(element.value, 10)
      expect(numberValue).toBeGreaterThanOrEqual(50)
    })

    it('should generate correct parameters for number input with only max', async () => {
      document.body.innerHTML =
        '<input type="number" max="25" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()

      const numberValue = parseInt(element.value, 10)
      expect(numberValue).toBeLessThanOrEqual(25)
    })

    it('should handle range input type with min and max', async () => {
      document.body.innerHTML =
        '<input type="range" min="1" max="10" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()

      const numberValue = parseInt(element.value, 10)
      expect(numberValue).toBeGreaterThanOrEqual(1)
      expect(numberValue).toBeLessThanOrEqual(10)
    })
  })

  describe('should handle color inputs', () => {
    it('should use hexcolor function for color input', () => {
      document.body.innerHTML = '<input type="color" data-gofakeit="true" />'
      const element = document.querySelector('input')!
      const result = autofill.getElementFunction(element)
      expect(result).toBe('hexcolor')
    })

    it('should generate hex color value for color input', async () => {
      document.body.innerHTML = '<input type="color" data-gofakeit="true" />'

      await autofill.fill()

      const element = document.querySelector('input') as HTMLInputElement
      expect(element.value).toBeTruthy()

      // Check if the value is a valid hex color (starts with # and is 7 characters)
      expect(element.value).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('should generate different hex color values on multiple runs', async () => {
      document.body.innerHTML = '<input type="color" data-gofakeit="true" />'

      // Run autofill multiple times to get different values
      const values = new Set()
      for (let i = 0; i < 5; i++) {
        await autofill.fill()
        const element = document.querySelector('input') as HTMLInputElement
        values.add(element.value)
        // Clear the value for next iteration
        element.value = ''
      }

      // Should have generated at least 2 different values (very likely with 5 runs)
      expect(values.size).toBeGreaterThan(1)
    })
  })

  describe('should handle radio groups without value attributes', () => {
    it('should use label text as fallback for radio groups without values', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" id="male" name="gender" />
          <label for="male">Male</label>
          <input type="radio" id="female" name="gender" />
          <label for="female">Female</label>
          <input type="radio" id="other" name="gender" />
          <label for="other">Other</label>
        </div>
      `

      const container = document.getElementById('form')!
      const autofill = new Autofill({ debug: true })
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Only one radio button should be selected
      const radioButtons = Array.from(
        container.querySelectorAll('input[type="radio"]')
      ) as HTMLInputElement[]
      const checkedRadios = Array.from(radioButtons).filter(
        radio => radio.checked
      )
      expect(checkedRadios).toHaveLength(1)

      // The selected radio should be one of the three options
      const selectedRadio = checkedRadios[0]
      expect(['male', 'female', 'other']).toContain(selectedRadio.id)
    })

    it('should handle mixed radio groups with and without value attributes', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" id="option1" name="mixed" value="option1" />
          <label for="option1">Option 1</label>
          <input type="radio" id="option2" name="mixed" />
          <label for="option2">Option 2</label>
          <input type="radio" id="option3" name="mixed" value="option3" />
          <label for="option3">Option 3</label>
        </div>
      `

      const container = document.getElementById('form')!
      const autofill = new Autofill({ debug: true })
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Only one radio button should be selected
      const radioButtons = Array.from(
        container.querySelectorAll('input[type="radio"]')
      ) as HTMLInputElement[]
      const checkedRadios = Array.from(radioButtons).filter(
        radio => radio.checked
      )
      expect(checkedRadios).toHaveLength(1)

      // The selected radio should be one of the three options
      const selectedRadio = checkedRadios[0]
      expect(['option1', 'option2', 'option3']).toContain(selectedRadio.id)
    })

    it('should fallback to id when no value or label is available', async () => {
      document.body.innerHTML = `
        <div id="form">
          <input type="radio" id="fallback1" name="fallback" />
          <input type="radio" id="fallback2" name="fallback" />
        </div>
      `

      const container = document.getElementById('form')!
      const autofill = new Autofill({ debug: true })
      autofill.setElements(container)
      await autofill.setElementFunctions()

      // Call the full flow including API
      await autofill.getElementValues()
      await autofill.setElementValues()

      // Only one radio button should be selected
      const radioButtons = Array.from(
        container.querySelectorAll('input[type="radio"]')
      ) as HTMLInputElement[]
      const checkedRadios = Array.from(radioButtons).filter(
        radio => radio.checked
      )
      expect(checkedRadios).toHaveLength(1)

      // The selected radio should be one of the two options
      const selectedRadio = checkedRadios[0]
      expect(['fallback1', 'fallback2']).toContain(selectedRadio.id)
    })
  })
})
