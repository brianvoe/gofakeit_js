<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'DateTimeInputs' });
</script>

<template>
  <div id="date-time-inputs" class="section">
    <h3>📅 Date & Time Inputs</h3>
    <p>Testing date and time input types with and without range constraints.</p>

    <div class="row">
      <div class="form-group">
        <label for="dateInputDefault">Date Input (Simple)</label>
        <input id="dateInputDefault" type="date" data-gofakeit="true" />
      </div>
      <div class="form-group">
        <label for="dateInputRange">Date Input (Current Year Range)</label>
        <input
          id="dateInputRange"
          type="date"
          min="2024-01-01"
          max="2024-12-31"
          data-gofakeit="true"
        />
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="timeInputDefault">Time Input (Simple)</label>
        <input id="timeInputDefault" type="time" data-gofakeit="true" />
      </div>
      <div class="form-group">
        <label for="timeInputRange">Time Input (Business Hours)</label>
        <input
          id="timeInputRange"
          type="time"
          min="09:00"
          max="17:00"
          step="900"
          data-gofakeit="true"
        />
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="datetimeLocalInputDefault"
          >DateTime Local Input (Simple)</label
        >
        <input
          id="datetimeLocalInputDefault"
          type="datetime-local"
          data-gofakeit="true"
        />
      </div>
      <div class="form-group">
        <label for="datetimeLocalInputRange"
          >DateTime Local Input (1 Hour Steps)</label
        >
        <input
          id="datetimeLocalInputRange"
          type="datetime-local"
          min="2024-01-01T00:00"
          max="2024-12-31T23:59"
          step="3600"
          data-gofakeit="true"
        />
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="monthInputDefault">Month Input (Simple)</label>
        <input id="monthInputDefault" type="month" data-gofakeit="true" />
      </div>
      <div class="form-group">
        <label for="monthInputRange">Month Input (Current Year)</label>
        <input
          id="monthInputRange"
          type="month"
          min="2024-01"
          max="2024-12"
          data-gofakeit="true"
        />
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="weekInputDefault">Week Input (Simple)</label>
        <input id="weekInputDefault" type="week" data-gofakeit="true" />
      </div>
      <div class="form-group">
        <label for="weekInputRange">Week Input (Current Year)</label>
        <input
          id="weekInputRange"
          type="week"
          min="2024-W01"
          max="2024-W52"
          data-gofakeit="true"
        />
      </div>
    </div>

    <div class="row">
      <div class="form-group">
        <label for="yearInputDefault">Year Input (Simple)</label>
        <input
          id="yearInputDefault"
          type="number"
          data-gofakeit="true"
          placeholder="Year value"
        />
      </div>
      <div class="form-group">
        <label for="yearInputRange">Year Input (Recent Years)</label>
        <input
          id="yearInputRange"
          type="number"
          min="2020"
          max="2030"
          step="1"
          data-gofakeit="true"
          placeholder="Year value"
        />
      </div>
    </div>

    <h4>🔍 Additional Range Examples</h4>
    <div class="row">
      <div class="form-group">
        <label for="dateInputPast">Date Input (Past 5 Years)</label>
        <input
          id="dateInputPast"
          type="date"
          min="2019-01-01"
          max="2024-12-31"
          data-gofakeit="true"
        />
      </div>
      <div class="form-group">
        <label for="timeInput24h">Time Input (24 Hour)</label>
        <input
          id="timeInput24h"
          type="time"
          min="00:00"
          max="23:59"
          step="60"
          data-gofakeit="true"
        />
      </div>
      <div class="form-group">
        <label for="datetimeLocalInputFuture"
          >DateTime Local Input (Future 1 Year)</label
        >
        <input
          id="datetimeLocalInputFuture"
          type="datetime-local"
          min="2024-01-01T00:00"
          max="2025-12-31T23:59"
          step="1800"
          data-gofakeit="true"
        />
      </div>
      <div class="form-group">
        <label for="monthInputRange2">Month Input (2 Year Range)</label>
        <input
          id="monthInputRange2"
          type="month"
          min="2023-01"
          max="2024-12"
          data-gofakeit="true"
        />
      </div>
      <div class="form-group">
        <label for="weekInputRange2">Week Input (Academic Year)</label>
        <input
          id="weekInputRange2"
          type="week"
          min="2024-W35"
          max="2025-W15"
          data-gofakeit="true"
        />
      </div>
      <div class="form-group">
        <label for="yearInputDecade">Year Input (Decade Range)</label>
        <input
          id="yearInputDecade"
          type="number"
          min="2010"
          max="2020"
          step="1"
          data-gofakeit="true"
          placeholder="Year value"
        />
      </div>
    </div>
  </div>
</template>
