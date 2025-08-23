# Gofakeit Autofill Plugin

A powerful autofill plugin for form field automation using the Gofakeit API.

## Features

- 🚀 **Fast Development**: Built with Vite for lightning-fast development and building
- 🧪 **Comprehensive Testing**: Full test suite with Vitest and jsdom
- 📦 **Modern Build**: ES modules and CommonJS support with minification
- 🔧 **TypeScript**: Full TypeScript support with type definitions
- 🎯 **Smart Form Detection**: Intelligent form field detection with smart-fill mode
- 🌐 **API Integration**: Seamless integration with Gofakeit API
- 🛠️ **Extensible**: Easy to add new input types and functions

## Installation

```bash
npm install
```

## Usage

### Basic Autofill

```typescript
import { autofillAll } from 'gofakeit'

// Autofill all form fields on the page
await autofillAll()
```

### Autofill Specific Container

```typescript
import { autofillContainer } from 'gofakeit'

const form = document.getElementById('myForm')
await autofillContainer(form)
```

### Autofill Single Element

```typescript
import { autofillElement } from 'gofakeit'

const input = document.getElementById('email')
await autofillElement(input)
```

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
```

## Development

### Quick Start

Start the development server with hot reload:

```bash
npm run dev
```

This will start a development server at `http://localhost:5173` with an interactive example page demonstrating all autofill features.

### Building

Build the library for production:

```bash
npm run build
```

This creates optimized builds in the `dist/` directory.

### Testing

Run the test suite:

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Project Structure

```
src/
├── api.ts              # API integration functions
├── autofill.ts         # Core autofill logic
├── field-error.ts      # Error handling and tooltips
├── funcs.ts            # Function list and utilities
├── index.ts            # Main exports
├── input-datetime.ts   # Date/time input handlers
├── input-misc.ts       # Checkbox, radio, select handlers
├── input-number.ts     # Number and range input handlers
├── input-text.ts       # Text and textarea handlers
├── styles.ts           # Styling constants and design tokens
└── test/               # Test files
    ├── setup.ts        # Test environment setup
    ├── api.test.ts     # API function tests
    ├── autofill-all.test.ts
    ├── autofill-container.test.ts
    ├── autofill-element.test.ts
    ├── field-error.test.ts
    └── input-types.test.ts
```

### Adding Tests

Create new test files in `src/test/` following the existing pattern:

```typescript
import { describe, it, expect } from 'vitest'
import { yourFunction } from '../your-module'

describe('Your Function', () => {
  it('should work correctly', () => {
    expect(yourFunction()).toBe(expected)
  })
})
```

### Building for Distribution

The build process creates:

- `dist/index.js` - ES module build
- `dist/index.cjs` - CommonJS build  
- `dist/index.d.ts` - TypeScript declarations

## API Reference

### Core Functions

- `autofillAll()` - Autofill all form fields on the page
- `autofillContainer(container)` - Autofill fields in a specific container
- `autofillElement(element)` - Autofill a single form element
- `isFormField(element)` - Check if an element is a form field
- `hasFormFields(container)` - Check if a container has form fields

### API Functions

- `callFunc(functionName)` - Fetch data from Gofakeit API

### Misc Functions

- `hasFunc(name)` - Check if a function exists in the available list
- `getFuncs()` - Get all available functions
- `Func` - TypeScript interface for function entries

### Input Handlers

- `handleTextInput(element, functionName)` - Handle text input fields
- `handleTextarea(element, functionName)` - Handle textarea elements
- `handleNumberInput(element, functionName)` - Handle number input fields
- `handleRangeInput(element)` - Handle range input fields
- `handleDateTimeInput(element, functionName)` - Handle date/time input fields
- `handleCheckbox(element, functionName)` - Handle checkbox fields
- `handleRadio(element, functionName)` - Handle radio button fields
- `handleSelectWithFunction(element, functionName)` - Handle select dropdowns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
