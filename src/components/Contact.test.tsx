import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Contact from './Contact';
import { render, expectTranslated } from '../test-utils';

describe('Contact', () => {
  it('renders with proper document structure', async () => {
    await render(<Contact />, { route: '/en/contact' });

    // Check main landmark
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('aria-labelledby', 'contact-title');

    // Check content section styling
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toBeInTheDocument();
    expect(contentSection).toHaveClass('content-section');
  });

  it('renders correct content in English', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const title = await expectTranslated('contact.title', 'en');
    const description = await expectTranslated('contact.description', 'en');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders contact information with proper structure', async () => {
    await render(<Contact />, { route: '/en/contact' });

    // Check contact info section
    const contactInfoTitle = await expectTranslated('contact.info.title', 'en');
    expect(
      screen.getByRole('heading', { name: contactInfoTitle }),
    ).toBeInTheDocument();

    // Check contact list items
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('contact-list');

    // Check email link
    const emailLabel = await expectTranslated('contact.info.emailLabel', 'en');
    const emailLink = screen.getByRole('link', { name: emailLabel });
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@example.com');

    // Check phone link
    const phoneLabel = await expectTranslated('contact.info.phoneLabel', 'en');
    const phoneLink = screen.getByRole('link', { name: phoneLabel });
    expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');

    // Check address
    const addressLabel = await expectTranslated('contact.info.address', 'en');
    const address = screen.getByText(addressLabel, { exact: false });
    expect(address).toBeInTheDocument();
  });

  it('renders business hours with proper structure', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const hoursTitle = await expectTranslated('contact.hours.title', 'en');
    expect(
      screen.getByRole('heading', { name: hoursTitle }),
    ).toBeInTheDocument();

    // Check weekday hours using partial text match
    const weekdays = await expectTranslated('contact.hours.weekdays', 'en');
    const weekdayElement = screen.getByText((content) =>
      content.includes(weekdays),
    );
    expect(weekdayElement).toBeInTheDocument();

    // Check weekend hours using partial text match
    const weekends = await expectTranslated('contact.hours.weekends', 'en');
    const weekendElement = screen.getByText((content) =>
      content.includes(weekends),
    );
    expect(weekendElement).toBeInTheDocument();

    // Check hours are displayed
    expect(screen.getByText('9:00 AM - 5:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders in Spanish when specified', async () => {
    await render(<Contact />, { route: '/es/contact' });

    const title = await expectTranslated('contact.title', 'es');
    const description = await expectTranslated('contact.description', 'es');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Contact />, {
      route: '/en/contact',
    });

    // Check English content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('contact.title', 'en'),
    );

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      await expectTranslated('contact.title', 'es'),
    );
  });

  it('maintains proper heading hierarchy', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const headings = screen.getAllByRole('heading');
    expect(headings[0].tagName).toBe('H1');
    expect(headings[1].tagName).toBe('H2');
    expect(headings[2].tagName).toBe('H2');
  });

  it('provides accessible links', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const emailLabel = await expectTranslated('contact.info.emailLabel', 'en');
    const phoneLabel = await expectTranslated('contact.info.phoneLabel', 'en');

    const emailLink = screen.getByRole('link', { name: emailLabel });
    const phoneLink = screen.getByRole('link', { name: phoneLabel });

    expect(emailLink).toHaveAttribute('href', 'mailto:contact@example.com');
    expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');
  });

  it('preserves visual styling and layout', async () => {
    await render(<Contact />, { route: '/en/contact' });

    // Check container classes
    const contentSection = screen
      .getByRole('main')
      .querySelector('.content-section');
    expect(contentSection).toHaveClass('content-section');

    const contentWrapper = contentSection?.querySelector('.content-wrapper');
    expect(contentWrapper).toHaveClass('content-wrapper');

    // Check section spacing using aria-labelledby
    const contactInfoTitle = await expectTranslated('contact.info.title', 'en');
    const contactInfoSection = screen.getByRole('region', {
      name: contactInfoTitle,
    });
    expect(contactInfoSection).toHaveClass('mt-8');

    // Check hours list spacing
    const hoursList = screen.getByRole('list', { name: '' });
    expect(hoursList).toHaveClass('space-y-4');
  });
});
