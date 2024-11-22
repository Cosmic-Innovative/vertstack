import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';
import { render, expectTranslated } from '../test-utils';

// Mock LanguageSwitcher component
vi.mock('./LanguageSwitcher', () => ({
  default: ({
    popupDirection,
    'aria-label': ariaLabel,
  }: {
    popupDirection: string;
    'aria-label': string;
  }) => (
    <div
      data-testid="language-switcher"
      data-direction={popupDirection}
      aria-label={ariaLabel}
    >
      Language Switcher Mock
    </div>
  ),
}));

describe('Footer', () => {
  it('renders with proper document structure', async () => {
    await render(<Footer />, { route: '/en' });

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute(
      'aria-label',
      await expectTranslated('footer.ariaLabel', 'en'),
    );
  });

  it('renders all main sections in correct order', async () => {
    await render(<Footer />, { route: '/en' });

    const footerContent = screen
      .getByRole('contentinfo')
      .querySelector('.footer-content');
    const children = footerContent?.children;

    expect(children?.[0]).toHaveClass('footer-language-selector');
    expect(children?.[1]).toHaveClass('footer-links');
    expect(children?.[2]).toHaveClass('footer-attribution');
  });

  it('renders navigation links with correct language prefix', async () => {
    await render(<Footer />, { route: '/en' });

    const privacy = screen.getByRole('link', {
      name: await expectTranslated('footer.privacy', 'en'),
    });
    const terms = screen.getByRole('link', {
      name: await expectTranslated('footer.terms', 'en'),
    });

    expect(privacy).toHaveAttribute('href', '/en/privacy');
    expect(terms).toHaveAttribute('href', '/en/terms');
  });

  it('renders language switcher with correct props', async () => {
    await render(<Footer />, { route: '/en' });

    const languageSwitcher = screen.getByTestId('language-switcher');
    expect(languageSwitcher).toHaveAttribute('data-direction', 'up');
    expect(languageSwitcher).toHaveAttribute(
      'aria-label',
      await expectTranslated('footer.languageSelectorLabel', 'en'),
    );
  });

  it('renders attribution with current year', async () => {
    await render(<Footer />, { route: '/en' });

    const currentYear = new Date().getFullYear().toString();
    const copyright = screen.getByText((content) =>
      content.includes(currentYear),
    );
    expect(copyright).toHaveTextContent(`© ${currentYear}`);
  });

  it('renders cosmic innovative link with proper attributes', async () => {
    await render(<Footer />, { route: '/en' });

    const link = screen.getByRole('link', {
      name: await expectTranslated('footer.companyLinkLabel', 'en'),
    });

    expect(link).toHaveAttribute('href', 'https://cosmicinnovative.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders in Spanish when specified', async () => {
    await render(<Footer />, { route: '/es' });

    const privacy = screen.getByRole('link', {
      name: await expectTranslated('footer.privacy', 'es'),
    });
    expect(privacy).toBeInTheDocument();
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<Footer />, { route: '/en' });

    const privacyEn = await expectTranslated('footer.privacy', 'en');
    expect(screen.getByRole('link', { name: privacyEn })).toBeInTheDocument();

    await changeLanguage('es');

    const privacyEs = await expectTranslated('footer.privacy', 'es');
    expect(screen.getByRole('link', { name: privacyEs })).toBeInTheDocument();
  });

  // Test layout structure
  it('has correct desktop layout structure', async () => {
    await render(<Footer />, { route: '/en' });

    const footer = screen.getByRole('contentinfo');
    const footerContent = footer.querySelector('.footer-content');

    // Check that all required classes are present
    expect(footerContent).toHaveClass(
      'footer-content',
      // Add any additional classes that contribute to the layout
    );

    // Verify the structure
    const children = footerContent?.children;
    expect(children).toHaveLength(3); // Language switcher, links, and attribution

    // Check that sections are in the correct order with correct classes
    expect(children?.[0]).toHaveClass('footer-language-selector');
    expect(children?.[1]).toHaveClass('footer-links');
    expect(children?.[2]).toHaveClass('footer-attribution');
  });

  it('preserves semantic structure on mobile', async () => {
    await render(<Footer />, { route: '/en' });

    // Check that key elements maintain proper order and classes
    const footer = screen.getByRole('contentinfo');
    const footerContainer = footer.querySelector('.footer-container');
    const footerContent = footer.querySelector('.footer-content');

    // Verify container structure
    expect(footerContainer).toBeInTheDocument();
    expect(footerContent).toBeInTheDocument();

    // Verify each section exists with correct classes and order
    const languageSwitcher = screen.getByTestId('language-switcher');
    const navigation = screen.getByRole('navigation', {
      name: /footer navigation/i,
    });
    const attribution = screen.getByText(/cosmic innovative/i);

    expect(footer).toContainElement(languageSwitcher);
    expect(footer).toContainElement(navigation);
    expect(footer).toContainElement(attribution);

    // Verify navigation links container
    expect(navigation).toHaveClass('footer-links');

    // Verify links are present
    const links = navigation.querySelectorAll('a');
    expect(links).toHaveLength(2); // Privacy, Terms
    expect(links[0]).toHaveClass('footer-link');
  });
});
