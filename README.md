# Gofakeit Autofill Plugin

A powerful autofill plugin for form field automation using the Gofakeit API.

![Tests](https://img.shields.io/badge/tests-102%20passed-brightgreen) ![Coverage](https://img.shields.io/badge/coverage-75.1%25-green)

## Features

- 🎯 **Smart Form Detection**: Intelligent form field detection with smart-fill mode
- 🌐 **API Integration**: Seamless integration with Gofakeit API
- 🔧 **TypeScript**: Full TypeScript support with type definitions
- 📦 **Modern Build**: ES modules and CommonJS support with minification
- 🧪 **Comprehensive Testing**: Full test suite with Vitest and jsdom
- 🛠️ **Extensible**: Easy to add new input types and functions

## Installation

```bash
npm install
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
  smart?: boolean; // Default: true - Enable smart form field detection
}
```

- **`smart: true`** (default): Fills ALL form fields on the page, intelligently detecting appropriate data types based on field attributes (type, name, placeholder, etc.)
- **`smart: false`**: Only fills fields that have explicit `data-gofakeit` attributes (manual mode)

### API Functions

```typescript
import { callFunc } from 'gofakeit'

// Fetch specific data
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
