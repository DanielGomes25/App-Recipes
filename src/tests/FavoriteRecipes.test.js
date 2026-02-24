import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { createMemoryHistory } from 'history';
import Provider from '../context/Provider';
import renderWithRouter from '../services/renderWithRouter';
import { mockFavRecipe } from '../services/Mocks';
import FavoriteRecipes from '../pages/FavoriteRecipes';

const cardImage = '0-horizontal-image';
const shareBtn = '0-horizontal-share-btn';
const favBtn = '0-horizontal-favorite-btn';

// Suíte da tela de receitas favoritas.
describe('Testa componente Favorites Recipes', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpa o localStorage antes de cada teste
  });

  // Verifica se os botões de filtro principais são renderizados.
  it('testa se renderiza inputs no componente Favorites Recipes', async () => {
    renderWithRouter(
      <Provider>
        <FavoriteRecipes />
      </Provider>,
    );
    const filterBtnAll = screen.getByRole('button', {
      name: 'All',
    });
    const filterBtnMeal = screen.getByRole('button', {
      name: 'Meals',
    });
    const filterBtnDrink = screen.getByRole('button', {
      name: 'Drinks',
    });

    expect(filterBtnAll).toBeInTheDocument();
    expect(filterBtnMeal).toBeInTheDocument();
    expect(filterBtnDrink).toBeInTheDocument();
  });

  // Verifica se cards de meal e drink favoritos aparecem na tela.
  it('testa se renderiza cards de receitas favoritas', async () => {
    renderWithRouter(
      <Provider>
        <FavoriteRecipes />
      </Provider>,
    );

    localStorage.setItem('favoriteRecipes', JSON.stringify(mockFavRecipe));
    const cardImageMeal = await screen.findByTestId(cardImage);
    const cardTitleMeal = await screen.findByTestId('0-horizontal-name');
    const cardTextMeal = await screen.findByTestId('0-horizontal-top-text');
    const shareBtnMeal = await screen.findByTestId(shareBtn);
    const favBtnMeal = await screen.findByTestId(favBtn);
    const cardImageDrink = await screen.findByTestId('1-horizontal-image');
    const cardTitleDrink = await screen.findByTestId('1-horizontal-name');
    const cardTextDrink = await screen.findByTestId('1-horizontal-top-text');
    const shareBtnDrink = await screen.findByTestId('1-horizontal-share-btn');
    const favBtnDrink = await screen.findByTestId('1-horizontal-favorite-btn');

    expect(cardImageMeal).toBeInTheDocument();
    expect(cardTitleMeal).toBeInTheDocument();
    expect(cardTextMeal).toBeInTheDocument();
    expect(shareBtnMeal).toBeInTheDocument();
    expect(favBtnMeal).toBeInTheDocument();
    expect(cardImageDrink).toBeInTheDocument();
    expect(cardTitleDrink).toBeInTheDocument();
    expect(cardTextDrink).toBeInTheDocument();
    expect(shareBtnDrink).toBeInTheDocument();
    expect(favBtnDrink).toBeInTheDocument();
  });

  // Valida o comportamento dos filtros All, Meals e Drinks.
  it('testa se função filter funciona', async () => {
    renderWithRouter(
      <Provider>
        <FavoriteRecipes />
      </Provider>,
    );

    localStorage.setItem('favoriteRecipes', JSON.stringify(mockFavRecipe));
    const cardImageMeal = await screen.findByTestId(cardImage);
    const cardTitleMeal = await screen.findByTestId('0-horizontal-name');
    const cardTextMeal = await screen.findByTestId('0-horizontal-top-text');
    const shareBtnMeal = await screen.findByTestId(shareBtn);
    const favBtnMeal = await screen.findByTestId(favBtn);
    const cardImageDrink = await screen.findByTestId('1-horizontal-image');
    const cardTitleDrink = await screen.findByTestId('1-horizontal-name');
    const cardTextDrink = await screen.findByTestId('1-horizontal-top-text');
    const shareBtnDrink = await screen.findByTestId('1-horizontal-share-btn');
    const favBtnDrink = await screen.findByTestId('1-horizontal-favorite-btn');

    const filterBtnAll = screen.getByRole('button', {
      name: 'All',
    });
    const filterBtnMeal = screen.getByRole('button', {
      name: 'Meals',
    });
    const filterBtnDrink = screen.getByRole('button', {
      name: 'Drinks',
    });

    act(() => {
      userEvent.click(filterBtnAll);
    });

    expect(cardImageMeal).toBeInTheDocument();
    expect(cardTitleMeal).toBeInTheDocument();
    expect(cardTextMeal).toBeInTheDocument();
    expect(shareBtnMeal).toBeInTheDocument();
    expect(favBtnMeal).toBeInTheDocument();
    expect(cardImageDrink).toBeInTheDocument();
    expect(cardTitleDrink).toBeInTheDocument();
    expect(cardTextDrink).toBeInTheDocument();
    expect(shareBtnDrink).toBeInTheDocument();
    expect(favBtnDrink).toBeInTheDocument();

    act(() => {
      userEvent.click(filterBtnMeal);
    });

    waitFor(() => expect(cardImageMeal).toBeInTheDocument());
    waitFor(() => expect(cardTitleMeal).toBeInTheDocument());
    waitFor(() => expect(cardTextMeal).toBeInTheDocument());
    waitFor(() => expect(shareBtnMeal).toBeInTheDocument());
    waitFor(() => expect(favBtnMeal).toBeInTheDocument());

    act(() => {
      userEvent.click(filterBtnDrink);
    });

    waitFor(() => expect(cardImageDrink).toBeInTheDocument());
    waitFor(() => expect(cardTitleDrink).toBeInTheDocument());
    waitFor(() => expect(cardTextDrink).toBeInTheDocument());
    waitFor(() => expect(shareBtnDrink).toBeInTheDocument());
    waitFor(() => expect(favBtnDrink).toBeInTheDocument());
  });

  // Garante navegação para a rota de detalhes ao clicar na imagem.
  it('Testando se direciona para a página de receita detalhada', async () => {
    const history = createMemoryHistory();
    renderWithRouter(
      <Provider>
        <Router history={ history }>
          <FavoriteRecipes />
        </Router>
      </Provider>,
    );
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockFavRecipe));
    history.push('/favorite-recipes');

    const img = screen.getByTestId('0-horizontal-image');
    expect(img).toBeInTheDocument();
    userEvent.click(img);
    expect(history.location.pathname).toBe('/meals/52771');
  });

  // Garante feedback visual após compartilhar uma receita favorita.
  it('Testa se botão de compartilhar funciona', async () => {
    const mockWriteText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
    });

    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockFavRecipe),
    });

    renderWithRouter(
      <Provider>
        <FavoriteRecipes />
      </Provider>,
    );

    const shareBtnMeal = await screen.findByTestId('0-horizontal-share-btn');
    userEvent.click(shareBtnMeal);
    const linkCopied = await screen.findByText('Link copied!');
    expect(linkCopied).toBeInTheDocument();
  });

  // Valida remoção da receita ao clicar no botão de favoritar.
  it('Testa se botão de favoritar funciona', async () => {
    renderWithRouter(
      <Provider>
        <FavoriteRecipes />
      </Provider>,
    );

    localStorage.setItem('favoriteRecipes', JSON.stringify(mockFavRecipe));
    const favBtnMeal = await screen.findByTestId('0-horizontal-favorite-btn');
    userEvent.click(favBtnMeal);
    waitFor(() => expect(favBtnMeal).not.toBeInTheDocument());

    // Corrigir
  });
});
