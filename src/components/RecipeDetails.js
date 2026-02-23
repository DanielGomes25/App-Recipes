import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import copy from 'clipboard-copy';
import { FetchIdDrink, FetchIdMeals }
  from '../services/APIsFetch';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import styles from './RecipeDetails.module.css';

function RecipeDetails() {
  const [copyRecipe, setCopyRecipe] = useState(false);
  const [favoritMealOrDrink, setFavoriteMealOrDrink] = useState([]);
  const [, setSaveFavorit] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const isMeal = location.pathname.includes('/meals');

  const sanitizeRecipe = (recipe) => {
    const sanitized = { ...recipe };
    Object.keys(sanitized).forEach((key) => {
      if (sanitized[key] === null || sanitized[key] === '') {
        delete sanitized[key];
      }
    });
    return sanitized;
  };

  useEffect(() => {
    const handleChange = async () => {
      if (isMeal) {
        const dataIdMeals = await FetchIdMeals((location.pathname.match(/\d+/g))[0]);
        const meal = dataIdMeals.meals[0];
        setFavoriteMealOrDrink(meal);
        setCurrentRecipe(sanitizeRecipe(meal));
      } else {
        const dataIdDrinks = await FetchIdDrink(location.pathname.match(/\d+/g)[0]);
        const drink = dataIdDrinks.drinks[0];
        setFavoriteMealOrDrink(drink);
        setCurrentRecipe(sanitizeRecipe(drink));
      }
    };
    handleChange();
  }, [location.pathname, isMeal]);

  const copyLink = () => {
    const local = location.pathname;
    copy(`http://localhost:3000${local}`);
    setCopyRecipe(true);
  };

  const favoriteRecipe = () => {
    const isMealType = location.pathname.includes('/meals');
    setSaveFavorit((prevState) => [...prevState, {
      id: isMealType ? favoritMealOrDrink.idMeal : favoritMealOrDrink.idDrink,
      type: isMealType ? 'meal' : 'drink',
      nationality: favoritMealOrDrink.strArea || '',
      category: favoritMealOrDrink.strCategory || '',
      alcoholicOrNot: favoritMealOrDrink.strAlcoholic || '',
      name: favoritMealOrDrink.strMeal || favoritMealOrDrink.strDrink,
      image: favoritMealOrDrink.strMealThumb || favoritMealOrDrink.strDrinkThumb,
    }]);
  };

  const ingredientsList = useMemo(() => {
    if (!currentRecipe) {
      return [];
    }
    const list = [];
    const maxIngredients = 20;
    for (let index = 1; index <= maxIngredients; index += 1) {
      const ingredient = currentRecipe[`strIngredient${index}`];
      const measure = currentRecipe[`strMeasure${index}`];
      if (ingredient && ingredient.trim()) {
        list.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
    return list;
  }, [currentRecipe]);

  const title = currentRecipe?.strMeal || currentRecipe?.strDrink || '';
  const image = currentRecipe?.strMealThumb || currentRecipe?.strDrinkThumb || '';
  const category = currentRecipe?.strCategory || '';
  const alcoholic = currentRecipe?.strAlcoholic || '';
  const instructions = currentRecipe?.strInstructions || '';

  const handleRedirect = () => {
    if (isMeal) {
      history
        .push(`/meals/${location.pathname.match(/\d+/g)[0]}/in-progress`);
    } else {
      history.push(`/drinks/${location.pathname.match(/\d+/g)[0]}/in-progress`);
    }
  };

  return (
    <div className={ styles.page }>
      <section className={ styles.hero }>
        <div className={ styles.heroText }>
          <h1 data-testid="recipe-title">{title}</h1>
          <div className={ styles.meta }>
            {category && <span data-testid="recipe-category">{category}</span>}
            {alcoholic && <span>{alcoholic}</span>}
          </div>
          <p className={ styles.instructions } data-testid="instructions">
            {instructions}
          </p>
        </div>
        {image && (
          <img
            src={ image }
            alt="Imagem da receita"
            data-testid="recipe-photo"
            className={ styles.recipePhoto }
          />
        )}
      </section>

      <section className={ styles.card }>
        <h3>Ingredientes</h3>
        {ingredientsList.length > 0 && (
          <ul>
            {ingredientsList.map((item, index) => (
              <li
                key={ `${item.ingredient}-${index}` }
                data-testid={ `${index}-ingredient-name-and-measure` }
              >
                {item.measure ? `${item.ingredient} - ${item.measure}` : item.ingredient}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={ styles.actions }>
        <button
          data-testid="start-recipe-btn"
          className={ styles.buttonStart }
          onClick={ handleRedirect }
        >
          Start Recipe
        </button>
        <button
          data-testid="share-btn"
          onClick={ copyLink }
          className={ styles.iconButton }
        >
          <img src={ shareIcon } alt="Botao de Compartilhar" />
        </button>
        <button
          data-testid="favorite-btn"
          onClick={ favoriteRecipe }
          className={ styles.iconButton }
        >
          <img src={ whiteHeartIcon } alt="Botao de Favoritar" />
        </button>
      </div>

      {copyRecipe && <p>Link copied!</p>}
    </div>
  );
}

export default RecipeDetails;
