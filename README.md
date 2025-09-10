# Gofakeit Plugin

A powerful autofill plugin for form field automation using the Gofakeit API.

![Tests](https://img.shields.io/badge/tests-197%20passed-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-85%25-green)

<iframe width="560" height="315" src="https://www.youtube.com/embed/tKS_ERFRd1M" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Try the Live Demo](https://brianvoe.github.io/gofakeit_js/) - Demo page

## Quick Start

```bash
npm install gofakeit
```

```typescript
import { Autofill } from 'gofakeit';

// Create an autofill instance and fill all form fields
const autofill = new Autofill();
await autofill.fill();

// Or target specific elements
await autofill.fill('#myForm'); // Target by ID
await autofill.fill('.form-container'); // Target by class
```

## Features

- 🎯 **Smart Detection**: Automatically detects and fills form fields based on context and labels
- 🌐 **API Integration**: Complete integration with Gofakeit API for all data generation
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
```

### API Functions

The plugin provides direct access to the Gofakeit API

See full list of available functions

```typescript
import { fetchFunc, fetchFuncMulti, fetchFuncSearch } from 'gofakeit';

// Call a gofakeit function
const data = await fetchFunc('uuid');

// Call a gofakeit function with params
const data = await fetchFunc('password', {
  lower: true,
  upper: true,
  numeric: true,
  special: true,
  length: 10,
})

// Call multiple functions in batch
const results = await fetchFuncMulti([
  { func: 'name' },
  { func: 'email' },
  { func: 'randomstring', { strs: ['first', 'second', 'third'] }}
]);

// Search for best function to use
const searchResults = await fetchFuncSearch('email address');
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
