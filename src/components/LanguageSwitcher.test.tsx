import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n.mock';
import LanguageSwitcher from './LanguageSwitcher';

// Add necessary translations for accessibility
i18n.addResourceBundle('en', 'translation', {
  accessibility: {
    languageSelected: 'Selected language: {{language}}',
    selectLanguage: 'Select language',
  },
});

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </MemoryRouter>,
  );
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset i18n language before each test
    act(() => {
      i18n.changeLanguage('en');
    });
  });

  it('renders current language', () => {
    renderWithRouter(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });
    expect(button).toHaveTextContent('English');
  });

  it('displays language options when clicked', async () => {
    renderWithRouter(<LanguageSwitcher />);

    // Open the menu
    await act(async () => {
      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);
    });

    // Wait for the menu to appear
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const spanishOption = screen.getByRole('option', { name: /español/i });
    expect(spanishOption).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    // Test Enter key
    fireEvent.keyDown(button, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Test Escape key - this is where we need to change
    const listbox = screen.getByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('handles touch events correctly', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const switcher = screen.getByTestId('language-switcher');

    // Simulate touch start
    await act(async () => {
      fireEvent.touchStart(switcher, {
        touches: [{ clientX: 0, clientY: 0 }],
      });
    });

    // Simulate touch move
    await act(async () => {
      fireEvent.touchMove(switcher, {
        touches: [{ clientX: 100, clientY: 0 }],
      });
    });

    // Simulate touch end
    await act(async () => {
      fireEvent.touchEnd(switcher);
    });

    // The menu should be open after a right swipe
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('maintains ARIA states correctly', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    // Test initial state
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Test opened state
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toHaveAttribute(
      'aria-label',
      'Select language',
    );

    // Test option states
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true'); // English is selected by default
  });

  it('applies popup direction class correctly', () => {
    renderWithRouter(<LanguageSwitcher popupDirection="up" />);
    const switcher = screen.getByTestId('language-switcher');
    expect(switcher).toHaveClass('popup-up');
  });

  it('applies custom className when provided', () => {
    renderWithRouter(<LanguageSwitcher className="custom-class" />);
    const switcher = screen.getByTestId('language-switcher');
    expect(switcher).toHaveClass('custom-class');
  });
});
