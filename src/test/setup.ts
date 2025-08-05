import '@testing-library/jest-dom'
import React from 'react'

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Moon: () => React.createElement('div', { 'data-testid': 'moon-icon' }),
  Sun: () => React.createElement('div', { 'data-testid': 'sun-icon' }),
  Star: () => React.createElement('div', { 'data-testid': 'star-icon' }),
  Save: () => React.createElement('div', { 'data-testid': 'save-icon' }),
  Calendar: () => React.createElement('div', { 'data-testid': 'calendar-icon' }),
}))