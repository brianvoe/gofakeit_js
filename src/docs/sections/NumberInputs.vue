<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'NumberInputs' })
</script>

<template>
  <div id="number-inputs" class="section">
    <h3>🔢 Number Input Examples</h3>
    <p>
      Testing number input types with various contexts that benefit from search
      functionality.
    </p>

    <div class="row">
      <div class="form-group">
        <label for="routingNumber">Routing Number</label>
        <input
          id="routingNumber"
          type="number"
          data-gofakeit="true"
          placeholder="9-digit routing number"
        />
        <div class="field-note">Uses search to find routingnumber function</div>
      </div>
      <div class="form-group">
        <label for="accountNumber">Account Number</label>
        <input
          id="accountNumber"
          type="number"
          data-gofakeit="true"
          placeholder="Account number"
        />
        <div class="field-note">Uses search to find accountnumber function</div>
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="creditCardNumber">Credit Card Number</label>
        <input
          id="creditCardNumber"
          type="number"
          data-gofakeit="true"
          placeholder="16-digit credit card"
        />
        <div class="field-note">Uses search to find creditcard function</div>
      </div>
      <div class="form-group">
        <label for="cvvNumber">CVV Number</label>
        <input
          id="cvvNumber"
          type="number"
          data-gofakeit="true"
          placeholder="3-4 digit CVV"
          min="100"
          max="9999"
        />
        <div class="field-note">Uses search to find cvv function</div>
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          type="number"
          data-gofakeit="true"
          placeholder="10-digit phone number"
        />
        <div class="field-note">Uses search to find phone function</div>
      </div>
      <div class="form-group">
        <label for="zipCode">ZIP Code</label>
        <input
          id="zipCode"
          type="number"
          data-gofakeit="true"
          placeholder="5-digit ZIP code"
          min="10000"
          max="99999"
        />
        <div class="field-note">Uses search to find zipcode function</div>
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="ssnNumber">Social Security Number</label>
        <input
          id="ssnNumber"
          type="number"
          data-gofakeit="true"
          placeholder="9-digit SSN"
        />
        <div class="field-note">Uses search to find ssn function</div>
      </div>
      <div class="form-group">
        <label for="priceNumber">Price</label>
        <input
          id="priceNumber"
          type="number"
          data-gofakeit="true"
          placeholder="Product price"
          min="0"
          step="0.01"
        />
        <div class="field-note">Uses search to find price function</div>
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="ageNumber">Age</label>
        <input
          id="ageNumber"
          type="number"
          data-gofakeit="true"
          placeholder="Person's age"
          min="1"
          max="120"
        />
        <div class="field-note">Uses search to find age function</div>
      </div>
      <div class="form-group">
        <label for="yearNumber">Year</label>
        <input
          id="yearNumber"
          type="number"
          data-gofakeit="true"
          placeholder="Year value"
          min="1900"
          max="2100"
        />
        <div class="field-note">Uses search to find year function</div>
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="quantityNumber">Quantity</label>
        <input
          id="quantityNumber"
          type="number"
          data-gofakeit="true"
          placeholder="Item quantity"
          min="1"
          max="1000"
        />
        <div class="field-note">Uses search to find quantity function</div>
      </div>
      <div class="form-group">
        <label for="randomNumber">Random Number (Fallback)</label>
        <input
          id="randomNumber"
          type="number"
          data-gofakeit="number"
          placeholder="Random number"
          min="1"
          max="100"
        />
        <div class="field-note">
          data-gofakeit="number" - uses number function directly
        </div>
      </div>
    </div>
  </div>
</template>
