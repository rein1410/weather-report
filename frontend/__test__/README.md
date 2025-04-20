# Testing Documentation

This document provides information about testing the Weather Report application.

## Testing Setup

The application uses the following testing tools:

- **Vitest**: A Vite-native testing framework
- **React Testing Library**: For testing React components
- **jsdom**: For simulating a DOM environment in Node.js

## Running Tests

To run the tests, use the following command from the frontend directory:

```bash
npm test
```

To run tests in watch mode (tests will re-run when files change):

```bash
npm test -- --watch
```

To run a specific test file:

```bash
npm test -- path/to/test/file.test.tsx
```

## Test Structure

Tests are organized in the `__test__` directory and follow these naming conventions:

- Test files are named with the pattern `*.test.tsx`
- Test files are placed in the `__test__` directory
- Test files correspond to the components or pages they test

## Writing Tests

### Basic Test Structure

A typical test file follows this structure:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComponentName from '../src/path/to/component';

// Import the setup file
import './setup';

describe('ComponentName', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should render correctly', () => {
    // Test implementation
  });
});
```

### Testing Pages with API Calls

For pages that fetch data from an API, you need to mock the fetch function:

```tsx
// Mock data
const mockData = {
  list: [
    {
      dt: 1619712000,
      temp: 293.15,
      pressure: 1013,
      humidity: 70,
      clouds: 20
    }
  ]
};

// Mock the fetch response
(fetch as any).mockResolvedValueOnce({
  json: () => Promise.resolve(mockData)
});

// Render the component
const { container } = render(await PageComponent());
```

### Testing Components with Props

For components that receive props:

```tsx
render(<ComponentName prop1="value1" prop2={42} />);
```

### Common Assertions

```tsx
// Check if an element is in the document
expect(element).toBeDefined();

// Check if an element has a specific text content
expect(element).toHaveTextContent('Expected Text');

// Check if an element has a specific attribute
expect(element).toHaveAttribute('attribute', 'value');

// Check if an element has a specific class
expect(element).toHaveClass('class-name');

// Check the number of elements
expect(elements.length).toBeGreaterThan(0);
```

## Mocking

### Mocking Fetch API

The fetch API is mocked globally in the setup file. For specific tests, you can override the mock:

```tsx
// Mock the fetch response
(fetch as any).mockResolvedValueOnce({
  json: () => Promise.resolve(mockData)
});
```

### Mocking Components

To mock a component:

```tsx
vi.mock('@/components/ui/component-name', () => ({
  ComponentName: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
```

## Test Coverage

To generate a test coverage report:

```bash
npm test -- --coverage
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on testing what the component does, not how it does it.
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText`, etc. over `getByTestId`.
3. **Keep Tests Simple**: Each test should verify one specific behavior.
4. **Mock External Dependencies**: Always mock API calls, timers, and other external dependencies.
5. **Clean Up After Tests**: Use `beforeEach` to reset mocks and state between tests.

## Troubleshooting

### Common Issues

1. **"TypeError: Cannot read property 'toBeInTheDocument' of undefined"**: Make sure you've imported the setup file and that it includes `@testing-library/jest-dom`.

2. **"Error: Uncaught [Error: TextEncoder is not defined]"**: This is a known issue with jsdom. The setup file should handle this.

3. **"Error: fetch is not defined"**: Make sure the fetch mock is properly set up in the setup file.

### Debugging Tests

To debug tests, you can use the `debug` function from React Testing Library:

```tsx
import { render, screen, debug } from '@testing-library/react';

// Render the component
render(<ComponentName />);

// Print the current DOM state
debug();
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/) 