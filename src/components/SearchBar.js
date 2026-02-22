import React, { useState, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Context from '../context/Context';
import {
  ingredientFetchMeal,
  nameFetchMeal, firsLetterFetchMeal,
  ingredientFetchDrink,
  nameFetchDrink, firsLetterFetchDrink,
} from '../services/APIsFetch';

const RecipeCard = ({ element, index, type }) => (
  <div data-testid={`${index}-recipe-card`} key={index}>
    <img
      data-testid={`${index}-card-img`}
      src={type === 'Drinks' ? element.strDrinkThumb : element.strMealThumb}
      alt="Imagem da receita"
    />
    <h4 data-testid={`${index}-card-name`}>
      {type === 'Drinks' ? element.strDrink : element.strMeal}
    </h4>
  </div>
);

export default function SearchBar() {
  const {
    textSearch,
    titleHeader,
    recipesSearch,
    setRecipesSearch,
  } = useContext(Context);

  const [inputSearch, setInputSearch] = useState('');
  const history = useHistory();
  const maxNumber = 12;

  const recipeFilter = async (ingredientAPI, nameAPI, firstLetterAPI) => {
    let response = null;
    if (inputSearch === 'ingredient') {
      response = await ingredientAPI(textSearch);
      console.log(response);
    } else if (inputSearch === 'name') {
      response = await nameAPI(textSearch);
    } else if (inputSearch === 'first-letter') {
      if (textSearch.length > 1) {
        return toast.error('Your search must have only 1 (one) character');
      }
      response = await firstLetterAPI(textSearch);
    }
    if (response[titleHeader.toLowerCase()] !== null) {
      setRecipesSearch(response[titleHeader.toLowerCase()]);
    } else {
      return toast.error('Sorry, we haven\'t found any recipes for these filters.');
    }
    if (titleHeader === 'Meals' && response.meals.length === 1) {
      const { idMeal } = response.meals[0];
      history.push(`/meals/${idMeal}`);
    } else if (titleHeader === 'Drinks' && response.drinks.length === 1) {
      const { idDrink } = response.drinks[0];
      history.push(`/drinks/${idDrink}`);
    }
  };

  const handleSubmit = () => {
    if (!textSearch) {
      return toast.error('Please enter a search term!');
    }
    if (titleHeader === 'Meals') {
      recipeFilter(ingredientFetchMeal, nameFetchMeal, firsLetterFetchMeal);
    } else {
      recipeFilter(ingredientFetchDrink, nameFetchDrink, firsLetterFetchDrink);
    }
  };

  return (
    <div>
      <label>
        Ingredient:
        <input
          type="radio"
          data-testid="ingredient-search-radio"
          name="search-radio"
          value="ingredient"
          onChange={({ target }) => setInputSearch(target.value)}
        />
      </label>
      <label>
        Name:
        <input
          type="radio"
          data-testid="name-search-radio"
          name="search-radio"
          value="name"
          onChange={({ target }) => setInputSearch(target.value)}
        />
      </label>
      <label>
        First Letter:
        <input
          type="radio"
          data-testid="first-letter-search-radio"
          name="search-radio"
          value="first-letter"
          onChange={({ target }) => setInputSearch(target.value)}
        />
      </label>
      <button
        type="button"
        data-testid="exec-search-btn"
        onClick={handleSubmit}
      >
        Search
      </button>

      {recipesSearch.filter((_element, index) => index < maxNumber).map((element, index) => (
        <RecipeCard key={index} element={element} index={index} type={titleHeader} />
      ))}
    </div>
  );
}