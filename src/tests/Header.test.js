import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Provider from '../context/Provider';
import renderWithRouter from '../services/renderWithRouter';
import Header from '../components/Header';

// Valida renderização do Header e o toggle do campo de busca.
test('Farewell, front-end', () => {
  // Este arquivo pode ser modificado ou deletado sem problemas
  renderWithRouter(
    <Provider>
      <Header />
    </Provider>,
  );

  const imgProfile = screen.getByRole('img', {
    name: /profile icon/i,
  });

  const title = screen.getByRole('heading', {
    name: /title/i,
  });

  const imgSearch = screen.getByRole('img', {
    name: /search icon/i,
  });

  const buttonSearch = screen.getByRole('button', {
    name: /search icon/i,
  });

  act(() => {
    userEvent.click(buttonSearch);
  });

  const textSearch = screen.getByRole('textbox');

  expect(textSearch).toBeInTheDocument();
  expect(buttonSearch).toBeInTheDocument();
  expect(imgSearch).toBeInTheDocument();
  expect(title).toBeInTheDocument();
  expect(imgProfile).toBeInTheDocument();

  userEvent.type(textSearch, 'chicken');

  expect(textSearch.value).toBe('chicken');

  act(() => {
    userEvent.click(buttonSearch);
  });

  expect(textSearch).not.toBeInTheDocument();
});
