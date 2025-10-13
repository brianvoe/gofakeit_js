<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'ExcludedFields' });
</script>

<template>
  <div id="excluded-fields" class="section">
    <h3>🚫 Excluded Fields (data-gofakeit="false")</h3>
    <p>These fields will NOT be filled by the autofill function.</p>

    <div class="row">
      <div class="form-group">
        <label for="excludedField1">Excluded Field 1</label>
        <input
          id="excludedField1"
          type="text"
          data-gofakeit="false"
          placeholder="This field will NOT be filled"
        />
      </div>
      <div class="form-group">
        <label for="excludedField2">Excluded Field 2</label>
        <input
          id="excludedField2"
          type="text"
          data-gofakeit="false"
          placeholder="This field will NOT be filled"
        />
      </div>
    </div>
  </div>
</template>
