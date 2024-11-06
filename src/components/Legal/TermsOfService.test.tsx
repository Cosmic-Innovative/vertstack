import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TermsOfService from './TermsOfService';
import { render, expectTranslated } from '../../test-utils';

describe('TermsOfService', () => {
  it('renders terms of service content', async () => {
    await render(<TermsOfService />, { route: '/en/terms' });

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('legal:termsOfService.title', 'en'),
      );
    });

    // Verify key sections are present
    await waitFor(async () => {
      expect(
        screen.getByText(
          await expectTranslated('legal:termsOfService.overview.title', 'en'),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          await expectTranslated('legal:termsOfService.usage.title', 'en'),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          await expectTranslated(
            'legal:termsOfService.limitations.title',
            'en',
          ),
        ),
      ).toBeInTheDocument();
    });
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<TermsOfService />, {
      route: '/en/terms',
    });

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('legal:termsOfService.title', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('legal:termsOfService.title', 'es'),
      );
    });
  });
});
