<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Pattern',
  data() {
    return {
      formStatus: 'Fill out the form and click submit to validate patterns.',
      formStatusType: 'info' as 'info' | 'success' | 'error',
    };
  },
  methods: {
    handleSubmit(event: Event) {
      const form = event.target as HTMLFormElement | null;
      if (!form) {
        return;
      }

      const isValid = form.checkValidity();
      form.reportValidity();

      if (isValid) {
        this.formStatus = '✅ All inputs match their regex patterns.';
        this.formStatusType = 'success';
      } else {
        this.formStatus =
          '❌ Pattern mismatch detected. Check highlighted fields.';
        this.formStatusType = 'error';
      }
    },
  },
});
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
          <label for="orderCode">
            Order Code
            <span class="field-note">Format: AA-1234</span>
          </label>
          <input
            id="orderCode"
            type="text"
            pattern="^[A-Z]{2}-\\d{4}$"
            placeholder="AA-1234"
            required
          />
        </div>
        <div class="form-group">
          <label for="license">
            License Key
            <span class="field-note">Format: ABCD-1234-EF</span>
          </label>
          <input
            id="license"
            type="text"
            pattern="^[A-Z]{4}-\\d{4}-[A-Z]{2}$"
            placeholder="ABCD-1234-EF"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="form-group">
          <label for="sku">
            SKU
            <span class="field-note">Format: prd-xx-999</span>
          </label>
          <input
            id="sku"
            type="text"
            pattern="^prd-[a-z]{2}-\\d{3}$"
            placeholder="prd-ab-123"
            required
          />
        </div>
        <div class="form-group">
          <label for="colorHex">
            Short Hex
            <span class="field-note">Format: #abc or #a1f</span>
          </label>
          <input
            id="colorHex"
            type="text"
            pattern="^#[0-9a-fA-F]{3}$"
            placeholder="#abc"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="form-group">
          <label for="ticket">
            Ticket ID
            <span class="field-note">Format: TKT-YYYY-####</span>
          </label>
          <input
            id="ticket"
            type="text"
            pattern="^TKT-\\d{4}-\\d{4}$"
            placeholder="TKT-2025-0042"
            required
          />
        </div>
        <div class="form-group">
          <label for="username">
            Username
            <span class="field-note">Format: user_xx99</span>
          </label>
          <input
            id="username"
            type="text"
            pattern="^user_[a-z]{2}\\d{2}$"
            placeholder="user_ab12"
            required
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
