import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import copy from 'clipboard-copy';
import { FetchIdDrink, FetchIdMeals }
  from '../services/APIsFetch';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import styles from './RecipeDetails.module.css';

function RecipeDetails() {
  const [idDrinks, setIdDrinks] = useState([]);
  const [idMeals, setIdMeals] = useState([]);
  const [copyRecipe, setCopyRecipe] = useState(false);
  const [favoritMealOrDrink, setFavoriteMealOrDrink] = useState([]);
  const [, setSaveFavorit] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);

  const location = useLocation();
  const history = useHistory();

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
      if (location.pathname.includes('/meals')) {
        const dataIdMeals = await FetchIdMeals((location.pathname.match(/\d+/g))[0]);
        const meal = dataIdMeals.meals[0];
        setFavoriteMealOrDrink(meal);
        setCurrentRecipe(meal);
        const sanitizedMeal = sanitizeRecipe(meal);
        setIdMeals(Object.entries(sanitizedMeal));
      } else if (location.pathname.includes('/drinks')) {
        const dataIdDrinks = await FetchIdDrink(location.pathname.match(/\d+/g)[0]);
        const drink = dataIdDrinks.drinks[0];
        setFavoriteMealOrDrink(drink);
        setCurrentRecipe(drink);
        const sanitizedDrink = sanitizeRecipe(drink);
        setIdDrinks(Object.entries(sanitizedDrink));
      }
    };
    handleChange();
  }, [location.pathname]);

  const copyLink = () => {
    const local = location.pathname;
    copy(`http://localhost:3000${local}`);
    setCopyRecipe(true);
  };

  const favoriteRecipe = () => {
    setSaveFavorit((prevState) => [...prevState, {
      id: favoritMealOrDrink.idDrink,
      type: 'drink',
      nationality: '',
      category: favoritMealOrDrink.strCategory,
      alcoholicOrNot: favoritMealOrDrink.strAlcoholic,
      name: favoritMealOrDrink.strDrink,
      image: favoritMealOrDrink.strDrinkThumb,
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

  const handleRedirect = () => {
    if (location.pathname.includes('/meals')) {
      history
        .push(`/meals/${location.pathname.match(/\d+/g)[0]}/in-progress`);
    } else { history.push(`/drinks/${location.pathname.match(/\d+/g)[0]}/in-progress`); }
  };
  return (
    <div>
      {idDrinks.length > 0 ? idDrinks.map(
        (element) => {
          switch (element[0]) {
            case 'strDrink':
              return <h1 data-testid="recipe-title">{element[1]}</h1>;
            case 'strDrinkThumb':
              return (<img
                src={element[1]}
                alt="Imagem da receita"
                data-testid="recipe-photo"
                className={styles.recipePhoto}
              />);
            case 'strCategory':
              return <h3 data-testid="recipe-category">{element[1]}</h3>;
            case 'strAlcoholic':
              return <h3 data-testid="recipe-category">{element[1]}</h3>;
            case 'strInstructions':
              return <li data-testid="instructions">{element[1]}</li>;
            default: return null;
          }
        },

      )

        : idMeals.map((element) => {
          switch (element[0]) {
            case 'strMeal':
              return <h1 data-testid="recipe-title">{element[1]}</h1>;
            case 'strMealThumb':
              return (<img
                src={element[1]}
                alt="Imagem da receita"
                data-testid="recipe-photo"
                className={styles.recipePhoto}
              />);
            case 'strCategory':
              return <h3 data-testid="recipe-category">{element[1]}</h3>;
            case 'strInstructions':
              return <li data-testid="instructions">{element[1]}</li>;
            case 'strYoutube':
              return (
                <iframe
                  data-testid="video"
                  width="420"
                  height="315"
                  src={element[1]}
                  title="video"
                />
              );
            default: return null;
          }
        })}
      {ingredientsList.length > 0 && (
        <ul>
          {ingredientsList.map((item, index) => (
            <li
              key={`${item.ingredient}-${index}`}
              data-testid={`${index}-ingredient-name-and-measure`}
            >
              {item.measure ? `${item.ingredient} - ${item.measure}` : item.ingredient}
            </li>
          ))}
        </ul>
      )}
      <button
        data-testid="start-recipe-btn"
        className={styles.buttonStart}
        onClick={handleRedirect}
      >

        Start Recipe
      </button>

      {copyRecipe && <p>Link copied!</p>}
      <button data-testid="share-btn" onClick={copyLink}>
        <img src={shareIcon} alt="Botao de Compartilhar" />
      </button>
      <button data-testid="favorite-btn" onClick={favoriteRecipe}>
        <img src={whiteHeartIcon} alt="Botao de Favoritar" />
      </button>
    </div>
  );
}

export default RecipeDetails;
