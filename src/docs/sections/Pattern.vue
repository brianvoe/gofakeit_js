<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'Pattern' });
</script>

<template>
  <div id="pattern-inputs" class="section">
    <h3>🎯 Pattern Inputs</h3>
    <p>
      Use the native <code>pattern</code> attribute with JavaScript regular
      expressions to generate values using the regex function. Examples below
      use JS regex like <code>^[A-Z]{2}-\\d{4}$</code>.
    </p>

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
        />
      </div>
    </div>
  </div>
</template>
