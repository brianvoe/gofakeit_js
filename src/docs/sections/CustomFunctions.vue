<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'CustomFunctions' });
</script>

<template>
  <div id="custom-functions" class="section">
    <h3>🎯 Custom Function Examples</h3>
    <p>Examples with specific function assignments.</p>

    <div class="row">
      <div class="form-group">
        <label for="customUuid">UUID (Custom)</label>
        <input
          id="customUuid"
          type="text"
          data-gofakeit="uuid"
          placeholder="Will generate UUID"
        />
        <div class="field-note">data-gofakeit="uuid"</div>
      </div>
      <div class="form-group">
        <label for="customCreditCard">Credit Card Number (Custom)</label>
        <input
          id="customCreditCard"
          type="text"
          data-gofakeit="creditcardnumber"
          placeholder="Will generate credit card"
        />
        <div class="field-note">data-gofakeit="creditcard"</div>
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="customBitcoin">Bitcoin Address (Custom)</label>
        <input
          id="customBitcoin"
          type="text"
          data-gofakeit="bitcoinaddress"
          placeholder="Will generate Bitcoin address"
        />
        <div class="field-note">data-gofakeit="bitcoinaddress"</div>
      </div>
      <div class="form-group">
        <label for="customIp">IP Address (Custom)</label>
        <input
          id="customIp"
          type="text"
          data-gofakeit="ipv4address"
          placeholder="Will generate IP address"
        />
        <div class="field-note">data-gofakeit="ipv4address"</div>
      </div>
    </div>
    <div class="form-group">
      <label for="customLorem">Lorem Ipsum Paragraph (Custom)</label>
      <textarea
        id="customLorem"
        data-gofakeit="loremipsumparagraph"
        rows="3"
        placeholder="Will generate Lorem Ipsum text"
      />
      <div class="field-note">data-gofakeit="loremipsumparagraph"</div>
    </div>
  </div>
</template>
