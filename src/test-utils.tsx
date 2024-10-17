import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import i18n from './i18n.mock';

interface CustomRenderOptions extends RenderOptions {
  route?: string;
}

function render(
  ui: React.ReactElement,
  { route = '/en', ...renderOptions }: CustomRenderOptions = {},
) {
  const lang = route.split('/')[1];
  i18n.changeLanguage(lang);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/:lang/*" element={children} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>
  );

  const result = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...result,
    changeLanguage: (newLang: string) => {
      return i18n.changeLanguage(newLang);
    },
  };
}

function expectTranslated(key: string, language: string): string {
  return i18n.getFixedT(language)(key);
}

export * from '@testing-library/react';
export { render, expectTranslated };
