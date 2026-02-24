import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../services/renderWithRouter';
import Provider from '../context/Provider';
import Profile from '../pages/Profile';

// Suíte da página de perfil.
describe('Testa a tela de Perfil:', () => {
  const login = { email: 'julia@gmail.com' };

  // Valida email renderizado e redirecionamento para Done Recipes.
  test('Verifica se o email e o botão são renderizados na tela e se é redirecionado pra rota "/done-recipes" quando o botão "Done Recipes" é clicado;', () => {
    const { history } = renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );

    localStorage.setItem('user', JSON.stringify(login));

    const email = screen.getByTestId('profile-email');
    expect(email).toBeInTheDocument();

    const doneButton = screen.getByTestId('profile-done-btn');
    expect(doneButton).toBeInTheDocument();

    userEvent.click(doneButton);

    expect(history.location.pathname).toBe('/done-recipes');
  });

  // Valida redirecionamento para a tela de favoritas.
  test('Verifica se o botão "Favorite Recipes" é renderizado e se ao ser clicado ele redireciona para a página "/favorite-recipes";', () => {
    const { history } = renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );

    localStorage.setItem('user', JSON.stringify(login));

    const favoriteButton = screen.getByTestId('profile-favorite-btn');
    expect(favoriteButton).toBeInTheDocument();

    userEvent.click(favoriteButton);

    expect(history.location.pathname).toBe('/favorite-recipes');
  });

  // Valida logout com limpeza de sessão e retorno ao login.
  test('Verifica se o botão "Logout" é renderizado e se ao ser clicado ele redireciona para a página "/', () => {
    const { history } = renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );

    localStorage.setItem('user', JSON.stringify(login));

    const logoutButton = screen.getByTestId('profile-logout-btn');
    expect(logoutButton).toBeInTheDocument();

    userEvent.click(logoutButton);

    expect(history.location.pathname).toBe('/');
  });

  // Garante que o objeto de usuário é persistido e recuperado do storage.
  test('Verifica se o email é recuperado do localStorage e exibido na tela;', () => {
    renderWithRouter(
      <Provider>
        <Profile />
      </Provider>,
    );

    localStorage.setItem('user', JSON.stringify(login));

    const email = JSON.parse(localStorage.getItem('user'));

    expect(email).toEqual({ email: 'julia@gmail.com' });
  });
});
