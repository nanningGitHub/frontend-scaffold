import React from 'react';
import { render, screen } from '@testing-library/react';
import { EnterpriseErrorBoundary } from '../EnterpriseErrorBoundary';

// Mock the error handler
jest.mock('../../utils/enterpriseErrorHandler', () => ({
  errorHandler: {
    handleError: jest.fn(),
  },
}));

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('EnterpriseErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <EnterpriseErrorBoundary>
        <ThrowError shouldThrow={false} />
      </EnterpriseErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error fallback when there is an error', () => {
    render(
      <EnterpriseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </EnterpriseErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(
      screen.getByText(/Please try refreshing the page/)
    ).toBeInTheDocument();
  });

  it('renders custom error message when provided', () => {
    const customMessage = 'Custom error message';
    render(
      <EnterpriseErrorBoundary fallback={<div>{customMessage}</div>}>
        <ThrowError shouldThrow={true} />
      </EnterpriseErrorBoundary>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls error handler when error occurs', () => {
    const { errorHandler } = require('../../utils/enterpriseErrorHandler');

    render(
      <EnterpriseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </EnterpriseErrorBoundary>
    );

    expect(errorHandler.handleError).toHaveBeenCalled();
  });

  it('renders retry button and handles retry', () => {
    render(
      <EnterpriseErrorBoundary>
        <ThrowError shouldThrow={true} />
      </EnterpriseErrorBoundary>
    );

    const retryButton = screen.getByText(/Try again/);
    expect(retryButton).toBeInTheDocument();

    // Test retry functionality
    retryButton.click();
    // The component should re-render and attempt to render children again
  });
});
