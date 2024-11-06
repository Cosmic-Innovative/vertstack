import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrivacyPolicy from './PrivacyPolicy';
import { render, expectTranslated } from '../../test-utils';

describe('PrivacyPolicy', () => {
  it('renders privacy policy content', async () => {
    await render(<PrivacyPolicy />, { route: '/en/privacy' });

    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('legal:privacyPolicy.title', 'en'),
      );
    });

    // Verify key sections are present
    await waitFor(async () => {
      expect(
        screen.getByText(
          await expectTranslated(
            'legal:privacyPolicy.dataCollection.title',
            'en',
          ),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          await expectTranslated('legal:privacyPolicy.storage.title', 'en'),
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          await expectTranslated('legal:privacyPolicy.security.title', 'en'),
        ),
      ).toBeInTheDocument();
    });
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<PrivacyPolicy />, {
      route: '/en/privacy',
    });

    // Check English content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('legal:privacyPolicy.title', 'en'),
      );
    });

    // Switch to Spanish
    await changeLanguage('es');

    // Check Spanish content
    await waitFor(async () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        await expectTranslated('legal:privacyPolicy.title', 'es'),
      );
    });
  });
});
