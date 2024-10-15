import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  it('renders language dropdown', () => {
    renderWithRouter(<LanguageSwitcher />);
    expect(
      screen.getByRole('button', { name: /English|Español/i }),
    ).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    renderWithRouter(<LanguageSwitcher />);
    const toggleButton = screen.getByRole('button', {
      name: /English|Español/i,
    });
    fireEvent.click(toggleButton);
    expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
  });

  it('changes language when option is clicked', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const initialLanguage = i18n.language;
    const toggleButton = screen.getByRole('button', {
      name: /English|Español/i,
    });
    fireEvent.click(toggleButton);
    const otherLanguageOption = screen.getByRole('button', {
      name: initialLanguage === 'en' ? /Español/i : /English/i,
    });
    fireEvent.click(otherLanguageOption);
    await waitFor(() => {
      expect(i18n.language).toBe(initialLanguage === 'en' ? 'es' : 'en');
    });
  });

  it('closes dropdown after language change', async () => {
    renderWithRouter(<LanguageSwitcher />);
    const initialLanguage = i18n.language;
    const toggleButton = screen.getByRole('button', {
      name: /English|Español/i,
    });
    fireEvent.click(toggleButton);
    const otherLanguageOption = screen.getByRole('button', {
      name: initialLanguage === 'en' ? /Español/i : /English/i,
    });
    fireEvent.click(otherLanguageOption);
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBe(1);
    });
  });
});
