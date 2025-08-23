# Gofakeit Autofill Plugin

A powerful autofill plugin for form field automation using the Gofakeit API.

## Features

- 🚀 **Fast Development**: Built with Vite for lightning-fast development and building
- 🧪 **Comprehensive Testing**: Full test suite with Vitest and jsdom
- 📦 **Modern Build**: ES modules and CommonJS support
- 🔧 **TypeScript**: Full TypeScript support with type definitions
- 🎯 **Form Detection**: Intelligent form field detection and autofilling
- 🌐 **API Integration**: Seamless integration with Gofakeit API

## Quick Start

### Installation

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

This will start a development server at `http://localhost:5173` with the test form.

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
import { fetchGofakeitData } from 'gofakeit'

// Fetch specific data
const data = await fetchGofakeitData('person')

// Get available functions from the hardcoded list
import { FUNC_SHORT } from 'gofakeit'
```

## Development

### Project Structure

```
src/
├── api.ts              # API integration functions
├── autofill.ts         # Core autofill logic
├── field-error.ts      # Error handling
├── funcs.ts            # Function list and utilities
├── index.ts            # Main exports
├── input-*.ts          # Input type handlers
├── styles.ts           # Styling constants
└── test/               # Test files
    ├── setup.ts        # Test environment setup
    ├── autofill.test.ts
    └── api.test.ts
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

- `fetchGofakeitData(functionName)` - Fetch data from Gofakeit API
- `fetchRandomString()` - Get a random string
- `FUNC_SHORT` - Hardcoded list of available functions

### Input Handlers

- `handleTextInput(element)` - Handle text input fields
- `handleNumberInput(element)` - Handle number input fields
- `handleDateTimeInput(element)` - Handle date/time input fields
- `handleCheckbox(element)` - Handle checkbox fields
- `handleRadio(element)` - Handle radio button fields
- `handleSelectWithFunction(element)` - Handle select dropdowns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
