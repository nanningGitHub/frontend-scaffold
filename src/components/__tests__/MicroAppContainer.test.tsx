import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MicroAppContainer } from '../MicroAppContainer';

// Mock the micro frontend manager
jest.mock('../../utils/microFrontendManager', () => ({
  loadMicroApp: jest.fn(),
  unloadMicroApp: jest.fn(),
}));

// Mock the micro app communication
jest.mock('../../utils/microAppCommunication', () => ({
  sendMessage: jest.fn(),
  onMessage: jest.fn(),
  offMessage: jest.fn(),
}));

describe('MicroAppContainer', () => {
  const mockProps = {
    name: 'test-micro-app',
    url: 'http://localhost:3001',
    scope: 'testApp',
    module: './App',
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<MicroAppContainer {...mockProps} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error state when micro app fails to load', async () => {
    const { loadMicroApp } = require('../../utils/microFrontendManager');
    loadMicroApp.mockRejectedValueOnce(new Error('Failed to load micro app'));

    render(<MicroAppContainer {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });

  it('renders micro app when successfully loaded', async () => {
    const mockMicroApp = {
      mount: jest.fn(),
      unmount: jest.fn(),
    };

    const { loadMicroApp } = require('../../utils/microFrontendManager');
    loadMicroApp.mockResolvedValueOnce(mockMicroApp);

    render(<MicroAppContainer {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('micro-app-container')).toBeInTheDocument();
    });
  });

  it('calls loadMicroApp with correct parameters', async () => {
    const { loadMicroApp } = require('../../utils/microFrontendManager');
    loadMicroApp.mockResolvedValueOnce({});

    render(<MicroAppContainer {...mockProps} />);

    await waitFor(() => {
      expect(loadMicroApp).toHaveBeenCalledWith(
        mockProps.name,
        mockProps.url,
        mockProps.scope,
        mockProps.module
      );
    });
  });

  it('unmounts micro app when component unmounts', async () => {
    const mockMicroApp = {
      mount: jest.fn(),
      unmount: jest.fn(),
    };

    const {
      loadMicroApp,
      unloadMicroApp,
    } = require('../../utils/microFrontendManager');
    loadMicroApp.mockResolvedValueOnce(mockMicroApp);

    const { unmount } = render(<MicroAppContainer {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('micro-app-container')).toBeInTheDocument();
    });

    unmount();

    expect(unloadMicroApp).toHaveBeenCalledWith(mockProps.name);
  });

  it('handles custom loading component', () => {
    const CustomLoading = () => <div>Custom Loading...</div>;

    render(
      <MicroAppContainer {...mockProps} loadingComponent={<CustomLoading />} />
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });

  it('handles custom error component', async () => {
    const CustomError = ({ error }: { error: Error }) => (
      <div>Custom Error: {error.message}</div>
    );

    const { loadMicroApp } = require('../../utils/microFrontendManager');
    loadMicroApp.mockRejectedValueOnce(new Error('Custom error message'));

    render(<MicroAppContainer {...mockProps} errorComponent={CustomError} />);

    await waitFor(() => {
      expect(
        screen.getByText('Custom Error: Custom error message')
      ).toBeInTheDocument();
    });
  });

  it('passes props to micro app', async () => {
    const mockMicroApp = {
      mount: jest.fn(),
      unmount: jest.fn(),
    };

    const { loadMicroApp } = require('../../utils/microFrontendManager');
    loadMicroApp.mockResolvedValueOnce(mockMicroApp);

    const customProps = { theme: 'dark', userId: '123' };

    render(<MicroAppContainer {...mockProps} {...customProps} />);

    await waitFor(() => {
      expect(mockMicroApp.mount).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        customProps
      );
    });
  });

  it('handles micro app communication', async () => {
    const {
      onMessage,
      sendMessage,
    } = require('../../utils/microAppCommunication');

    render(<MicroAppContainer {...mockProps} />);

    // Simulate receiving a message from micro app
    const messageHandler = onMessage.mock.calls[0][1];
    messageHandler({ type: 'MICRO_APP_READY', payload: { ready: true } });

    // Simulate sending a message to micro app
    const container = screen.getByTestId('micro-app-container');
    expect(container).toBeInTheDocument();

    // The component should be able to send messages
    expect(sendMessage).toHaveBeenCalled();
  });
});
