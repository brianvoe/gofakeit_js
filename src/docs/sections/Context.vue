<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'Context' });
</script>

<style lang="scss">
#rich-context,
#medium-context,
#sparse-context {
  .context-indicator {
    font-size: var(--font-sm);
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: var(--spacing-sm);
    font-weight: normal;

    &.context-rich {
      background: #d4edda;
      color: #155724;
    }
    &.context-sparse {
      background: #fff3cd;
      color: #856404;
    }
    &.context-medium {
      background: #cce5ff;
      color: #004085;
    }
  }
}
</style>

<template>
  <div id="rich-context" class="section">
    <h3>
      📝 Rich Context Examples
      <span class="context-indicator context-rich">Rich Context</span>
    </h3>
    <p>
      These fields have lots of descriptive text to help the search API find the
      right functions.
    </p>
    <div class="row">
      <div class="form-group">
        <label for="firstName">
          First Name
          <span class="context-indicator context-rich">Rich</span>
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="Enter your first name here"
          aria-label="First name field for user registration"
        />
      </div>
      <div class="form-group">
        <label for="lastName">
          Last Name
          <span class="context-indicator context-rich">Rich</span>
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Enter your last name here"
          aria-label="Last name field for user registration"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="email">
          Email Address
          <span class="context-indicator context-rich">Rich</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address for account verification"
          aria-label="Email address field for user registration"
        />
      </div>
      <div class="form-group">
        <label for="phone">
          Phone Number
          <span class="context-indicator context-rich">Rich</span>
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="Enter your phone number for contact purposes"
          aria-label="Phone number field for user contact"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="ssn">
          Social Security Number
          <span class="context-indicator context-rich">Rich</span>
        </label>
        <input
          id="ssn"
          type="text"
          placeholder="XXX-XX-XXXX format for tax purposes"
          aria-label="Social security number field for tax identification"
        />
      </div>
      <div class="form-group">
        <label for="dateOfBirth">
          Date of Birth
          <span class="context-indicator context-rich">Rich</span>
        </label>
        <input
          id="dateOfBirth"
          type="date"
          aria-label="Date of birth field for age verification"
        />
      </div>
    </div>
  </div>

  <!-- Medium Context -->
  <div id="medium-context" class="section">
    <h3>
      📋 Medium Context Examples
      <span class="context-indicator context-medium">Medium Context</span>
    </h3>
    <p>
      These fields have some descriptive text to test moderate context
      detection.
    </p>
    <div class="row">
      <div class="form-group">
        <label for="company">
          Company
          <span class="context-indicator context-medium">Medium</span>
        </label>
        <input id="company" type="text" placeholder="Enter company name" />
      </div>
      <div class="form-group">
        <label for="jobTitle">
          Job Title
          <span class="context-indicator context-medium">Medium</span>
        </label>
        <input id="jobTitle" type="text" placeholder="Enter job title" />
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="website">
          Website
          <span class="context-indicator context-medium">Medium</span>
        </label>
        <input id="website" type="url" placeholder="https://example.com" />
      </div>
      <div class="form-group">
        <label for="street">
          Street Address
          <span class="context-indicator context-medium">Medium</span>
        </label>
        <input id="street" type="text" placeholder="Enter street address" />
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="city">
          City
          <span class="context-indicator context-medium">Medium</span>
        </label>
        <input id="city" type="text" placeholder="Enter city" />
      </div>
      <div class="form-group">
        <label for="state">
          State
          <span class="context-indicator context-medium">Medium</span>
        </label>
        <input id="state" type="text" placeholder="Enter state" />
      </div>
    </div>
  </div>

  <!-- Sparse Context -->
  <div id="sparse-context" class="section">
    <h3>
      🔍 Sparse Context Examples
      <span class="context-indicator context-sparse">Sparse Context</span>
    </h3>
    <p>
      These fields have minimal context to test the search API's ability to work
      with limited information.
    </p>
    <div class="row">
      <div class="form-group">
        <label for="zipCode">
          Zip
          <span class="context-indicator context-sparse">Sparse</span>
        </label>
        <input id="zipCode" type="text" />
      </div>
      <div class="form-group">
        <label for="country">
          Country
          <span class="context-indicator context-sparse">Sparse</span>
        </label>
        <input id="country" type="text" />
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="age">
          Age
          <span class="context-indicator context-sparse">Sparse</span>
        </label>
        <input id="age" type="number" min="18" max="100" />
      </div>
      <div class="form-group">
        <label for="salary">
          Salary
          <span class="context-indicator context-sparse">Sparse</span>
        </label>
        <input id="salary" type="range" min="20000" max="200000" step="5000" />
      </div>
    </div>
    <div class="row">
      <div class="form-group">
        <label for="color">
          Color
          <span class="context-indicator context-sparse">Sparse</span>
        </label>
        <input id="color" type="color" value="#ffa000" />
      </div>
      <div class="form-group">
        <label for="bio">
          Sentence
          <span class="context-indicator context-sparse">Sparse</span>
        </label>
        <textarea id="bio" rows="3"></textarea>
      </div>
    </div>
  </div>
</template>
