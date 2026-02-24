import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Provider from '../context/Provider';
import renderWithRouter from '../services/renderWithRouter';
import SearchBar from '../components/SearchBar';
import App from '../App';
import { mockMeals } from '../services/Mocks';

// Suíte da barra de busca e seus fluxos de filtragem.
describe('Testes do "SearchBar"', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => (mockMeals),
    });
  });

  // Verifica renderização dos rádios e botão de execução da busca.
  it('Testa se renderiza inputs no componente SearchBar', async () => {
    renderWithRouter(
      <Provider>
        <SearchBar />
      </Provider>,
    );
    const ingredientInput = await screen.findByLabelText(/Ingredient:/i);
    const nameInput = await screen.findByLabelText(/name/i);
    const firstLetterInput = await screen.findByLabelText(/first letter/i);
    const searchButton = screen.getByRole('button', {
      name: 'Busca',
    });

    expect(ingredientInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(firstLetterInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  // Garante que os três tipos de busca disparam chamadas de API.
  it('testa se input chama a função no componente drink', () => {
    const { history } = renderWithRouter(
      <Provider>
        <App />
      </Provider>,
    );

    act(() => {
      history.push('/meals');
    });

    const ingredientInput = screen.getByLabelText(/Ingredient:/i);
    const nameInput = screen.getByLabelText(/name/i);
    const firstLetterInput = screen.getByLabelText(/first letter/i);
    const searchButton = screen.getByRole('button', {
      name: 'Busca',
    });

    userEvent.click(ingredientInput);
    userEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalled();

    userEvent.click(nameInput);
    userEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalled();

    userEvent.click(firstLetterInput);
    userEvent.click(searchButton);

    expect(global.fetch).toHaveBeenCalled();
  });

  // Exercita o cenário de validação para first-letter com mais de 1 caractere.
  it('Testando alerts para mais de um caracter no "First Letter"', () => {
    const { history } = renderWithRouter(
      <Provider>
        <App />
      </Provider>,
    );

    act(() => {
      history.push('/drinks');
    });

    const searchButton = screen.getByRole('button', {
      name: 'Busca',
    });
    const firstLetter = screen.getByRole('radio', {
      name: /first letter:/i,
    });

    const buttonSearchInput = screen.getByRole('img', {
      name: /search icon/i,
    });

    act(() => {
      userEvent.click(buttonSearchInput);
    });

    const getText = screen.getByRole('textbox');

    userEvent.click(firstLetter);
    userEvent.type(getText, 'aq');

    act(() => {
      userEvent.click(searchButton);
    });
  });

  // Exercita cenário de receita não encontrada.
  it('Testando alerts para receita nao encontrada', () => {
    const { history } = renderWithRouter(
      <Provider>
        <App />
      </Provider>,
    );

    act(() => {
      history.push('/meals');
    });

    const searchBtn = screen.getByRole('button', {
      name: 'Busca',
    });
    const nameInput = screen.getByRole('radio', {
      name: /name:/i,
    });

    const btnInput = screen.getByRole('img', {
      name: /search icon/i,
    });

    act(() => {
      userEvent.click(btnInput);
    });

    const inputText = screen.getByRole('textbox');

    userEvent.click(nameInput);
    userEvent.type(inputText, 'cuzcuz');

    act(() => {
      userEvent.click(searchBtn);
    });
  });

  // Exercita cenário com único resultado e redirecionamento automático.
  it('Testando redirecionamento quando encontrar apenas uma receita', () => {
    const { history } = renderWithRouter(
      <Provider>
        <App />
      </Provider>,
    );

    act(() => {
      history.push('/drinks');
    });

    const searchButton = screen.getByRole('button', {
      name: 'Busca',
    });
    const nameInput = screen.getByRole('radio', {
      name: /name:/i,
    });

    const buttonSearchInput = screen.getByRole('img', {
      name: /search icon/i,
    });

    act(() => {
      userEvent.click(buttonSearchInput);
    });

    const getText = screen.getByRole('textbox');

    userEvent.click(nameInput);
    userEvent.type(getText, 'aquamarine');

    act(() => {
      userEvent.click(searchButton);
    });
  });

  // Exercita novamente fluxo de erro para garantir robustez da busca.
  it('Testando se dispara um alert quando a receita nao é encontrada', () => {
    const { history } = renderWithRouter(
      <Provider>
        <App />
      </Provider>,
    );

    act(() => {
      history.push('/meals');
    });

    const searchButton = screen.getByRole('button', {
      name: 'Busca',
    });
    const nameInput = screen.getByRole('radio', {
      name: /name:/i,
    });

    const buttonSearchInput = screen.getByRole('img', {
      name: /search icon/i,
    });

    act(() => {
      userEvent.click(buttonSearchInput);
    });

    const getText = screen.getByRole('textbox');

    userEvent.click(nameInput);
    userEvent.type(getText, 'cacau');

    act(() => {
      userEvent.click(searchButton);
    });
  });
});
