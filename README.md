# Gofakeit Plugin

A powerful autofill plugin for form field automation using the Gofakeit API with intelligent function detection.

![Tests](https://img.shields.io/badge/tests-102%20passed-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-75.1%25-green)

🚀 **[Try the Live Demo](https://brianvoe.github.io/gofakeit_js/)** - See the autofill plugin in action!

## Features

- 🎯 **Smart Form Detection**: Automatically detects and fills form fields based on context, labels, and attributes
- 🌐 **API Integration**: Seamless integration with Gofakeit API for data generation
- ⚡ **Batch Processing**: Efficient batch processing with individual handling for special input types
- 🎨 **Visual Feedback**: Function badges show which gofakeit function was used for each field
- ⏱️ **Staggered Timing**: Configurable delays for visual effect during autofill
- 🔧 **TypeScript**: Full TypeScript support with type definitions
- 📦 **Modern Build**: ES modules and CommonJS support with minification
- 🧪 **Comprehensive Testing**: Full test suite with Vitest and jsdom
- 🛠️ **Extensible**: Easy to add new input types and functions

### Excluded Input Types

Certain input types are excluded from the search API and use direct function assignment:
- `checkbox`, `radio`, `select` - Use predefined selection logic
- `date`, `time`, `datetime-local`, `month`, `week` - Use local date/time generation
- `color`, `range`, `file`, `button`, `image` - Use specific handlers

## Installation

```bash
npm install gofakeit
```

## Usage

### Autofill Function

The `autofill()` function is the main entry point that handles all autofill scenarios:

```typescript
import { autofill, type AutofillSettings } from 'gofakeit'

// Autofill all form fields on the page (with default settings)
await autofill()

// Autofill with custom settings
await autofill(undefined, { smart: true }) // Enable smart-fill mode
await autofill(undefined, { smart: false }) // Only fill fields with data-gofakeit attributes

// Autofill all fields within a specific container
const form = document.getElementById('myForm')
await autofill(form, { smart: true })

// Autofill a single form element
const input = document.getElementById('email')
await autofill(input, { smart: false })
```

### Settings

The `autofill()` function accepts an optional settings object:

```typescript
interface AutofillSettings {
  smart?: boolean;        // Default: true - Enable smart form field detection
  staggered?: boolean;    // Default: true - Add delays between field fills for visual effect
  staggerDelay?: number;  // Default: 50 - Delay in milliseconds between field fills
}
```

- **`smart: true`** (default): Fills ALL form fields on the page, intelligently detecting appropriate data types using the search API
- **`smart: false`**: Only fills fields that have explicit `data-gofakeit` attributes (manual mode)
- **`staggered: true`** (default): Adds visual delays between field fills for better user experience
- **`staggered: false`**: Fills all fields instantly (fast mode)
- **`staggerDelay: number`**: Customize the delay between field fills (default: 50ms)

### API Functions

```typescript
import { callFunc } from 'gofakeit'

// Call a specific gofakeit function
const data = await callFunc('person')
```

### Function List

```typescript
// Get available functions and utilities
import { hasFunc, getFuncs, type Func } from 'gofakeit'

// Check if a function exists
const isValid = hasFunc('person')

// Get all available functions
const allFunctions = getFuncs()

// Outputs
[
  {
    "value":"password",
    "display":"Password",
    "category":"auth"
  },
  {
    "value":"gamertag",
    "display":"Gamertag",
    "category":"game"
  }
  // etc...
]
```

### Data Attributes

You can control autofill behavior using HTML data attributes:

```html
<!-- Exclude field from autofill -->
<input type="text" data-gofakeit="false" />

<!-- Specify a specific function -->
<input type="text" data-gofakeit="email" />

<!-- Enable autofill (default) -->
<input type="text" data-gofakeit="true" />
```

## Development

### Quick Start

Start the development server with hot reload:

```bash
npm run dev
```

This will start a development server at `http://localhost:5173` with an interactive example page demonstrating all autofill features.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
