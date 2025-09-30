import { useEffect, useState } from 'react';
import styles from './RecipeDetails.module.css';
import { useHistory, useLocation } from 'react-router-dom';
import copy from 'clipboard-copy';
import { FetchIdDrink, FetchIdMeals, allMeals, allDrinks }
  from '../services/APIsFetch';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

function RecipeDetails() {
  const [idDrinks, setIdDrinks] = useState([]);
  const [idMeals, setIdMeals] = useState([]);
  const [recommendationMeals, setRecommendationMeals] = useState([]);
  const [recommendationDrinks, setRecommendationDrinks] = useState([]);
  const [copyRecipe, setCopyRecipe] = useState(false);
  const [favoritMealOrDrink, setFavoriteMealOrDrink] = useState([]);
  const [saveFavorit, setSaveFavorit] = useState([]);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const handleChange = async () => {
      if (location.pathname.includes('/meals')) {
        const recommendationDrink = await allDrinks();
        setRecommendationDrinks(recommendationDrink.drinks);
        const dataIdMeals = await FetchIdMeals((location.pathname.match(/\d+/g))[0]);
        setFavoriteMealOrDrink(dataIdMeals.meals[0]);
        Object.keys(dataIdMeals.meals[0]).forEach((key) => {
          if (
            dataIdMeals.meals[0][key] === null || dataIdMeals.meals[0][key] === '') {
            delete dataIdMeals.meals[0][key];
          }
        });
        setIdMeals(Object.entries(dataIdMeals.meals[0]));
      } else if (location.pathname.includes('/drinks')) {
        const recommendationMeal = await allMeals();
        setRecommendationMeals(recommendationMeal.meals);
        const dataIdDrinks = await FetchIdDrink(location.pathname.match(/\d+/g)[0]);
        setFavoriteMealOrDrink(dataIdDrinks.drinks[0]);
        Object.keys(dataIdDrinks.drinks[0]).forEach((key) => {
          if (
            dataIdDrinks.drinks[0][key] === null || dataIdDrinks.drinks[0][key] === '') {
            delete dataIdDrinks.drinks[0][key];
          }
        });
        setIdDrinks(Object.entries(dataIdDrinks.drinks[0]));
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
    {
      setSaveFavorit((prevState) => [...prevState, {
        id: favoritMealOrDrink.idDrink,
        type: 'drink',
        nationality: '',
        category: favoritMealOrDrink.strCategory,
        alcoholicOrNot: favoritMealOrDrink.strAlcoholic,
        name: favoritMealOrDrink.strDrink,
        image: favoritMealOrDrink.strDrinkThumb,
      }]);
    }
  };

  const measurements = idDrinks.filter((measure) => measure[0].includes('Measure'));
  const ingredients = idDrinks.filter((ingredint) => ingredint[0].includes('Ingredient'));
  const measurementsMeals = idMeals.filter((measure) => measure[0].includes('Measure'));
  const ingredientsMeasl = idMeals
    .filter((ingredint) => ingredint[0].includes('Ingredient'));

  const handleRedirect = () => {
    if (location.pathname.includes('/meals')) {
      history
        .push(`/meals/${location.pathname.match(/\d+/g)[0]}/in-progress`);
    } else { history.push(`/drinks/${location.pathname.match(/\d+/g)[0]}/in-progress`); }
  };
  const magicNumberSix = 6;
  return (
    <div>
      {idDrinks.length > 0 ? idDrinks.map(
        (element) => {
          switch (element[0]) {
          case 'strDrink':
            return <h1 data-testid="recipe-title">{element[1]}</h1>;
          case 'strDrinkThumb':
            return (<img
              src={ element[1] }
              alt="Imagem da receita"
              data-testid="recipe-photo"
              className={ styles.recipePhoto }
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

        : idMeals.map((element, index) => {
          if (element[0].includes('Ingredient')) {
            return (
              <li
                key={ element[0] }
                data-testid={ `${index}-ingredient-name-and-measure` }
              >
                {element[1]}
              </li>

            );
          }
          switch (element[0]) {
          case 'strMeal':
            return <h1 data-testid="recipe-title">{element[1]}</h1>;
          case 'strMealThumb':
            return (<img
              src={ element[1] }
              alt="Imagem da receita"
              data-testid="recipe-photo"
              className={ styles.recipePhoto }
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
                src={ element[1] }
                title="video"
              />
            );
          default: return null;
          }
        })}
      <div>

        {ingredients.map((ingredient, index) => (
          <li
            key={ ingredient[0] }
            data-testid={ `${index}-ingredient-name-and-measure` }
          >
            {`${ingredient[1]} : ${measurements[index][1]}`}
          </li>
        ))}
        ;

      </div>
      <div>

        {ingredientsMeasl.map((ingredien, index) => (
          <li
            key={ ingredien[0] }
            data-testid={ `${index}-ingredient-name-and-measure` }
          >
            {`${ingredien[1]}: ${measurementsMeals[index][1]}`}
          </li>
        ))}
        ;
      </div>
      <div className={ styles.carousel }>
        {

          recommendationMeals.slice(0, magicNumberSix).map((recommendation, index) => (

            <div
              className={ styles.displayCard }
              data-testid={ `${index}-recommendation-card` }
              key={ recommendation.idMeals }
            >
              <h2 data-testid={ `${index}-recommendation-title` }>
                {recommendation.strMeal}

              </h2>
              <img
                src={ recommendation.strMealThumb }
                alt={ recommendation.strArea }
                className={ styles.recommendationImage }
              />
            </div>

          ))
        }
      </div>
      <div className={ styles.carousel }>
        {
          recommendationDrinks.slice(0, magicNumberSix).map((recommendation, index) => (

            <div
              key={ recommendation.idDrink }
              className={ styles.displayCard }
              data-testid={ `${index}-recommendation-card` }
            >

              <h2 data-testid={ `${index}-recommendation-title` }>
                {recommendation.strDrink}

              </h2>
              <img
                src={ recommendation.strDrinkThumb }
                alt={ recommendation.strArea }
                className={ styles.recommendationImage }
              />

            </div>

          ))
        }
      </div>

      <button
        data-testid="start-recipe-btn"
        className={ styles.buttonStart }
        onClick={ handleRedirect }
      >

        Start Recipe
      </button>

      { copyRecipe && <p>Link copied!</p>}
      <button data-testid="share-btn" onClick={ copyLink }>
        <img src={ shareIcon } alt="Botao de Compartilhar" />
      </button>
      <button data-testid="favorite-btn" onClick={ favoriteRecipe }>
        <img src={ whiteHeartIcon } alt="Botao de Favoritar" />
      </button>
    </div>
  );
}

export default RecipeDetails;
