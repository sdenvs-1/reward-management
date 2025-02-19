import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AddSession from './AddSession';

global.fetch = jest.fn();


describe('AddSession Component', () => {
  const mockOnSessionAdded = jest.fn();
  const users = [
    { id: '1', name: 'User 1' },
    { id: '2', name: 'User 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with initial state', () => {
    render(<AddSession users={users} onSessionAdded={mockOnSessionAdded} />);

    expect(screen.getByDisplayValue('User 1')).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    const mockUserResponse = {
      id: '1',
      name: 'User 1',
      sessions: [],
    };

    const mockPutResponse = {
      ok: true,
    };

    fetch.mockResolvedValueOnce({ ok: true, json: () => mockUserResponse });
    fetch.mockResolvedValueOnce(mockPutResponse);

    render(<AddSession users={users} onSessionAdded={mockOnSessionAdded} />);

    fireEvent.change(screen.getByLabelText(/select user/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-02-18' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '60' } });

    fireEvent.click(screen.getByText(/add session/i));

    await waitFor(() => expect(mockOnSessionAdded).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledTimes(2);
  });


  it('shows an alert if fields are empty when submitting', async () => {
    window.alert = jest.fn();

    render(<AddSession users={users} onSessionAdded={mockOnSessionAdded} />);

    fireEvent.click(screen.getByText(/add session/i));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.'));
  });

  it('calls onSessionAdded prop when session is added successfully', async () => {
    const mockUserResponse = {
      id: '1',
      name: 'User 1',
      sessions: [],
    };

    fetch.mockResolvedValueOnce({ ok: true, json: () => mockUserResponse });
    fetch.mockResolvedValueOnce({ ok: true });

    render(<AddSession users={users} onSessionAdded={mockOnSessionAdded} />);

    fireEvent.change(screen.getByLabelText(/select user/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2025-02-18' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '60' } });

    fireEvent.click(screen.getByText(/add session/i));

    await waitFor(() => expect(mockOnSessionAdded).toHaveBeenCalled());
  });

})