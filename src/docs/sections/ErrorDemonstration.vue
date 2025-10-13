<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'ErrorDemonstration' });
</script>

<template>
  <div id="error-demonstration" class="section">
    <h3>⚠️ Error Demonstration</h3>
    <p>
      These fields use invalid <code>data-gofakeit</code> values that should
      cause errors to be displayed. This helps test error handling and user
      feedback.
    </p>

    <div class="row">
      <div class="form-group">
        <label for="invalidFunction1">Invalid Function 1</label>
        <input
          id="invalidFunction1"
          type="text"
          data-gofakeit="nonexistentfunction"
          placeholder="Should show error for invalid function"
        />
        <div class="field-note">data-gofakeit="nonexistentfunction"</div>
      </div>
      <div class="form-group">
        <label for="invalidFunction2">Invalid Function 2</label>
        <input
          id="invalidFunction2"
          type="text"
          data-gofakeit="fakefunction123"
          placeholder="Should show error for invalid function"
        />
        <div class="field-note">data-gofakeit="fakefunction123"</div>
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="invalidFunction3">Invalid Function 3</label>
        <input
          id="invalidFunction3"
          type="text"
          data-gofakeit="notreal"
          placeholder="Should show error for invalid function"
        />
        <div class="field-note">data-gofakeit="notreal"</div>
      </div>
      <div class="form-group">
        <label for="invalidFunction4">Invalid Function 4</label>
        <input
          id="invalidFunction4"
          type="text"
          data-gofakeit="bogusdata"
          placeholder="Should show error for invalid function"
        />
        <div class="field-note">data-gofakeit="bogusdata"</div>
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="invalidFunction5">Invalid Function 5</label>
        <input
          id="invalidFunction5"
          type="email"
          data-gofakeit="madeupfunction"
          placeholder="Should show error for invalid function"
        />
        <div class="field-note">data-gofakeit="madeupfunction"</div>
      </div>
      <div class="form-group">
        <label for="invalidFunction6">Invalid Function 6</label>
        <input
          id="invalidFunction6"
          type="tel"
          data-gofakeit="wrongfunction"
          placeholder="Should show error for invalid function"
        />
        <div class="field-note">data-gofakeit="wrongfunction"</div>
      </div>
    </div>
    <div class="form-group">
      <label for="invalidFunction7">Invalid Function 7 (Textarea)</label>
      <textarea
        id="invalidFunction7"
        data-gofakeit="invalidtextarea"
        rows="3"
        placeholder="Should show error for invalid function"
      />
      <div class="field-note">data-gofakeit="invalidtextarea"</div>
    </div>
  </div>
</template>
