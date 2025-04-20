import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Forecast from '../src/app/forecast/page';

// Import the setup file
import './setup';

// Mock the fetch function
vi.stubGlobal('fetch', vi.fn());

describe('Forecast Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('renders the forecast page with mock data', async () => {
    // Mock data for the forecast
    const mockForecastData = {
      list: [
        {
          dt: 1619712000, // 2021-04-29 12:00:00
          temp: 293.15,   // 20°C
          pressure: 1013,
          humidity: 70,
          clouds: 20
        },
        {
          dt: 1619798400, // 2021-04-30 12:00:00
          temp: 294.15,   // 21°C
          pressure: 1012,
          humidity: 75,
          clouds: 30
        }
      ]
    };
    
    // Mock the fetch response
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockForecastData)
    });
    
    // Render the component
    const { container } = render(await Forecast());
    
    const table = container.querySelector('table');
    expect(table).toBeDefined();

    // Check for table row
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBeGreaterThan(0);
  });
}); 