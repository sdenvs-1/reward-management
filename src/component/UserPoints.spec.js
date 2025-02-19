import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserPoints from './UserPoints';

jest.mock('./AddSession', () => () => <div>AddSession Component</div>);

const mockUsers = [
  {
    id: '1',
    name: 'User 1',
    sessions: [
      { date: '2025-02-15', amount: 120 }, 
      { date: '2025-01-10', amount: 50 }
    ],
  },
  {
    id: '2',
    name: 'User 2',
    sessions: [{ date: '2025-01-20', amount: 100 }], 
  },
];

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('displays loading state initially', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUsers,
  });

  render(<UserPoints />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});

test('renders users and points after fetching data', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUsers,
  });

  render(<UserPoints />);

  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

  expect(screen.getByText('User 1')).toBeInTheDocument();
  expect(screen.getByText('User 2')).toBeInTheDocument();

  expect(screen.getByText('Total Points: 90')).toBeInTheDocument(); 
  expect(screen.getByText('Total Points: 50')).toBeInTheDocument(); 

  expect(screen.getByText('February: 90 points')).toBeInTheDocument();
  expect(screen.getByText('January: 50 points')).toBeInTheDocument();
});

test('renders AddSession component', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUsers,
  });

  render(<UserPoints />);

  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

  expect(screen.getByText('AddSession Component')).toBeInTheDocument();
});
