import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import i18n from './i18n.mock';

function render(
  ui: React.ReactElement,
  { route = '/en', ...renderOptions } = {},
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </I18nextProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };
