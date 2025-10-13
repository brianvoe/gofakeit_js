<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'DataGofakeitTrue' });
</script>

<template>
  <div id="data-gofakeit-true" class="section">
    <h3>✅ Data-gofakeit="true" Fields</h3>
    <p>
      These fields have <code>data-gofakeit="true"</code> and will be autofilled
      regardless of Auto Mode setting.
    </p>

    <div class="input-grid">
      <div class="form-group">
        <label for="trueFirstName">First Name</label>
        <input
          id="trueFirstName"
          type="text"
          data-gofakeit="true"
          placeholder="Will be filled with smart detection"
        />
        <div class="field-note">data-gofakeit="true"</div>
      </div>

      <div class="form-group">
        <label for="trueEmail">Email</label>
        <input
          id="trueEmail"
          type="email"
          data-gofakeit="true"
          placeholder="Will be filled with email function"
        />
        <div class="field-note">data-gofakeit="true"</div>
      </div>

      <div class="form-group">
        <label for="truePhone">Phone</label>
        <input
          id="truePhone"
          type="tel"
          data-gofakeit="true"
          placeholder="Will be filled with phone function"
        />
        <div class="field-note">data-gofakeit="true"</div>
      </div>

      <div class="form-group">
        <label for="trueNumber">Age</label>
        <input
          id="trueNumber"
          type="number"
          data-gofakeit="true"
          placeholder="Will be filled with number function"
        />
        <div class="field-note">data-gofakeit="true"</div>
      </div>

      <div class="form-group">
        <label for="trueDate">Birth Date</label>
        <input
          id="trueDate"
          type="date"
          data-gofakeit="true"
          placeholder="Will be filled with date function"
        />
        <div class="field-note">data-gofakeit="true"</div>
      </div>

      <div class="form-group">
        <label for="trueSelect">Country</label>
        <select id="trueSelect" data-gofakeit="true">
          <option value="">Select country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
        </select>
        <div class="field-note">data-gofakeit="true"</div>
      </div>
    </div>

    <div class="form-group full-width">
      <label for="trueTextarea">Bio</label>
      <textarea
        id="trueTextarea"
        data-gofakeit="true"
        rows="3"
        placeholder="Will be filled with sentence function"
      />
      <div class="field-note">data-gofakeit="true"</div>
    </div>

    <div class="form-group full-width">
      <label for="trueCheckbox">Agree to Terms</label>
      <div class="checkbox-item">
        <input id="trueCheckbox" type="checkbox" data-gofakeit="true" />
        <label for="trueCheckbox">I agree to the terms and conditions</label>
      </div>
      <div class="field-note">data-gofakeit="true"</div>
    </div>

    <div class="form-group full-width">
      <label>Gender</label>
      <div class="radio-group">
        <div class="radio-item">
          <input
            id="trueMale"
            type="radio"
            name="trueGender"
            data-gofakeit="true"
          />
          <label for="trueMale">Male</label>
        </div>
        <div class="radio-item">
          <input
            id="trueFemale"
            type="radio"
            name="trueGender"
            data-gofakeit="true"
          />
          <label for="trueFemale">Female</label>
        </div>
        <div class="radio-item">
          <input
            id="trueOther"
            type="radio"
            name="trueGender"
            data-gofakeit="true"
          />
          <label for="trueOther">Other</label>
        </div>
      </div>
      <div class="field-note">data-gofakeit="true"</div>
    </div>
  </div>
</template>
