import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../services/renderWithRouter';
import Provider from '../context/Provider';
import Footer from '../components/Footer';

// Suíte de navegação pelos botões do Footer.
describe('Teste o componente Footer;', () => {
  // Garante que o botão de drinks está visível e redireciona corretamente.
  test('Verifica se o botão de Drink esta sendo renderizado na tela e se, ao clicar, ele redireciona para a página de Drinks;', () => {
    const { history } = renderWithRouter(
      <Provider>
        <Footer />
      </Provider>,
    );

    const drinkButton = screen.getByTestId('drinks-bottom-btn');
    expect(drinkButton).toBeInTheDocument();

    userEvent.click(drinkButton);

    expect(history.location.pathname).toBe('/drinks');
  });

  // Garante que o botão de meals está visível e redireciona corretamente.
  test('Verifica se o botão de Meals esta sendo renderizado na tela e se, ao clicar, ele redireciona para a página de Meals;', () => {
    const { history } = renderWithRouter(
      <Provider>
        <Footer />
      </Provider>,
    );

    const mealButton = screen.getByTestId('meals-bottom-btn');
    expect(mealButton).toBeInTheDocument();

    userEvent.click(mealButton);

    expect(history.location.pathname).toBe('/meals');
  });
});
