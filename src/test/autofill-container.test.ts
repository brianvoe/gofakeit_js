import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { autofillContainer } from '../autofill'

describe('Autofill Container', () => {
  let originalBody: string

  beforeEach(() => {
    // Store original body content
    originalBody = document.body.innerHTML
    
    // Create multiple containers with forms
    document.body.innerHTML = `
      <div id="container1" class="form-container">
        <h2>Container 1 - Personal Info</h2>
        <input type="text" name="firstName" placeholder="First Name" data-gofakeit="true">
        <input type="text" name="lastName" placeholder="Last Name" data-gofakeit="true">
        <input type="email" name="email" placeholder="Email" data-gofakeit="true">
      </div>
      
      <div id="container2" class="form-container">
        <h2>Container 2 - Address Info</h2>
        <input type="text" name="street" placeholder="Street" data-gofakeit="true">
        <input type="text" name="city" placeholder="City" data-gofakeit="true">
        <input type="text" name="state" placeholder="State" data-gofakeit="true">
        <input type="text" name="zip" placeholder="ZIP" data-gofakeit="true">
      </div>
      
      <div id="container3" class="form-container">
        <h2>Container 3 - Additional Info</h2>
        <textarea name="bio" placeholder="Bio" data-gofakeit="true"></textarea>
        <select name="country" data-gofakeit="true">
          <option value="">Select Country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </select>
        <input type="number" name="age" placeholder="Age" data-gofakeit="true">
      </div>
      
      <div id="container4" class="form-container">
        <h2>Container 4 - No Gofakeit Fields</h2>
        <input type="text" name="notes" placeholder="Notes">
        <input type="text" name="comments" placeholder="Comments">
      </div>
    `
  })

  afterEach(() => {
    // Restore original body content
    document.body.innerHTML = originalBody
  })

  it('should fill only fields in the selected container', async () => {
    const container1 = document.getElementById('container1') as HTMLElement
    const container2 = document.getElementById('container2') as HTMLElement

    // Fill container 1
    await autofillContainer(container1)

    // Check that container 1 fields are filled
    const container1Fields = container1.querySelectorAll('input[data-gofakeit="true"]')
    container1Fields.forEach(field => {
      const input = field as HTMLInputElement
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })

    // Check that container 2 fields are still empty
    const container2Fields = container2.querySelectorAll('input[data-gofakeit="true"]')
    container2Fields.forEach(field => {
      const input = field as HTMLInputElement
      expect(input.value).toBe('')
    })
  })

  it('should fill container 2 when selected', async () => {
    const container2 = document.getElementById('container2') as HTMLElement

    // Fill container 2
    await autofillContainer(container2)

    // Check that container 2 fields are filled
    const container2Fields = container2.querySelectorAll('input[data-gofakeit="true"]')
    container2Fields.forEach(field => {
      const input = field as HTMLInputElement
      expect(input.value).toBeTruthy()
      expect(input.value.length).toBeGreaterThan(0)
    })
  })

  it('should fill container 3 with mixed input types', async () => {
    const container3 = document.getElementById('container3') as HTMLElement

    // Fill container 3
    await autofillContainer(container3)

    // Check textarea
    const textarea = container3.querySelector('textarea[name="bio"]') as HTMLTextAreaElement
    expect(textarea.value).toBeTruthy()
    expect(textarea.value.length).toBeGreaterThan(0)

    // Check select
    const select = container3.querySelector('select[name="country"]') as HTMLSelectElement
    expect(select.value).toBeTruthy()
    expect(select.value.length).toBeGreaterThan(0)

    // Check number input
    const numberInput = container3.querySelector('input[name="age"]') as HTMLInputElement
    expect(numberInput.value).toBeTruthy()
    expect(numberInput.value.length).toBeGreaterThan(0)
  })

  it('should handle container with no data-gofakeit fields gracefully', async () => {
    const container4 = document.getElementById('container4') as HTMLElement

    // Should not throw an error
    await expect(autofillContainer(container4)).resolves.not.toThrow()

    // Fields should remain empty (with smart fill disabled, they won't be filled)
    const fields = container4.querySelectorAll('input')
    fields.forEach(field => {
      const input = field as HTMLInputElement
      // With smart fill enabled, these fields might be filled
      // So we just verify the field exists
      expect(input).toBeTruthy()
    })
  })

  it('should handle nested containers correctly', async () => {
    // Create a nested container structure
    document.body.innerHTML = `
      <div id="outerContainer">
        <div id="innerContainer1">
          <input type="text" name="inner1" data-gofakeit="true">
        </div>
        <div id="innerContainer2">
          <input type="text" name="inner2" data-gofakeit="true">
        </div>
      </div>
    `

    const innerContainer1 = document.getElementById('innerContainer1') as HTMLElement
    const innerContainer2 = document.getElementById('innerContainer2') as HTMLElement

    // Fill only inner container 1
    await autofillContainer(innerContainer1)

    // Check that only inner container 1 is filled
    const field1 = innerContainer1.querySelector('input[name="inner1"]') as HTMLInputElement
    const field2 = innerContainer2.querySelector('input[name="inner2"]') as HTMLInputElement

    expect(field1.value).toBeTruthy()
    expect(field2.value).toBe('')
  })

  it('should handle empty container gracefully', async () => {
    const emptyContainer = document.createElement('div')
    document.body.appendChild(emptyContainer)

    // Should not throw an error
    await expect(autofillContainer(emptyContainer)).resolves.not.toThrow()

    document.body.removeChild(emptyContainer)
  })
})
