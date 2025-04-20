import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import History from '../src/app/history/page';

// Import the setup file
import './setup';

describe('History Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('renders the history page with mock data', async () => {
    // Mock data for the history
    const mockHistoryData = {
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
      ],
      total: 2
    };
    
    // Mock the fetch response
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(mockHistoryData)
    });
    
    // Render the component
    const { container } = render(await History());
    
    // Check if the data table is rendered
    const table = container.querySelector('table');
    expect(table).toBeDefined();
    
    // Check for table row
    const rows = container.querySelectorAll('tr');
    expect(rows.length).toBeGreaterThan(0);
  });
}); 