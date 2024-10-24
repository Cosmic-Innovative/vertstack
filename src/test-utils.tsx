import React from 'react';
import {
  render as rtlRender,
  RenderOptions,
  act,
  cleanup,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import i18n from './i18n.mock';

// Configure the testing environment
beforeAll(() => {
  // Enable React 18's concurrent features in tests
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

interface CustomRenderOptions extends RenderOptions {
  route?: string;
}

export const expectTranslated = async (
  key: string,
  lang: string,
): Promise<string> => {
  await i18n.changeLanguage(lang);
  return i18n.t(key);
};

async function render(
  ui: React.ReactElement,
  { route = '/en', ...renderOptions }: CustomRenderOptions = {},
) {
  const lang = route.split('/')[1];
  await i18n.changeLanguage(lang);

  const renderResult = rtlRender(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/:lang/*" element={ui} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
    renderOptions,
  );

  return {
    ...renderResult,
    i18n,
    changeLanguage: async (newLang: string) => {
      await i18n.changeLanguage(newLang);
      renderResult.rerender(
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[`/${newLang}`]}>
            <Routes>
              <Route path="/:lang/*" element={ui} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>,
      );
    },
  };
}

// Helper to wrap async operations in act
export const actWithReturn = async <T,>(
  callback: () => Promise<T> | T,
): Promise<T> => {
  let result: T;
  await act(async () => {
    result = await callback();
  });
  return result!;
};

// Setup for all tests
beforeEach(() => {
  cleanup();
});

export * from '@testing-library/react';
export { render, cleanup };
