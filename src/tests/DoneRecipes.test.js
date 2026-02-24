import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Provider from '../context/Provider';
import renderWithRouter from '../services/renderWithRouter';
import Done from '../pages/Done';
import doneRecipes from '../services/MockLocalStorageDone';

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

// Suíte da tela de receitas concluídas.
describe('Testes no componente "Done"', () => {
  beforeEach(() => {
    localStorage.setItem('doneRecipes', JSON.stringify(doneRecipes));
  });

  // Valida renderização dos cards e funcionamento dos filtros.
  it('Testes se tudo é renderizado', () => {
    renderWithRouter(
      <Provider>
        <Done />
      </Provider>,
    );

    const firstImageHorizontal = screen.getByTestId('0-horizontal-image');
    const firstName = screen.getByTestId('0-horizontal-name');
    const shareBtn = screen.getByTestId('0-horizontal-share-btn');

    expect(firstImageHorizontal).toBeInTheDocument();
    expect(screen.getByTestId('1-horizontal-image')).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(screen.getByTestId('1-horizontal-name')).toBeInTheDocument();
    expect(screen.getByTestId('0-horizontal-done-date')).toBeInTheDocument();
    expect(screen.getByTestId('1-horizontal-done-date')).toBeInTheDocument();
    expect(shareBtn).toBeInTheDocument();
    expect(screen.getByTestId('1-horizontal-share-btn')).toBeInTheDocument();

    const getBtnMeals = screen.getByRole('button', {
      name: /meals/i,
    });

    const getBtnDrinks = screen.getByRole('button', {
      name: /drinks/i,
    });

    const getBtnAll = screen.getByRole('button', {
      name: /all/i,
    });

    act(() => {
      userEvent.click(getBtnMeals);
    });

    waitFor(() => {
      expect(firstImageHorizontal).toBeInTheDocument();
      expect(firstName).toBeInTheDocument();
      expect(shareBtn).toBeInTheDocument();
    });

    act(() => {
      userEvent.click(getBtnDrinks);
    });

    waitFor(() => {
      expect(firstImageHorizontal).toBeInTheDocument();
      expect(firstName).toBeInTheDocument();
      expect(shareBtn).toBeInTheDocument();
    });

    act(() => {
      userEvent.click(getBtnAll);
    });
  });

  // Garante que o botão de compartilhar dispara a ação de cópia.
  it('Testa se é possivel copiar o link', () => {
    renderWithRouter(
      <Provider>
        <Done />
      </Provider>,
    );

    const shareBtn = screen.getAllByRole('img', {
      name: /Compartilhar receita/i,
    });

    expect(shareBtn.length).toBe(2);

    userEvent.click(shareBtn[0]);
  });
});
