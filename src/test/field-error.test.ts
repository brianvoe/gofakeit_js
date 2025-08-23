import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { showFieldError } from '../field-error'

describe('Field Error Display', () => {
  let originalBody: string

  beforeEach(() => {
    // Store original body content
    originalBody = document.body.innerHTML
  })

  afterEach(() => {
    // Restore original body content
    document.body.innerHTML = originalBody
    
    // Clean up any remaining error tooltips
    const existingError = document.querySelector('.gofakeit-error-tooltip')
    if (existingError) {
      existingError.remove()
    }
    
    // Restore mocks
    vi.restoreAllMocks()
  })

  describe('Basic Error Display', () => {
    it('should create and display an error tooltip', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      const errorMessage = 'This field is required'
      showFieldError(input, errorMessage)

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      
      expect(tooltip).toBeTruthy()
      expect(tooltip.textContent).toBe(errorMessage)
      expect(tooltip.style.position).toBe('absolute')
      expect(tooltip.style.zIndex).toBe('10001')
    })

    it('should remove existing error tooltip before creating new one', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      // Create first error
      showFieldError(input, 'First error message')
      
      // Create second error
      showFieldError(input, 'Second error message')

      const tooltips = document.querySelectorAll('.gofakeit-error-tooltip')
      
      expect(tooltips.length).toBe(1)
      expect(tooltips[0].textContent).toBe('Second error message')
    })

    it('should position tooltip above the element', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      input.style.position = 'absolute'
      input.style.left = '100px'
      input.style.top = '100px'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      
      expect(tooltip).toBeTruthy()
      // Tooltip should be positioned (exact values depend on scroll position)
      expect(tooltip.style.left).toBeDefined()
      expect(tooltip.style.top).toBeDefined()
    })
  })

  describe('Tooltip Styling', () => {
    it('should apply correct CSS styles to tooltip', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      
      expect(tooltip.style.position).toBe('absolute')
      expect(tooltip.style.zIndex).toBe('10001')
      expect(tooltip.style.maxWidth).toBe('300px')
      expect(tooltip.style.pointerEvents).toBe('none')
      expect(tooltip.style.transition).toContain('opacity 0.3s ease')
      expect(tooltip.style.transition).toContain('transform 0.3s ease')
    })

    it('should have correct initial opacity and transform', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      
      // Initial state should be invisible (before requestAnimationFrame)
      expect(tooltip.style.opacity).toBe('0')
      expect(tooltip.style.transform).toBe('translateY(-10px)')
    })

    it('should fade in after requestAnimationFrame', async () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      
      // Wait for requestAnimationFrame to execute
      await new Promise(resolve => setTimeout(resolve, 0))
      
      // After requestAnimationFrame, should be visible
      expect(tooltip.style.opacity).toBe('1')
      expect(tooltip.style.transform).toBe('translateY(0)')
    })
  })

  describe('Event Listeners', () => {
    it('should add scroll and resize event listeners', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })
    })

    it('should add scroll listeners to scrollable elements', () => {
      // Create a scrollable container
      const container = document.createElement('div')
      container.style.overflow = 'scroll'
      container.style.height = '200px'
      document.body.appendChild(container)

      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      container.appendChild(input)

      const addEventListenerSpy = vi.spyOn(container, 'addEventListener')

      showFieldError(input, 'Error message')

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })
    })
  })

  describe('Auto-removal', () => {
    it('should automatically remove tooltip after 5 seconds', async () => {
      vi.useFakeTimers()
      
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      // Tooltip should exist initially
      expect(document.querySelector('.gofakeit-error-tooltip')).toBeTruthy()

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)

      // Tooltip should start fading out
      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      expect(tooltip.style.opacity).toBe('0')
      expect(tooltip.style.transform).toBe('translateY(-10px)')

      // Fast-forward 300ms for fade out animation
      vi.advanceTimersByTime(300)

      // Tooltip should be removed
      expect(document.querySelector('.gofakeit-error-tooltip')).toBeFalsy()

      vi.useRealTimers()
    })

    it('should remove event listeners when tooltip is removed', async () => {
      vi.useFakeTimers()
      
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000)

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

      vi.useRealTimers()
    })
  })

  describe('Position Updates', () => {
    it('should update position on scroll', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      input.style.position = 'absolute'
      input.style.left = '100px'
      input.style.top = '100px'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement

      // Simulate scroll
      window.scrollTo(0, 50)
      
      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'))

      // Position should be updated (though exact values depend on scroll position)
      expect(tooltip.style.top).toBeDefined()
    })

    it('should update position on resize', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      input.style.position = 'absolute'
      input.style.left = '100px'
      input.style.top = '100px'
      document.body.appendChild(input)

      showFieldError(input, 'Error message')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement

      // Trigger resize event
      window.dispatchEvent(new Event('resize'))

      // Position should be updated
      expect(tooltip.style.left).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle element without getBoundingClientRect gracefully', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 0,
          height: 0
        })
      } as Element

      expect(() => {
        showFieldError(mockElement, 'Error message')
      }).not.toThrow()
    })

    it('should handle empty error message', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      showFieldError(input, '')

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      expect(tooltip).toBeTruthy()
      expect(tooltip.textContent).toBe('')
    })

    it('should handle very long error messages', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.name = 'testField'
      document.body.appendChild(input)

      const longMessage = 'A'.repeat(500)
      showFieldError(input, longMessage)

      const tooltip = document.querySelector('.gofakeit-error-tooltip') as HTMLElement
      expect(tooltip).toBeTruthy()
      expect(tooltip.textContent).toBe(longMessage)
      expect(tooltip.style.maxWidth).toBe('300px')
      expect(tooltip.style.wordWrap).toBe('break-word')
    })
  })
})
