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

  it('renders community links with proper attributes', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const telegramLink = screen.getByRole('link', { name: /telegram/i });
    const whatsappLink = screen.getByRole('link', { name: /whatsapp/i });

    expect(telegramLink).toHaveAttribute('href', 'https://t.me/vertstack');
    expect(telegramLink).toHaveAttribute('target', '_blank');
    expect(telegramLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/vertstack');
    expect(whatsappLink).toHaveAttribute('target', '_blank');
    expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders official contacts with proper links', async () => {
    await render(<Contact />, { route: '/en/contact' });

    const emailLink = screen.getByRole('link', {
      name: 'contact@vertstack.dev',
    });
    const githubLink = screen.getByRole('link', {
      name: 'github.com/vertstack',
    });

    expect(emailLink).toHaveAttribute('href', 'mailto:contact@vertstack.dev');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vertstack');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
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
    expect(headings[0].tagName).toBe('H1'); // Main title
    expect(headings[1].tagName).toBe('H2'); // Community section
    expect(headings[2].tagName).toBe('H2'); // Official contacts section
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
    expect(contentWrapper).toHaveClass('max-w-2xl');
    expect(contentWrapper).toHaveClass('mx-auto');

    // Check heading container
    const titleContainer = screen.getByRole('heading', {
      level: 1,
    }).parentElement;
    expect(titleContainer).toHaveClass('text-center', 'mb-12');

    // Check community links container
    const communitySection = screen.getByRole('heading', {
      name: await expectTranslated('contact.community.title', 'en'),
    }).parentElement;
    expect(communitySection).toHaveClass('mb-12');
  });
});
