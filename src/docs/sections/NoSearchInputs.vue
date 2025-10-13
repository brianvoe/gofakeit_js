<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'NoSearchInputs' });
</script>

<template>
  <div id="no-search-inputs" class="section">
    <h3>🚫 No Search Inputs</h3>
    <p>
      These input types are excluded from search API and use direct function
      assignment.
    </p>

    <div class="form-group">
      <label>Programming Languages (Checkboxes)</label>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <input id="lang1" type="checkbox" />
          <label for="lang1">JavaScript</label>
        </div>
        <div class="checkbox-item">
          <input id="lang2" type="checkbox" />
          <label for="lang2">Python</label>
        </div>
        <div class="checkbox-item">
          <input id="lang3" type="checkbox" />
          <label for="lang3">Go</label>
        </div>
        <div class="checkbox-item">
          <input id="lang4" type="checkbox" />
          <label for="lang4">Rust</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Skills & Interests (Checkboxes with Values)</label>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <input id="skill1" type="checkbox" value="frontend" />
          <label for="skill1">Frontend Development</label>
        </div>
        <div class="checkbox-item">
          <input id="skill2" type="checkbox" value="backend" />
          <label for="skill2">Backend Development</label>
        </div>
        <div class="checkbox-item">
          <input id="skill3" type="checkbox" value="devops" />
          <label for="skill3">DevOps</label>
        </div>
        <div class="checkbox-item">
          <input id="skill4" type="checkbox" value="mobile" />
          <label for="skill4">Mobile Development</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Agreements (Checkboxes with Same Name)</label>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <input id="agree1" type="checkbox" name="agreements" value="terms" />
          <label for="agree1">I agree to the Terms of Service</label>
        </div>
        <div class="checkbox-item">
          <input
            id="agree2"
            type="checkbox"
            name="agreements"
            value="privacy"
          />
          <label for="agree2">I agree to the Privacy Policy</label>
        </div>
        <div class="checkbox-item">
          <input
            id="agree3"
            type="checkbox"
            name="agreements"
            value="marketing"
          />
          <label for="agree3">I agree to receive marketing emails</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Preferences (Mixed Checkbox States)</label>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <input id="pref1" type="checkbox" checked />
          <label for="pref1">Dark Mode (Pre-checked)</label>
        </div>
        <div class="checkbox-item">
          <input id="pref2" type="checkbox" disabled />
          <label for="pref2">Admin Settings (Disabled)</label>
        </div>
        <div class="checkbox-item">
          <input id="pref3" type="checkbox" />
          <label for="pref3">Notifications</label>
        </div>
        <div class="checkbox-item">
          <input id="pref4" type="checkbox" value="advanced" />
          <label for="pref4">Advanced Features</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Single Checkbox (Edge Case)</label>
      <div class="checkbox-group">
        <div class="checkbox-item">
          <input id="single" type="checkbox" value="yes" />
          <label for="single">I am a single checkbox</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Experience Level (Radio Buttons)</label>
      <div class="radio-group">
        <div class="radio-item">
          <input id="exp1" type="radio" name="experience" value="beginner" />
          <label for="exp1">Beginner</label>
        </div>
        <div class="radio-item">
          <input
            id="exp2"
            type="radio"
            name="experience"
            value="intermediate"
          />
          <label for="exp2">Intermediate</label>
        </div>
        <div class="radio-item">
          <input id="exp3" type="radio" name="experience" value="advanced" />
          <label for="exp3">Advanced</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Preferred Language (Radio Buttons)</label>
      <div class="radio-group">
        <div class="radio-item">
          <input id="lang2a" type="radio" name="language" value="javascript" />
          <label for="lang2a">JavaScript</label>
        </div>
        <div class="radio-item">
          <input id="lang2b" type="radio" name="language" value="python" />
          <label for="lang2b">Python</label>
        </div>
        <div class="radio-item">
          <input id="lang2c" type="radio" name="language" value="go" />
          <label for="lang2c">Go</label>
        </div>
        <div class="radio-item">
          <input id="lang2d" type="radio" name="language" value="rust" />
          <label for="lang2d">Rust</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Work Environment (Radio Buttons)</label>
      <div class="radio-group">
        <div class="radio-item">
          <input id="work1" type="radio" name="work_env" value="remote" />
          <label for="work1">Remote</label>
        </div>
        <div class="radio-item">
          <input id="work2" type="radio" name="work_env" value="office" />
          <label for="work2">Office</label>
        </div>
        <div class="radio-item">
          <input id="work3" type="radio" name="work_env" value="hybrid" />
          <label for="work3">Hybrid</label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="timezoneSelect">Timezone (Select)</label>
      <select id="timezoneSelect">
        <option value="">Select timezone</option>
        <option value="UTC">UTC (Coordinated Universal Time)</option>
        <option value="EST">EST (Eastern Standard Time)</option>
        <option value="CST">CST (Central Standard Time)</option>
        <option value="MST">MST (Mountain Standard Time)</option>
        <option value="PST">PST (Pacific Standard Time)</option>
      </select>
    </div>
    <div class="form-group">
      <label for="countrySelect">Country (Select)</label>
      <select id="countrySelect">
        <option value="">Choose a country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="UK">United Kingdom</option>
        <option value="DE">Germany</option>
        <option value="FR">France</option>
        <option value="JP">Japan</option>
        <option value="AU">Australia</option>
      </select>
    </div>
    <div class="form-group">
      <label for="prioritySelect">Priority Level (Select)</label>
      <select id="prioritySelect">
        <option value="">Select priority</option>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
        <option value="urgent">Urgent</option>
      </select>
    </div>
  </div>
</template>
