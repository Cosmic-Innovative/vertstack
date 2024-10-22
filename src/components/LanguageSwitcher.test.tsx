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

    await act(async () => {
      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);
    });

    const spanishOption = screen.getByRole('option', { name: /español/i });
    expect(spanishOption).toBeInTheDocument();
  });

  it('changes language when a different language is selected', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const initialLanguage = i18n.language;

    // Open the menu
    await act(async () => {
      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);
    });

    // Select Spanish
    await act(async () => {
      const spanishOption = screen.getByRole('option', { name: /español/i });
      fireEvent.click(spanishOption);
    });

    // Wait for language change to complete
    await waitFor(() => {
      expect(i18n.language).toBe('es');
    });

    expect(i18n.language).not.toBe(initialLanguage);
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

  it('supports keyboard navigation', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    // Open menu with Enter key
    await act(async () => {
      fireEvent.keyDown(button, { key: 'Enter' });
    });

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Close menu with Escape key
    await act(async () => {
      fireEvent.keyDown(button, { key: 'Escape' });
    });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes menu when clicking outside', async () => {
    renderWithRouter(<LanguageSwitcher />);

    // Open the menu
    await act(async () => {
      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);
    });

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Click outside
    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('maintains aria-expanded state', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /select language/i });

    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Open menu
    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Close menu
    await act(async () => {
      fireEvent.click(button);
    });

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
