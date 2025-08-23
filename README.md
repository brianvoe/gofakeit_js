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
import { callFunc, fetchRandomString } from 'gofakeit'

// Fetch specific data
const data = await callFunc('person')
```

### Function list
```typescript
// Get available functions and utilities
import { hasFunc, getFuncs, type Func } from 'gofakeit'

// Check if a function exists
const isValid = hasFunc('person')

// Get all available functions
const allFunctions = getFuncs()
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
