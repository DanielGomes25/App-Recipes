import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Context from '../context/Context';
import {
  ingredientFetchMeal,
  nameFetchMeal, firsLetterFetchMeal,
  ingredientFetchDrink,
  nameFetchDrink, firsLetterFetchDrink,
} from '../services/APIsFetch';

export default function SearchBar() {
  const {
    textSearch,
    titleHeader,
    recipesSearch,
    setRecipesData } = useContext(Context);
  const [inputSearch, setInputSearch] = useState('');
  const history = useHistory();
  const maxNumber = 12;

  // Escolhe a melhor função de alerta para o ambiente atual (browser ou teste)
  const getAlertFn = () => {
    if (typeof global !== 'undefined' && global.alert) {
      return global.alert;
    }
    if (typeof window !== 'undefined' && window.alert) {
      return window.alert;
    }
    return () => {};
  };

  // Direciona para a API correta com base na opção de rádio selecionada
  const getSearchResponse = async (ingredientAPI, nameAPI, firstLetterAPI) => {
    switch (inputSearch) {
    case 'ingredient':
      return ingredientAPI(textSearch);
    case 'name':
      return nameAPI(textSearch);
    case 'first-letter':
      if (textSearch.length > 1) {
        getAlertFn()('Your search must have only 1 (one) character');
        return null;
      }
      return firstLetterAPI(textSearch);
    default:
      return null;
    }
  };

  // Aplica a resposta no estado e trata os casos de 0/1 resultado
  const applySearchResponse = (response) => {
    if (!response) {
      return;
    }
    const responseKey = titleHeader.toLowerCase();
    if (response[responseKey] === null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Sorry, we haven\'t found any recipes for these filters.',
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    setRecipesData(response[responseKey]);
    if (titleHeader === 'Meals' && response.meals.length === 1) {
      const { idMeal } = response.meals[0];
      history.push(`/meals/${idMeal}`);
      return;
    }
    if (titleHeader === 'Drinks' && response.drinks.length === 1) {
      const { idDrink } = response.drinks[0];
      history.push(`/drinks/${idDrink}`);
    }
  };

  // Orquestra o fluxo de busca (requisição -> tratamento da resposta)
  const recipeFilter = async (ingredientAPI, nameAPI, firstLetterAPI) => {
    const response = await getSearchResponse(ingredientAPI, nameAPI, firstLetterAPI);
    applySearchResponse(response);
  };

  // Escolhe APIs de meals ou drinks conforme o header atual
  const handleSubbmit = () => {
    if (titleHeader === 'Meals') {
      recipeFilter(ingredientFetchMeal, nameFetchMeal, firsLetterFetchMeal);
    } else {
      recipeFilter(ingredientFetchDrink, nameFetchDrink, firsLetterFetchDrink);
    }
  };

  return (
    <div className="searchBar-container">
      <div className="search-inputs">
        <label>
          Ingredient:
          <input
            type="radio"
            data-testid="ingredient-search-radio"
            name="search-radio"
            value="ingredient"
            onChange={ ({ target }) => setInputSearch(target.value) }
          />
        </label>
        <label>
          Name:
          <input
            type="radio"
            data-testid="name-search-radio"
            name="search-radio"
            value="name"
            onChange={ ({ target }) => setInputSearch(target.value) }
          />
        </label>
        <label>
          First Letter:
          <input
            type="radio"
            data-testid="first-letter-search-radio"
            name="search-radio"
            value="first-letter"
            onChange={ ({ target }) => setInputSearch(target.value) }
          />
        </label>
      </div>
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={ handleSubbmit }
        className=" button-submit rounded-md
         shadow-sm"
      >
        Busca
      </button>
      {recipesSearch.filter((_element, index) => index < maxNumber)
        .map((element, index) => {
          if (titleHeader === 'Drinks') {
            return (
              <div data-testid={ `${index}-recipe-card` } key={ index }>
                <img
                  data-testid={ `${index}-card-img` }
                  src={ element.strDrinkThumb }
                  alt="Imagem da receita"
                />
                <h4 data-testid={ `${index}-card-name` }>{element.strDrink}</h4>
              </div>
            );
          }
          return (
            <div data-testid={ `${index}-recipe-card` } key={ index }>
              <img
                data-testid={ `${index}-card-img` }
                src={ element.strMealThumb }
                alt="Imagem da receita"
              />
              <h4 data-testid={ `${index}-card-name` }>{element.strMeal}</h4>
            </div>
          );
        })}
    </div>
  );
}
