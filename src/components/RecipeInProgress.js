import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import styles from './RecipeInProgress.module.css';

const FAVORITES_KEY = 'favoriteRecipes';
const MAX_INGREDIENTS = 20;
// Tela de preparo com checklist de ingredientes e finalização da receita.
function RecipeInProgress(props) {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [concludedIngredients, setConcludedIngredients] = useState([]);
  const [meal, setMeal] = useLocalStorage('meals');
  const [drink, setDrinks] = useLocalStorage('drinks');
  const [doneRecipes, setDoneRecipes] = useLocalStorage('doneRecipes', []);
  const [errorNotification, setErrorNotification] = useState(null);
  const [allIngredientsCompleted, setAllIngredientsCompleted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const history = useHistory();
  const { match: { params: { id } }, currentPage } = props;
  const isMeal = currentPage === 'meals';
  const ingredientesIndex = useMemo(() => Array.from(
    { length: MAX_INGREDIENTS },
    (_, index) => `strIngredient${index + 1}`,
  ), []);

  const ingredientCount = useMemo(() => {
    if (!currentRecipe) {
      return 0;
    }
    return ingredientesIndex.reduce(
      (count, ingredients) => (currentRecipe[ingredients] ? count + 1 : count),
      0,
    );
  }, [currentRecipe, ingredientesIndex]);
  const savedIngredients = useMemo(() => {
    const storedByType = isMeal ? meal : drink;
    if (storedByType && storedByType[id]) {
      return storedByType[id];
    }
    return [];
  }, [isMeal, meal, drink, id]);
  useEffect(() => {
    setConcludedIngredients(savedIngredients);
    setAllIngredientsCompleted(savedIngredients.length === ingredientCount);
  }, [savedIngredients, ingredientCount]);

  useEffect(() => {
    async function fetchDataApi() {
      const apiURL = isMeal
        ? `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
      const response = await fetch(apiURL);
      const { meals, drinks } = await response.json();
      const data = isMeal ? meals : drinks;
      const foundRecipe = data.find((item) => item.idMeal === id || item.idDrink === id);
      setCurrentRecipe(foundRecipe);
    }
    fetchDataApi();
  }, [isMeal, id]);
  useEffect(() => {
    if (!currentRecipe) {
      setIsFavorite(false);
      return;
    }
    const recipeId = isMeal ? currentRecipe.idMeal : currentRecipe.idDrink;
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    setIsFavorite(stored.some((item) => item.id === recipeId));
  }, [currentRecipe, isMeal]);
  // Marca/desmarca ingrediente e persiste progresso por receita.
  const handleChangeCheckbox = (ingredients) => {
    const modifiedIngredients = concludedIngredients.includes(ingredients)
      ? concludedIngredients.filter(
        (currentIngredient) => currentIngredient !== ingredients,
      )
      : [...concludedIngredients, ingredients];
    setConcludedIngredients(modifiedIngredients);
    if (isMeal) {
      setMeal({
        ...(meal || {}),
        [id]: [...modifiedIngredients],
      });
      return;
    }
    setDrinks({
      ...(drink || {}),
      [id]: [...modifiedIngredients],
    });
  };
  // Gera a lista de ingredientes com checkbox para o preparo.
  const renderIngredients = () => (
    ingredientesIndex.map((ingredient, index) => {
      const currentIngredientName = currentRecipe[ingredient];
      if (!currentIngredientName) {
        return null;
      }
      const isChecked = concludedIngredients.includes(currentIngredientName);
      return (
        <label
          key={ currentIngredientName }
          data-testid={ `${index}-ingredient-step` }
          className={ isChecked ? styles.ingredientChecked : styles.ingredientRow }
        >
          <span>{currentIngredientName}</span>
          <input
            type="checkbox"
            checked={ isChecked }
            onChange={ () => handleChangeCheckbox(currentIngredientName) }
          />
        </label>
      );
    })
  );
  // Copia URL base da receita removendo o sufixo "/in-progress".
  const handleCopyLink = () => {
    const completeURL = window.location.href;
    const lastPosition = completeURL.lastIndexOf('/');
    const slicedURL = completeURL.slice(0, lastPosition);
    navigator.clipboard.writeText(slicedURL);
    setErrorNotification('Link copied!');
  };
  // Cria o registro de receita concluída e navega para a tela de concluídas.
  const concludeRecipe = () => {
    const currentDate = new Date();
    setDoneRecipes([...doneRecipes, {
      id,
      type: isMeal ? 'meal' : 'drink',
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
  // Alterna estado de favorito no localStorage e no estado local.
  const favoriteRecipe = () => {
    const recipeId = isMeal ? currentRecipe.idMeal : currentRecipe.idDrink;
    const favoriteEntry = {
      id: recipeId,
      type: isMeal ? 'meal' : 'drink',
      nationality: currentRecipe.strArea || '',
      category: currentRecipe.strCategory || '',
      alcoholicOrNot: currentRecipe.strAlcoholic || '',
      name: currentRecipe.strMeal || currentRecipe.strDrink,
      image: currentRecipe.strMealThumb || currentRecipe.strDrinkThumb,
    };
    const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    const exists = storedFavorites.some((item) => item.id === recipeId);
    const updatedFavorites = exists
      ? storedFavorites.filter((item) => item.id !== recipeId)
      : [...storedFavorites, favoriteEntry];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    setIsFavorite(!exists);
  };
  if (!currentRecipe) {
    return <div className="meals" />;
  }

  const title = isMeal ? currentRecipe.strMeal : currentRecipe.strDrink;
  const image = isMeal ? currentRecipe.strMealThumb : currentRecipe.strDrinkThumb;

  return (
    <div className="meals">
      <div className={ styles.progressPage }>
        <section className={ styles.hero }>
          <div className={ styles.heroText }>
            <h2 data-testid="recipe-title">{title}</h2>
            <p data-testid="recipe-category" className={ styles.category }>
              {currentRecipe.strCategory}
            </p>
          </div>
          <img
            className={ styles.photo }
            src={ image }
            alt={ isMeal ? 'Meal img' : 'Drink img' }
            data-testid="recipe-photo"
          />
        </section>

        <section className={ styles.card }>
          <h3>Ingredientes</h3>
          <div className={ styles.ingredientsList }>
            {renderIngredients()}
          </div>
        </section>

        <section className={ styles.card }>
          <h3>Instruções</h3>
          <p data-testid="instructions" className={ styles.instructions }>
            {currentRecipe.strInstructions}
          </p>
        </section>

        {errorNotification && (
          <span className={ styles.notification }>{errorNotification}</span>
        )}

        <section className={ styles.actions }>
          <button
            type="button"
            data-testid="share-btn"
            onClick={ handleCopyLink }
            className={ styles.secondaryButton }
          >
            Compartilhar
          </button>
          <button
            type="button"
            data-testid="favorite-btn"
            className={ styles.secondaryButton }
            onClick={ favoriteRecipe }
          >
            <img
              src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
              alt="Botao de Favoritar"
            />
          </button>
          <button
            type="button"
            data-testid="finish-recipe-btn"
            onClick={ () => concludeRecipe() }
            disabled={ !allIngredientsCompleted }
            className={ styles.primaryButton }
          >
            Finalizar Receita
          </button>
        </section>
      </div>
    </div>
  );
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
