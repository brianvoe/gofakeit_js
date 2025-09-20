# Gofakeit Plugin

A powerful autofill plugin for form field automation using the Gofakeit API.

![Tests](https://img.shields.io/badge/tests-197%20passed-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-85%25-green)

https://github.com/user-attachments/assets/f70c4152-65d3-4b22-ba8c-c871d0dae993

[Try the Live Demo](https://brianvoe.github.io/gofakeit_js/) - Demo page

## Quick Start

```bash
npm install gofakeit
```

### ES Modules (Recommended)
```typescript
import { Autofill } from 'gofakeit';

// Create an autofill instance and fill all form fields
const autofill = new Autofill();
await autofill.fill();

// Or target specific elements
await autofill.fill('#myForm'); // Target by ID
await autofill.fill('.form-container'); // Target by class
```

### Browser (UMD)
```html
<script src="https://unpkg.com/gofakeit/dist/gofakeit.umd.js"></script>
<script>
  const autofill = new Gofakeit.Autofill();
  await autofill.fill();
</script>
```

### Browser (IIFE)
```html
<script src="https://unpkg.com/gofakeit/dist/gofakeit.iife.js"></script>
<script>
  const autofill = new Gofakeit.Autofill();
  await autofill.fill();
</script>
```

## Features

- 🎯 **Smart Detection**: Automatically detects and fills form fields based on context and labels
- 🌐 **Function Generation**: Generate data using the Gofakeit API functions
- 🔍 **Function Search**: Intelligent function discovery using natural language queries
- 🎨 **Visual Feedback**: Function badges show which gofakeit function was used
- 📅 **Date/Time Support**: All date/time input types with min/max constraints
- 🔢 **Number Support**: Number and range inputs with min/max parameters
- ✅ **Form Controls**: Checkboxes, radio buttons, and select elements
- 🚫 **Error Handling**: Visual feedback for invalid functions
- 🔧 **TypeScript**: Full TypeScript support with type definitions

### Supported Input Types

- **Text inputs**: `text`, `email`, `password`, `tel`, `url`, `search` - Auto-detected via search API
- **Form controls**: `checkbox`, `radio`, `select` - Uses appropriate API functions
- **Date/Time**: `date`, `time`, `datetime-local`, `month`, `week` - With min/max constraints
- **Numbers**: `number`, `range` - With min/max parameters
- **Color**: `color` - Uses hexcolor function for hex color values

### Unsupported Input Types

- **File inputs**: `file` - Currently Not supported by the Gofakeit API
- **Image inputs**: `image` - Currently Not supported by the Gofakeit API
- **Button inputs**: `button` - Not a valid input type for autofill
- **Submit inputs**: `submit` - Not a valid input type for autofill
- **Reset inputs**: `reset` - Not a valid input type for autofill

## Advanced Usage

```typescript
import { Autofill } from 'gofakeit';

// Create an autofill instance with default settings
const autofill = new Autofill({
  mode: 'auto', // 'auto' or 'manual'(data-gofakeit only)
  stagger: 50, // Delay between field fills (ms)
  badges: 3000, // How long to show function badges (ms)
  debug: true, // Enable debug logging
  onStatusChange: (status, elements) => {
    // Track autofill progress
    console.log(`Status: ${status}, Elements: ${elements.length}`);
  }
});

// Autofill all form fields on the page
await autofill.fill();

// Autofill using string selectors
await autofill.fill('#myForm'); // Target by ID
await autofill.fill('.form-container'); // Target by class
await autofill.fill('.form-section input[type="email"]'); // Complex CSS selector

// Autofill all fields within a specific container
const form = document.getElementById('myForm');
await autofill.fill(form);

// Autofill a single form element
const input = document.getElementById('email');
await autofill.fill(input);

// Autofill with a specific function override
await autofill.fill('#myForm', 'password'); // Use 'password' function for all elements
await autofill.fill(input, 'uuid'); // Use 'uuid' function for this specific element

// Autofill with function and custom parameters
await autofill.fill('#myForm', 'password', { length: 12, special: true }); // Custom password params
await autofill.fill(input, 'number', { min: 1, max: 100 }); // Custom number range
```

### Status Callbacks

You can track the autofill process using the `onStatusChange` callback:

```typescript
import { Autofill, AutofillStatus } from 'gofakeit';

const autofill = new Autofill({
  onStatusChange: (status, elements) => {
    console.log(`Status: ${status}, Elements: ${elements.length}`);

    switch (status) {
      case AutofillStatus.STARTING:
        console.log('Autofill process starting');
        break;
      case AutofillStatus.FOUND:
        console.log('Form elements found and identified');
        break;
      case AutofillStatus.DETERMINED:
        console.log('Functions determined for each element');
        break;
      case AutofillStatus.GENERATED:
        console.log('Values generated from the API');
        break;
      case AutofillStatus.SET:
        console.log('Values applied to form elements');
        break;
      case AutofillStatus.COMPLETED:
        console.log('Autofill process completed successfully');
        break;
      case AutofillStatus.ERROR:
        console.log('An error occurred during autofill');
        break;
    }
  }
});

await autofill.fill();
```

#### Status Values

The `onStatusChange` callback receives the following status values:

- **`STARTING`** - Autofill process is starting
- **`FOUND`** - Form elements have been found and identified
- **`DETERMINED`** - Functions have been determined for each element
- **`GENERATED`** - Values have been generated from the API
- **`SET`** - Values have been applied to the form elements
- **`COMPLETED`** - Autofill process finished successfully
- **`ERROR`** - An error occurred during the autofill process

The callback also receives the current `elements` array, which contains all the form elements being processed with their current state (function, value, error, etc.).

### Function Override

You can override the automatic function detection by specifying a gofakeit function name as the second parameter:

```typescript
// Use a specific function for all elements in a form
await autofill.fill('#myForm', 'password');

// Use a specific function for a single element
const emailInput = document.getElementById('email');
await autofill.fill(emailInput, 'uuid');

// Use a specific function for elements matching a CSS selector
await autofill.fill('input[type="date"]', 'date');

// Use a function with custom parameters
await autofill.fill('#myForm', 'password', {
  length: 12,
  special: true,
  upper: true
});

// Use a function with custom parameters for specific elements
await autofill.fill('input[type="number"]', 'number', {
  min: 1,
  max: 100
});
```

This is particularly useful when you need:
- Consistent data types across multiple fields
- Specific formatting requirements
- Testing with known function outputs
- Overriding the automatic detection for complex input types
- Custom parameters for gofakeit functions (e.g., password length, number ranges, date ranges)

### API Functions

The plugin provides direct access to the Gofakeit API with clear input/output examples.

#### Single Function Call

```typescript
import { fetchFunc } from 'gofakeit';

// Input: Function name
const result = await fetchFunc('email');

// Output: Success response
{
  result: "john.doe@example.com"
}

// Input: Function with parameters
const result = await fetchFunc('password', {
  length: 12,
  upper: true,
  lower: true,
  numeric: true,
  special: true
});

// Output: Success response
{
  result: "MyP@ssw0rd123!"
}

// Input: Invalid function
const result = await fetchFunc('invalidFunction');

// Output: Error response
{
  error: "Function not found"
}
```

#### Multiple Function Calls

```typescript
import { fetchFuncMulti } from 'gofakeit';

// Input: Array of function requests
const results = await fetchFuncMulti([
  { func: 'name' },
  { func: 'email' },
  { func: 'randomstring', params: { strs: ['first', 'second', 'third'] }},
  { func: 'number', params: { min: 1, max: 100 }}
]);

// Output: Array of results
{
  results: [
    { id: "req_0", value: "John Smith" },
    { id: "req_1", value: "john.smith@example.com" },
    { id: "req_2", value: "second" },
    { id: "req_3", value: 42 }
  ]
}

// Input: Empty array
const results = await fetchFuncMulti([]);

// Output: Error response
{
  error: "No functions provided"
}
```

### Function Search API

The `fetchFuncSearch` function allows you to find the best gofakeit function for your needs by searching with natural language queries. It supports both single requests and batch requests.

#### Single Search Request

```typescript
import { fetchFuncSearch } from 'gofakeit';

// Input: Single search request (id is optional)
const searchResult = await fetchFuncSearch({
  queries: ['email address', 'contact email']
});

// Output: Single result object (transformed by our client)
{
  results: {
    id: "",
    results: [
      {
        name: "email",
        score: 7751,
        reasons: [
          "idsmash_exact_alias",
          "exact_display",
          "exact_keyword",
          "query_contains_name",
          "phrase_exact_alias",
          "exact_name",
          "partial_alias",
          "description"
        ]
      },
      {
        name: "email_text",
        score: 2202,
        reasons: [
          "partial_name",
          "partial_display",
          "partial_alias",
          "exact_keyword",
          "description"
        ]
      }
    ]
  }
}

// Input: With optional id for identification
const searchResultWithId = await fetchFuncSearch({
  id: 'email_search',
  queries: ['email address', 'contact email']
});

// Output: Same structure with your provided id (transformed by our client)
{
  results: {
    id: "email_search",
    results: [
      {
        name: "email",
        score: 7751,
        reasons: [
          "idsmash_exact_alias",
          "exact_display",
          "exact_keyword",
          "query_contains_name",
          "phrase_exact_alias",
          "exact_name",
          "partial_alias",
          "description"
        ]
      }
    ]
  }
}
```

#### Batch Search Requests

```typescript
// Input: Array of search requests
// IDs are optional but helpful for identifying results
const searchResults = await fetchFuncSearch([
  { id: 'email_search', queries: ['email', 'contact'] },
  { id: 'name_search', queries: ['first name', 'given name'] },
  { id: 'phone_search', queries: ['phone number', 'telephone'] }
]);

// Output: Array of result objects (transformed by our client)
{
  results: [
    {
      id: "email_search",
      results: [
        {
          name: "email",
          score: 2495,
          reasons: [
            "query_contains_name",
            "idsmash_exact_display",
            "idsmash_exact_name",
            "exact_name",
            "exact_display",
            "partial_alias",
            "exact_keyword"
          ]
        },
        {
          name: "email_text",
          score: 1101,
          reasons: [
            "partial_alias",
            "exact_keyword",
            "description",
            "partial_name",
            "partial_display"
          ]
        }
      ]
    },
    {
      id: "name_search",
      results: [
        {
          name: "firstname",
          score: 8108,
          reasons: [
            "idsmash_exact_display",
            "idsmash_exact_alias",
            "idsmash_exact_name",
            "partial_display",
            "partial_alias",
            "exact_keyword",
            "phrase_exact_display",
            "phrase_exact_alias",
            "partial_name",
            "description"
          ]
        },
        {
          name: "name",
          score: 2755,
          reasons: [
            "exact_keyword",
            "exact_name",
            "exact_display",
            "partial_alias",
            "description",
            "query_contains_name"
          ]
        }
      ]
    },
    {
      id: "phone_search",
      results: [
        {
          name: "phone",
          score: 4458,
          reasons: [
            "description",
            "phrase_exact_alias",
            "idsmash_exact_alias",
            "exact_name",
            "exact_display",
            "query_contains_name",
            "partial_alias",
            "exact_keyword"
          ]
        },
        {
          name: "phoneformatted",
          score: 2411,
          reasons: [
            "partial_alias",
            "exact_keyword",
            "description",
            "phrase_in_description",
            "partial_name",
            "partial_display"
          ]
        }
      ]
    }
  ]
}

// Input: Empty array
const searchResults = await fetchFuncSearch([]);

// Output: Error response
{
  error: "No search requests provided"
}
```

#### Using Search Results

```typescript
// Process search results
if (searchResult.results && !searchResult.error) {
  const bestMatch = searchResult.results.results[0];
  console.log(`Best function: ${bestMatch.name}`);
  console.log(`Confidence score: ${bestMatch.score}`);
  console.log(`Why it matched: ${bestMatch.reasons.join(', ')}`);

  // Use the best match function
  const data = await fetchFunc(bestMatch.name);
  console.log(`Generated data: ${data.result}`);
}
```

### Real-World Examples

Here are practical examples showing how to use the API functions in real applications:

#### Example 1: User Registration Form

```typescript
import { fetchFuncMulti, fetchFuncSearch } from 'gofakeit';

// Step 1: Search for appropriate functions
const searchResults = await fetchFuncSearch([
  { id: 'first_name', queries: ['first name', 'given name'] },
  { id: 'last_name', queries: ['last name', 'surname', 'family name'] },
  { id: 'email', queries: ['email address', 'contact email'] },
  { id: 'phone', queries: ['phone number', 'telephone', 'mobile'] }
]);

// Step 2: Extract function names from search results
const functions = searchResults.results.map(result => result.results[0].name);
// Result: ['firstname', 'lastname', 'email', 'phone']

// Step 3: Generate data using the found functions
const userData = await fetchFuncMulti([
  { func: functions[0] }, // firstname
  { func: functions[1] }, // lastname
  { func: functions[2] }, // email
  { func: functions[3] }  // phone
]);

// Output: Complete user data
{
  results: [
    { id: "req_0", value: "John" },
    { id: "req_1", value: "Smith" },
    { id: "req_2", value: "john.smith@example.com" },
    { id: "req_3", value: "+1-555-123-4567" }
  ]
}
```

#### Example 2: Product Information

```typescript
// Input: Generate product data with specific parameters
const productData = await fetchFuncMulti([
  {
    func: 'product',
    params: { category: 'electronics' }
  },
  {
    func: 'price',
    params: { min: 10, max: 1000 }
  },
  {
    func: 'number',
    params: { min: 1, max: 100 }
  }
]);

// Output: Product information
{
  results: [
    { id: "req_0", value: "Wireless Bluetooth Headphones" },
    { id: "req_1", value: 249.99 },
    { id: "req_2", value: 42 }
  ]
}
```

#### Example 3: Address Generation

```typescript
// Input: Generate complete address
const addressData = await fetchFuncMulti([
  { func: 'street' },
  { func: 'city' },
  { func: 'state' },
  { func: 'zip' },
  { func: 'country' }
]);

// Output: Complete address
{
  results: [
    { id: "req_0", value: "123 Main Street" },
    { id: "req_1", value: "New York" },
    { id: "req_2", value: "NY" },
    { id: "req_3", value: "10001" },
    { id: "req_4", value: "United States" }
  ]
}
```

#### Example 4: Error Handling

```typescript
// Input: Mix of valid and invalid functions
const mixedResults = await fetchFuncMulti([
  { func: 'email' },           // Valid
  { func: 'invalidFunction' }, // Invalid
  { func: 'name' }             // Valid
]);

// Output: Results with error handling
{
  results: [
    { id: "req_0", value: "john.doe@example.com" },
    { id: "req_1", error: "Function not found" },
    { id: "req_2", value: "John Smith" }
  ]
}

// Handle errors in your code
mixedResults.results.forEach((result, index) => {
  if (result.error) {
    console.error(`Request ${index} failed: ${result.error}`);
  } else {
    console.log(`Request ${index} success: ${result.value}`);
  }
});
```

### Advanced Input Type Features

The plugin provides intelligent handling for complex input types with constraints

### Data Attributes

You can control autofill behavior using HTML data attributes:

```html
<!-- Specify a specific function -->
<input type="text" data-gofakeit="email" />

<!-- Enable autofill (always filled, regardless of mode) -->
<input type="text" data-gofakeit="true" />

<!-- Exclude field from autofill -->
<input type="text" data-gofakeit="false" />

<!-- No attribute: Only filled in Auto Mode (default) -->
<input type="text" />
```

### Error Handling

The plugin provides comprehensive error handling with visual feedback:

```html
<!-- Invalid function names will show error badges -->
<input type="text" data-gofakeit="invalidFunction" />
```

## Quick Reference

### API Function Summary

| Function | Input | Output | Use Case |
|----------|-------|--------|----------|
| `fetchFunc(func, params?)` | Function name + optional params | `{result?: string, error?: string}` | Single function calls |
| `fetchFuncMulti(requests[])` | Array of function requests | `{results?: Array<{id, value, error?}>, error?: string}` | Batch function calls |
| `fetchFuncSearch(request\|requests[])` | Search request(s) with queries | `{results?: SearchResult\|SearchResult[], error?: string}` | Find functions by description |

### Common Function Names

```typescript
// Personal Information
'firstname', 'lastname', 'name', 'email', 'phone', 'ssn', 'ein'

// Address Information
'street', 'city', 'state', 'zip', 'country', 'address'

// Business Information
'company', 'jobtitle', 'industry', 'product', 'price'

// Technical Data
'uuid', 'password', 'url', 'ipv4', 'macaddress', 'useragent'

// Date/Time
'date', 'time', 'datetime', 'year', 'month', 'day'

// Numbers
'number', 'int', 'float', 'price', 'age', 'year'
```

### Response Structure Examples

```typescript
// Single function success
{ result: "john.doe@example.com" }

// Single function error
{ error: "Function not found" }

// Multi function success
{ results: [{ id: "req_0", value: "John" }, { id: "req_1", value: "Smith" }] }

// Multi function error
{ error: "No functions provided" }

// Search success (single)
{ results: { id: "search_0", results: [{ name: "email", score: 1945, reasons: [...] }] } }

// Search success (batch)
{ results: [{ id: "search_0", results: [...] }, { id: "search_1", results: [...] }] }
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
