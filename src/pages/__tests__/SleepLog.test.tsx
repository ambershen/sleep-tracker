import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import SleepLog from '../SleepLog'
import { useSleepStore } from '@/store/sleepStore'

// Mock the sleep store
vi.mock('@/store/sleepStore')

const mockAddEntry = vi.fn()
const mockEntries = []

const mockUseSleepStore = {
  addEntry: mockAddEntry,
  entries: mockEntries,
}

describe('SleepLog Component', () => {
  beforeEach(() => {
    vi.mocked(useSleepStore).mockReturnValue(mockUseSleepStore)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the sleep log form with all required fields', () => {
    render(<SleepLog />)
    
    expect(screen.getByText('Log Sleep Entry')).toBeInTheDocument()
    expect(screen.getByText('Record your sleep data to track patterns and improve your rest')).toBeInTheDocument()
    
    // Check form fields
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/bedtime/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/wake time/i)).toBeInTheDocument()
    expect(screen.getByText(/sleep quality/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
    
    // Check submit button
    expect(screen.getByRole('button', { name: /save sleep entry/i })).toBeInTheDocument()
  })

  it('initializes form with default values', () => {
    render(<SleepLog />)
    
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement
    const bedtimeInput = screen.getByLabelText(/bedtime/i) as HTMLInputElement
    const wakeTimeInput = screen.getByLabelText(/wake time/i) as HTMLInputElement
    const notesInput = screen.getByLabelText(/notes/i) as HTMLTextAreaElement
    
    // Date should be today's date
    const today = new Date().toISOString().split('T')[0]
    expect(dateInput.value).toBe(today)
    
    // Other fields should be empty
    expect(bedtimeInput.value).toBe('')
    expect(wakeTimeInput.value).toBe('')
    expect(notesInput.value).toBe('')
    
    // Quality should default to 5
    expect(screen.getByText('5/10')).toBeInTheDocument()
    expect(screen.getByText('Fair')).toBeInTheDocument()
  })

  it('updates form fields when user inputs data', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    const dateInput = screen.getByLabelText(/date/i)
    const bedtimeInput = screen.getByLabelText(/bedtime/i)
    const wakeTimeInput = screen.getByLabelText(/wake time/i)
    const notesInput = screen.getByLabelText(/notes/i)
    
    await user.clear(dateInput)
    await user.type(dateInput, '2024-01-15')
    await user.type(bedtimeInput, '22:30')
    await user.type(wakeTimeInput, '07:00')
    await user.type(notesInput, 'Slept well after exercise')
    
    expect(dateInput).toHaveValue('2024-01-15')
    expect(bedtimeInput).toHaveValue('22:30')
    expect(wakeTimeInput).toHaveValue('07:00')
    expect(notesInput).toHaveValue('Slept well after exercise')
  })

  it('updates sleep quality using the slider', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    const slider = screen.getByRole('slider')
    
    // Change quality to 8
    fireEvent.change(slider, { target: { value: '8' } })
    
    expect(screen.getByText('8/10')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
  })

  it('updates sleep quality using star rating', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    const stars = screen.getAllByTestId('star-icon')
    
    // Click on the 7th star (index 6) - but stars are in the rating section
    const starButtons = stars.slice(-10) // Get the last 10 stars which are the rating buttons
    await user.click(starButtons[6])
    
    expect(screen.getByText('7/10')).toBeInTheDocument()
    expect(screen.getByText('Good')).toBeInTheDocument()
  })

  it('displays correct quality labels for different ratings', () => {
    render(<SleepLog />)
    
    const slider = screen.getByRole('slider')
    
    // Test different quality levels
    fireEvent.change(slider, { target: { value: '10' } })
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    
    fireEvent.change(slider, { target: { value: '7' } })
    expect(screen.getByText('Good')).toBeInTheDocument()
    
    fireEvent.change(slider, { target: { value: '5' } })
    expect(screen.getByText('Fair')).toBeInTheDocument()
    
    fireEvent.change(slider, { target: { value: '3' } })
    expect(screen.getByText('Poor')).toBeInTheDocument()
    
    fireEvent.change(slider, { target: { value: '1' } })
    expect(screen.getByText('Very Poor')).toBeInTheDocument()
  })

  it('shows character count for notes field', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    const notesInput = screen.getByLabelText(/notes/i)
    
    expect(screen.getByText('0/500 characters')).toBeInTheDocument()
    
    await user.type(notesInput, 'Test note')
    expect(screen.getByText('9/500 characters')).toBeInTheDocument()
  })

  it('successfully submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    // Fill in required fields
    await user.type(screen.getByLabelText(/bedtime/i), '22:30')
    await user.type(screen.getByLabelText(/wake time/i), '07:00')
    await user.type(screen.getByLabelText(/notes/i), 'Good sleep')
    
    // Change quality
    fireEvent.change(screen.getByRole('slider'), { target: { value: '8' } })
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify addEntry was called with correct data
    expect(mockAddEntry).toHaveBeenCalledWith({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:30',
      wakeTime: '07:00',
      quality: 8,
      notes: 'Good sleep'
    })
    
    // Verify success toast
    expect(toast.success).toHaveBeenCalledWith('Sleep entry saved successfully!')
  })

  it('shows error when bedtime is missing', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    // Only fill wake time
    await user.type(screen.getByLabelText(/wake time/i), '07:00')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify addEntry was not called
    expect(mockAddEntry).not.toHaveBeenCalled()
  })

  it('shows error when wake time is missing', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    // Only fill bedtime
    await user.type(screen.getByLabelText(/bedtime/i), '22:30')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify addEntry was not called
    expect(mockAddEntry).not.toHaveBeenCalled()
  })

  it('shows error when entry for date already exists', async () => {
    const user = userEvent.setup()
    const today = new Date().toISOString().split('T')[0]
    
    // Mock existing entry for today
    const mockEntriesWithToday = [{ date: today, id: '1' }]
    vi.mocked(useSleepStore).mockReturnValue({
      ...mockUseSleepStore,
      entries: mockEntriesWithToday
    })
    
    render(<SleepLog />)
    
    // Fill in required fields
    await user.type(screen.getByLabelText(/bedtime/i), '22:30')
    await user.type(screen.getByLabelText(/wake time/i), '07:00')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify error toast
    expect(toast.error).toHaveBeenCalledWith('Sleep entry for this date already exists')
    expect(mockAddEntry).not.toHaveBeenCalled()
  })

  it('handles form submission error gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock addEntry to throw an error
    mockAddEntry.mockImplementation(() => {
      throw new Error('Database error')
    })
    
    render(<SleepLog />)
    
    // Fill in required fields
    await user.type(screen.getByLabelText(/bedtime/i), '22:30')
    await user.type(screen.getByLabelText(/wake time/i), '07:00')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify error toast
    expect(toast.error).toHaveBeenCalledWith('Failed to save sleep entry')
  })

  it('calls addEntry with correct data on successful submission', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    const bedtimeInput = screen.getByLabelText(/bedtime/i) as HTMLInputElement
    const wakeTimeInput = screen.getByLabelText(/wake time/i) as HTMLInputElement
    const notesInput = screen.getByLabelText(/notes/i) as HTMLTextAreaElement
    
    // Fill in form
    await user.type(bedtimeInput, '22:30')
    await user.type(wakeTimeInput, '07:00')
    await user.type(notesInput, 'Test notes')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify addEntry was called with correct data
    expect(mockAddEntry).toHaveBeenCalledWith({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:30',
      wakeTime: '07:00',
      quality: 5,
      notes: 'Test notes'
    })
  })

  it('submits form without notes when notes are empty', async () => {
    const user = userEvent.setup()
    render(<SleepLog />)
    
    // Fill in only required fields
    await user.type(screen.getByLabelText(/bedtime/i), '22:30')
    await user.type(screen.getByLabelText(/wake time/i), '07:00')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save sleep entry/i }))
    
    // Verify addEntry was called with undefined notes
    expect(mockAddEntry).toHaveBeenCalledWith({
      date: new Date().toISOString().split('T')[0],
      bedtime: '22:30',
      wakeTime: '07:00',
      quality: 5,
      notes: undefined
    })
  })

  it('displays quick tips section', () => {
    render(<SleepLog />)
    
    expect(screen.getByText('💡 Quick Tips')).toBeInTheDocument()
    expect(screen.getByText(/Log your sleep as soon as you wake up/)).toBeInTheDocument()
    expect(screen.getByText(/Consider factors like stress, caffeine/)).toBeInTheDocument()
    expect(screen.getByText(/Aim for consistency in your sleep schedule/)).toBeInTheDocument()
    expect(screen.getByText(/Quality is just as important as quantity/)).toBeInTheDocument()
  })

  it('renders all icons correctly', () => {
    render(<SleepLog />)
    
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    expect(screen.getAllByTestId('star-icon')).toHaveLength(11) // 10 star rating buttons + 1 in slider
    expect(screen.getByTestId('save-icon')).toBeInTheDocument()
  })
})