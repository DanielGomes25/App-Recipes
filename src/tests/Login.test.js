import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../services/renderWithRouter';
import Login from '../pages/Login';
import Provider from '../context/Provider';

// Suíte da tela de login.
describe('Teste a tela de Login:', () => {
  // Valida renderização dos campos, habilitação do botão e redirecionamento.
  test('Verifica se os inputs de email, password e o botão de Login são renderizados, se o botão é habilitado, e se é redirecionado para a pagina de receitas', () => {
    const { history } = renderWithRouter(
      <Provider>
        <Login />
      </Provider>,
    );

    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const button = screen.getByTestId('login-submit-btn');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    userEvent.type(email, 'alguem@alguem.com');
    userEvent.type(password, '12345678');

    expect(button).toBeEnabled();

    userEvent.click(button);

    expect(history.location.pathname).toBe('/meals');
  });

  // Cenário reservado para validar leitura do email salvo.
  test('Verifica se o email é recuperado na localStorage e renderizado na tela;', () => {
    renderWithRouter(
      <Provider>
        <Login />
      </Provider>,
    );
  });
});
