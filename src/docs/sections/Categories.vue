<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'Categories' });
</script>

<template>
  <div class="section" id="categories">
    <h3>🏷️ Categories</h3>
    <p>Testing various gofakeit categories with different input types.</p>

    <!-- PERSON CATEGORY -->
    <div id="person-category" class="rows">
      <h4>👤 Person Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="personName">Person Name</label>
          <input type="text" id="personName" placeholder="Full person name" />
        </div>
        <div class="form-group">
          <label for="gender">Gender</label>
          <input type="text" id="gender" placeholder="Gender selection" />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="petName">Pet Name</label>
          <input type="text" id="petName" placeholder="Pet name" />
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" placeholder="Username for login" />
        </div>
      </div>
    </div>

    <!-- ADDRESS CATEGORY -->
    <div id="address-category" class="rows">
      <h4>🏠 Address Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            placeholder="Geographic latitude"
          />
        </div>
        <div class="form-group">
          <label for="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            placeholder="Geographic longitude"
          />
        </div>
      </div>
    </div>

    <!-- COMPANY CATEGORY -->
    <div id="company-category" class="rows">
      <h4>🏢 Company Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="companySuffix">Company Suffix</label>
          <input
            type="text"
            id="companySuffix"
            placeholder="Inc, LLC, Corp, etc."
          />
        </div>
        <div class="form-group">
          <label for="jobLevel">Job Level</label>
          <input
            type="text"
            id="jobLevel"
            placeholder="Entry, Mid, Senior, etc."
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="einNumber">EIN Number</label>
          <input
            type="text"
            id="einNumber"
            data-gofakeit="true"
            placeholder="12-3456789"
          />
          <div class="field-note">Uses search to find ein function</div>
        </div>
      </div>
    </div>

    <!-- PAYMENT CATEGORY -->
    <div id="payment-category" class="rows">
      <h4>💳 Payment Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="creditCard">Credit Card</label>
          <input type="text" id="creditCard" placeholder="Credit card number" />
        </div>
        <div class="form-group">
          <label for="creditCardType">Credit Card Type</label>
          <input
            type="text"
            id="creditCardType"
            placeholder="Visa, MasterCard, etc."
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="creditCardCVV">Credit Card CVV</label>
          <input
            type="text"
            id="creditCardCVV"
            placeholder="3-4 digit security code"
          />
        </div>
        <div class="form-group">
          <label for="creditCardExp">Credit Card Expiry</label>
          <input type="text" id="creditCardExp" placeholder="MM/YY format" />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            placeholder="Bank institution name"
          />
        </div>
        <div class="form-group">
          <label for="creditCardNumber">Credit Card Number</label>
          <input
            type="text"
            id="creditCardNumber"
            placeholder="Full credit card number"
          />
        </div>
      </div>
    </div>

    <!-- INTERNET CATEGORY -->
    <div id="internet-category" class="rows">
      <h4>🌐 Internet Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="domainName">Domain Name</label>
          <input type="text" id="domainName" placeholder="example.com" />
        </div>
        <div class="form-group">
          <label for="ipv6Address">IPv6 Address</label>
          <input type="text" id="ipv6Address" placeholder="IPv6 address" />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="userAgent">User Agent</label>
          <input
            type="text"
            id="userAgent"
            placeholder="Browser user agent string"
          />
        </div>
        <div class="form-group">
          <label for="httpMethod">HTTP Method</label>
          <input
            type="text"
            id="httpMethod"
            placeholder="GET, POST, PUT, etc."
          />
        </div>
      </div>
    </div>

    <!-- TIME CATEGORY -->
    <div id="time-category" class="rows">
      <h4>⏰ Time Category</h4>

      <!-- Text-based Time Fields -->
      <h5>📝 Text-based Time Fields</h5>
      <div class="row">
        <div class="form-group">
          <label for="timezone">Timezone</label>
          <input type="text" id="timezone" placeholder="UTC, EST, PST, etc." />
        </div>
        <div class="form-group">
          <label for="weekday">Weekday</label>
          <input type="text" id="weekday" placeholder="Monday, Tuesday, etc." />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="month">Month</label>
          <input type="text" id="month" placeholder="January, February, etc." />
        </div>
        <div class="form-group">
          <label for="year">Year</label>
          <input type="number" id="year" placeholder="Year value" />
        </div>
      </div>
    </div>

    <!-- LANGUAGE CATEGORY -->
    <div id="language-category" class="rows">
      <h4>🗣️ Language Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="programmingLanguage">Programming Language</label>
          <input
            type="text"
            id="programmingLanguage"
            placeholder="JavaScript, Python, Go, etc."
          />
        </div>
        <div class="form-group">
          <label for="languageAbbreviation">Language Abbreviation</label>
          <input
            type="text"
            id="languageAbbreviation"
            placeholder="en, es, fr, etc."
          />
        </div>
      </div>
    </div>

    <!-- WORD CATEGORY -->
    <div id="word-category" class="rows">
      <h4>📝 Word Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="noun">Noun</label>
          <input type="text" id="noun" placeholder="Random noun" />
        </div>
        <div class="form-group">
          <label for="verb">Verb</label>
          <input type="text" id="verb" placeholder="Random verb" />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="adjective">Adjective</label>
          <input type="text" id="adjective" placeholder="Random adjective" />
        </div>
        <div class="form-group">
          <label for="sentence">Sentence</label>
          <input type="text" id="sentence" placeholder="Random sentence" />
        </div>
      </div>
    </div>

    <!-- COLOR CATEGORY -->
    <div id="color-category" class="rows">
      <h4>🎨 Color Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="hexColor">Hex Color</label>
          <input type="text" id="hexColor" placeholder="#FF0000" />
        </div>
        <div class="form-group">
          <label for="rgbColor">RGB Color</label>
          <input type="text" id="rgbColor" placeholder="rgb(255, 0, 0)" />
        </div>
      </div>
    </div>

    <!-- ANIMAL CATEGORY -->
    <div id="animal-category" class="rows">
      <h4>🐾 Animal Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="animal">Animal</label>
          <input type="text" id="animal" placeholder="Random animal" />
        </div>
        <div class="form-group">
          <label for="bird">Bird</label>
          <input type="text" id="bird" placeholder="Random bird" />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="cat">Cat</label>
          <input type="text" id="cat" placeholder="Random cat breed" />
        </div>
        <div class="form-group">
          <label for="dog">Dog</label>
          <input type="text" id="dog" placeholder="Random dog breed" />
        </div>
      </div>
    </div>

    <!-- FOOD CATEGORY -->
    <div id="food-category" class="rows">
      <h4>🍕 Food Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="fruit">Fruit</label>
          <input type="text" id="fruit" placeholder="Random fruit" />
        </div>
        <div class="form-group">
          <label for="vegetable">Vegetable</label>
          <input type="text" id="vegetable" placeholder="Random vegetable" />
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="breakfast">Breakfast</label>
          <input type="text" id="breakfast" placeholder="Breakfast food" />
        </div>
        <div class="form-group">
          <label for="lunch">Lunch</label>
          <input type="text" id="lunch" placeholder="Lunch food" />
        </div>
      </div>
    </div>

    <!-- CAR CATEGORY -->
    <div id="car-category" class="rows">
      <h4>🚗 Car Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="carMaker">Car Maker</label>
          <input type="text" id="carMaker" placeholder="Car manufacturer" />
        </div>
        <div class="form-group">
          <label for="carModel">Car Model</label>
          <input type="text" id="carModel" placeholder="Car model name" />
        </div>
      </div>
    </div>

    <!-- PRODUCT CATEGORY -->
    <div id="product-category" class="rows">
      <h4>📦 Product Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            data-gofakeit="true"
            placeholder="Product name"
          />
          <div class="field-note">Uses search to find product function</div>
        </div>
        <div class="form-group">
          <label for="productCategory">Product Category</label>
          <input
            type="text"
            id="productCategory"
            data-gofakeit="true"
            placeholder="Product category"
          />
          <div class="field-note">Uses search to find category function</div>
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="productBrand">Brand</label>
          <input
            type="text"
            id="productBrand"
            data-gofakeit="true"
            placeholder="Brand name"
          />
          <div class="field-note">Uses search to find brand function</div>
        </div>
        <div class="form-group">
          <label for="productSku">SKU</label>
          <input
            type="text"
            id="productSku"
            data-gofakeit="true"
            placeholder="Product SKU"
          />
          <div class="field-note">Uses search to find sku function</div>
        </div>
      </div>
      <div class="row">
        <div class="form-group">
          <label for="productDescription">Description</label>
          <textarea
            id="productDescription"
            data-gofakeit="true"
            placeholder="Product description"
            rows="3"
          ></textarea>
          <div class="field-note">Uses search to find description function</div>
        </div>
      </div>
    </div>

    <!-- GAME CATEGORY -->
    <div id="game-category" class="rows">
      <h4>🎮 Game Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="gamertag">Gamertag</label>
          <input type="text" id="gamertag" placeholder="Gaming username" />
        </div>
        <div class="form-group">
          <label for="dice">Dice</label>
          <input type="text" id="dice" placeholder="Dice roll result" />
        </div>
      </div>
    </div>

    <!-- MISC CATEGORY -->
    <div id="misc-category" class="rows">
      <h4>🎲 Misc Category</h4>
      <div class="row">
        <div class="form-group">
          <label for="uuid">UUID</label>
          <input type="text" id="uuid" placeholder="Unique identifier" />
        </div>
        <div class="form-group">
          <label for="bool">Boolean</label>
          <input type="text" id="bool" placeholder="True or false" />
        </div>
      </div>
    </div>
  </div>
</template>
