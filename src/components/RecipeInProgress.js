import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

function RecipeInProgress(props) {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [concludedIngredients, setConcludedIngredients] = useState([]);
  const [meal, setMeal] = useLocalStorage('meals');
  const [drink, setDrinks] = useLocalStorage('drinks');
  const [doneRecipes, setDoneRecipes] = useLocalStorage('doneRecipes', []);
  const [errorNotification, setErrorNotification] = useState(null);
  const [allIngredientsCompleted, setAllIngredientsCompleted] = useState(false);
  const history = useHistory();

  // cria um array que contém os nomes das propriedades dos ingredientes
  const numIngredientes = 20;
  const ingredientesIndex = useMemo(() => Array.from(
    { length: numIngredientes },
    (_, index) => `strIngredient${index + 1}`,
  ), []);

  const { match: { params: { id } }, currentPage } = props;

  // chama API
  async function fetchAPI(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  // atualiza o estado das variáveis
  useEffect(() => {
    const checkQuantity = () => {
      if (currentRecipe) {
        const cont = ingredientesIndex.reduce(
          (count, ingredients) => (currentRecipe[ingredients] ? count + 1 : count),
          0,
        );
        return cont;
      }
    };
    const updateIngredientCompletion = () => {
      if (currentPage === 'meals' && meal) {
        setConcludedIngredients(meal[id]);
        setAllIngredientsCompleted(meal[id].length === checkQuantity());
      }
      if (currentPage === 'drinks' && drink) {
        setConcludedIngredients(drink[id]);
        setAllIngredientsCompleted(drink[id].length === checkQuantity());
      }
    };
    updateIngredientCompletion();
  }, [meal, drink, id, currentPage, ingredientesIndex, currentRecipe]);

  // busca os detalhes da receita da api
  useEffect(() => {
    async function fetchDataApi() {
      let apiURL = '';
      if (currentPage === 'meals') {
        apiURL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      }
      if (currentPage === 'drinks') {
        apiURL = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      }
      const { meals, drinks } = await fetchAPI(apiURL);
      const data = currentPage === 'meals' ? meals : drinks;
      const foundRecipe = data.find((item) => item.idMeal === id || item.idDrink === id);
      setCurrentRecipe(foundRecipe);
    }
    fetchDataApi();
  }, [currentPage, id]);

  // lida com a alteração do estado dos ingredientes selecionados
  const handleChangeCheckbox = (ingredients) => {
    const modifiedIngredients = concludedIngredients.includes(ingredients)
      ? concludedIngredients.filter(
        (currentIngredient) => currentIngredient !== ingredients,
      )
      : [...concludedIngredients, ingredients];
    setConcludedIngredients(modifiedIngredients);
    if (currentPage === 'meals') {
      setMeal({
        ...meal,
        [id]:
        [...modifiedIngredients],
      });
    }
    if (currentPage === 'drinks') {
      setDrinks({
        [id]:
        [...modifiedIngredients],
      });
    }
  };

  // renderiaza a lista de ingredientes
  function renderIngredients() {
    return ingredientesIndex.map((ingredient, index) => {
      const currentIngredientName = currentRecipe[ingredient];
      if (currentIngredientName) {
        const isChecked = concludedIngredients.includes(currentIngredientName);
        const labelStyle = isChecked
          ? {
            display: 'flex',
            gap: 10,
            textDecoration: 'line-through solid rgb(0, 0, 0)',
          }
          : {
            display: 'flex',
            gap: 10,
          };
        return (
          <label
            key={ currentIngredientName }
            data-testid={ `${index}-ingredient-step` }
            style={ labelStyle }
          >
            <p>{currentIngredientName}</p>
            <input
              type="checkbox"
              checked={ isChecked }
              onChange={ () => handleChangeCheckbox(currentIngredientName) }
            />
          </label>
        );
      }
      return null;
    });
  }

  function renderPage() {
    if (!currentRecipe) {
      return null;
    }

    const { strMeal, strMealThumb, strDrink, strDrinkThumb, strCategory,
      strInstructions } = currentRecipe;

    const handleCopyLink = async () => {
      const completeURL = window.location.href;
      const lastPosition = completeURL.lastIndexOf('/');
      const slicedURL = completeURL.slice(0, lastPosition);
      navigator.clipboard.writeText(slicedURL);
      setErrorNotification('Link copied!');
    };

    const concludeRecipe = () => {
      const currentDate = new Date();
      setDoneRecipes([...doneRecipes,
        {
          id,
          type: currentPage === 'meals' ? 'meal' : 'drink',
          nationality: currentRecipe.strArea || '',
          category: currentRecipe.strCategory || '',
          alcoholicOrNot: currentRecipe.strAlcoholic || '',
          name: currentRecipe.strMeal || currentRecipe.strDrink,
          image: currentRecipe.strDrinkThumb || currentRecipe.strMealThumb,
          doneDate: currentDate.toISOString(),
          tags: currentRecipe.strTags ? currentRecipe.strTags.split(',') : [],
        }]);
      history.push('/done-recipes');
    };

    return (
      <>
        <h2 data-testid="recipe-title">{currentPage === 'meals' ? strMeal : strDrink}</h2>
        <img
          className="image"
          src={ currentPage === 'meals' ? strMealThumb : strDrinkThumb }
          alt={ currentPage === 'meals' ? 'Meal img' : 'Drink img' }
          data-testid="recipe-photo"
        />
        <h4 data-testid="recipe-category">{strCategory}</h4>
        <h3>Ingredientes</h3>
        {renderIngredients()}
        <h3>Instruções</h3>
        <p data-testid="instructions">{strInstructions}</p>
        <span>{errorNotification}</span>

        <section>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ handleCopyLink }
          >
            Compartilhar
          </button>
          <button
            type="button"
            data-testid="favorite-btn"
          >
            Favorita
          </button>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            onClick={ () => concludeRecipe() }
            disabled={ !allIngredientsCompleted }
          >
            Finalizar Receita
          </button>
        </section>
      </>
    );
  }
  return <div className="meals">{renderPage()}</div>;
}
RecipeInProgress.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentPage: PropTypes.string.isRequired,
};

export default RecipeInProgress;
