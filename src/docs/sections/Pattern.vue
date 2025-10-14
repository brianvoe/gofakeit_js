<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Pattern',
  data() {
    return {
      formStatus: 'Fill out the form and click submit to validate patterns.',
      formStatusType: 'info' as 'info' | 'success' | 'error',
    }
  },
  methods: {
    handleSubmit(event: Event) {
      const form = event.target as HTMLFormElement | null
      if (!form) {
        return
      }

      const isValid = form.checkValidity()
      form.reportValidity()

      if (isValid) {
        this.formStatus = '✅ All inputs match their regex patterns.'
        this.formStatusType = 'success'
      } else {
        this.formStatus =
          '❌ Pattern mismatch detected. Check highlighted fields.'
        this.formStatusType = 'error'
      }
    },
  },
})
</script>

<style lang="scss">
#pattern-inputs {
  .form-status {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-light);
    color: var(--text-primary);
    font-weight: 500;
    transition: background-color var(--timing) ease;

    &[data-status='success'] {
      background: rgba(46, 204, 113, 0.15);
      border-color: var(--success-color);
      color: var(--success-color);
    }

    &[data-status='error'] {
      background: rgba(231, 76, 60, 0.15);
      border-color: var(--danger-color);
      color: var(--danger-color);
    }
  }
}
</style>

<template>
  <div id="pattern-inputs" class="section">
    <h3>🎯 Pattern Inputs</h3>
    <p>
      Use the native <code>pattern</code> attribute with JavaScript regular
      expressions to generate values using the regex function. Examples below
      use JS regex like <code>^[A-Z]{2}-\\d{4}$</code>.
    </p>

    <form class="rows" @submit.prevent="handleSubmit">
      <div class="form-status" :data-status="formStatusType">
        {{ formStatus }}
      </div>
      <div class="row">
        <div class="form-group">
          <label for="orderCode"> Order Code </label>
          <input
            id="orderCode"
            type="text"
            pattern="^[A-Z]{2}-\d{4}$"
            placeholder="AA-1234"
            required
          />
          <p class="field-note">Pattern: <code>^[A-Z]{2}-\d{4}$</code></p>
        </div>
        <div class="form-group">
          <label for="license"> License Key </label>
          <input
            id="license"
            type="text"
            pattern="^[A-Z]{4}-\d{4}-[A-Z]{2}$"
            placeholder="ABCD-1234-EF"
            required
          />
          <p class="field-note">
            Pattern: <code>^[A-Z]{4}-\d{4}-[A-Z]{2}$</code>
          </p>
        </div>
      </div>

      <div class="row">
        <div class="form-group">
          <label for="zip"> US ZIP Code </label>
          <input
            id="zip"
            type="text"
            pattern="^\d{5}(?:-\d{4})?$"
            placeholder="12345-6789"
            required
          />
          <p class="field-note">Pattern: <code>^\d{5}(?:-\d{4})?$</code></p>
        </div>
        <div class="form-group">
          <label for="postal"> Canadian Postal Code </label>
          <input
            id="postal"
            type="text"
            pattern="^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$"
            placeholder="K1A 0B1"
            required
          />
          <p class="field-note">
            Pattern:
            <code
              >^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$</code
            >
          </p>
        </div>
      </div>

      <div class="row">
        <div class="form-group">
          <label for="ipv4"> IPv4 Address </label>
          <input
            id="ipv4"
            type="text"
            pattern="^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$"
            placeholder="192.168.0.1"
            required
          />
          <p class="field-note">
            Pattern:
            <code
              >^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$</code
            >
          </p>
        </div>
        <div class="form-group">
          <label for="hexColor"> Hex Color </label>
          <input
            id="hexColor"
            type="text"
            pattern="^#[0-9a-fA-F]{6}$"
            placeholder="#1f75fe"
            required
          />
          <p class="field-note">Pattern: <code>^#[0-9a-fA-F]{6}$</code></p>
        </div>
      </div>

      <div class="row">
        <div class="form-group">
          <label for="phone"> International Phone </label>
          <input
            id="phone"
            type="tel"
            pattern="^\+\d{1,3}\s?\d{4,14}$"
            placeholder="+44 2081234567"
            required
          />
          <p class="field-note">Pattern: <code>^\+\d{1,3}\s?\d{4,14}$</code></p>
        </div>
        <div class="form-group">
          <label for="ticket"> Event Ticket </label>
          <input
            id="ticket"
            type="text"
            pattern="^EVT-[A-Z]{3}-\d{6}$"
            placeholder="EVT-NYC-202501"
            required
          />
          <p class="field-note">Pattern: <code>^EVT-[A-Z]{3}-\d{6}$</code></p>
        </div>
      </div>

      <div class="row">
        <div class="form-group">
          <label for="slug"> URL Slug </label>
          <input
            id="slug"
            type="text"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            placeholder="marketing-site-launch"
            required
          />
          <p class="field-note">
            Pattern: <code>^[a-z0-9]+(?:-[a-z0-9]+)*$</code>
          </p>
        </div>
        <div class="form-group">
          <label for="isbn"> ISBN-13 </label>
          <input
            id="isbn"
            type="text"
            pattern="^97[89]-\d-\d{2,5}-\d{2,7}-\d$"
            placeholder="978-1-4028-9462-6"
            required
          />
          <p class="field-note">
            Pattern: <code>^97[89]-\d-\d{2,5}-\d{2,7}-\d$</code>
          </p>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
