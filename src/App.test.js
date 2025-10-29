import { render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

// Suppress act warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('act(')) return;
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

global.fetch = jest.fn();

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>
}));

describe('TfL Lift Disruptions Dashboard', () => {
  beforeEach(() => {
    // Clear the mock before each test so tests don't interfere with each other
    fetch.mockClear();
  });

  test('renders dashboard title', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);
    const titleElement = screen.getByText(/TfL Lift Disruptions Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('shows loading message initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);
    const loadingElement = screen.getByText(/Loading lift disruption data/i);
    expect(loadingElement).toBeInTheDocument();
  });

  test('displays disruption messages after loading', async () => {
    const mockData = [
      {
        stopPointName: 'Test Station',
        message: 'Test lift disruption message',
        naptanCode: '123',
        outageStartArea: 'A',
        outageEndArea: 'B'
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<App />);

    // Wait for the async data to load
    await waitFor(() => {
      expect(screen.getByText(/Test lift disruption message/i)).toBeInTheDocument();
    });
  });

  test('only displays first 3 disruptions in lift status widget', async () => {
    const mockData = [
      { stopPointName: 'Station 1', message: 'Message 1', naptanCode: '1', outageStartArea: 'A', outageEndArea: 'B' },
      { stopPointName: 'Station 2', message: 'Message 2', naptanCode: '2', outageStartArea: 'A', outageEndArea: 'B' },
      { stopPointName: 'Station 3', message: 'Message 3', naptanCode: '3', outageStartArea: 'A', outageEndArea: 'B' },
      { stopPointName: 'Station 4', message: 'Message 4', naptanCode: '4', outageStartArea: 'A', outageEndArea: 'B' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Message 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Message 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Message 3/i)).toBeInTheDocument();
      // Message 4 should NOT appear because of slice(0, 3)
      expect(screen.queryByText(/Message 4/i)).not.toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch data/i)).toBeInTheDocument();
    });
  });

  test('displays correct total disruptions count', async () => {
    const mockData = [
      { stopPointName: 'Station 1', message: 'Message 1', naptanCode: '123', outageStartArea: 'A', outageEndArea: 'B' },
      { stopPointName: 'Station 2', message: 'Message 2', naptanCode: '456', outageStartArea: 'C', outageEndArea: 'D' },
      { stopPointName: 'Station 1', message: 'Message 3', naptanCode: '789', outageStartArea: 'E', outageEndArea: 'F' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<App />);

    await waitFor(() => {
      const statsWidget = screen.getByText('Statistics').closest('div');
      // Should show 3 total disruptions
      expect(within(statsWidget).getByText('3')).toBeInTheDocument();
      expect(within(statsWidget).getByText('Total Disruptions')).toBeInTheDocument();
    });
  });

  test('displays correct unique stations count', async () => {
    const mockData = [
      { stopPointName: 'Station 1', message: 'Message 1', naptanCode: '123', outageStartArea: 'A', outageEndArea: 'B' },
      { stopPointName: 'Station 2', message: 'Message 2', naptanCode: '456', outageStartArea: 'C', outageEndArea: 'D' },
      { stopPointName: 'Station 1', message: 'Message 3', naptanCode: '789', outageStartArea: 'E', outageEndArea: 'F' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<App />);

    await waitFor(() => {
      const statsWidget = screen.getByText('Statistics').closest('div');
      // Should show 2 unique stations (Station 1 and Station 2)
      expect(within(statsWidget).getByText('2')).toBeInTheDocument();
      expect(within(statsWidget).getByText('Affected Stations')).toBeInTheDocument();
    });
  });

  test('displays "no disruptions" message when data is empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/No lift disruptions reported/i)).toBeInTheDocument();
    });
  });

  test('renders bar chart when data is available', async () => {
    const mockData = [
      { stopPointName: 'Station 1', message: 'Message 1', naptanCode: '123', outageStartArea: 'A', outageEndArea: 'B' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  test('displays "no data available" in chart when data is empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);

    await waitFor(() => {
      const chartWidget = screen.getByText('All Stations with Disruptions').closest('div');
      expect(within(chartWidget).getByText(/No data available/i)).toBeInTheDocument();
    });
  });
});