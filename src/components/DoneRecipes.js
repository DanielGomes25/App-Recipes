import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import styles from '../DoneRecipes.module.css';

function DoneRecipes() {
  const [recipesDone, setRecipesDone] = useState([]);
  const [renderRecipes, setRenderRecipes] = useState([]);
  const [copied, setCopied] = useState(false);

  const filterRecipes = (type) => {
    const newArray = recipesDone.filter((element) => element.type === type);
    setRenderRecipes(newArray);
    setCopied(false);
  };

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem('doneRecipes'));
    setRecipesDone(recipes);
    setRenderRecipes(recipes);
  }, [setRecipesDone]);

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <div>
      <button
        data-testid="filter-by-meal-btn"
        onClick={ () => filterRecipes('meal') }
      >
        Meals

      </button>
      <button
        data-testid="filter-by-drink-btn"
        onClick={ () => filterRecipes('drink') }
      >
        Drinks

      </button>
      <button
        data-testid="filter-by-all-btn"
        onClick={ () => setRenderRecipes(recipesDone) }
      >
        All

      </button>
      {renderRecipes && renderRecipes.map((recipe, index) => {
        if (recipe.type === 'drink') {
          return (
            <div key={ recipe.id }>
              <Link to={ `/drinks/${recipe.id}` }>
                <img
                  className={ styles['image-recipe'] }
                  data-testid={ `${index}-horizontal-image` }
                  src={ recipe.image }
                  alt="Imagem da Receita"
                />
              </Link>
              <p data-testid={ `${index}-horizontal-top-text` }>{recipe.category}</p>
              <Link to={ `/drinks/${recipe.id}` }>
                <h4 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h4>
              </Link>
              <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
              <button onClick={ () => copyLink(`http://localhost:3000/drinks/${recipe.id}`) }>
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt="Compartilhar receita"
                />
              </button>

              <p
                data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }
              >
                {recipe.tags[0]}

              </p>
              <p
                data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }
              >
                {recipe.tags[1]}

              </p>

              <p
                data-testid={ `${index}-horizontal-top-text` }
              >
                {recipe.alcoholicOrNot}

              </p>
            </div>
          );
        }

        return (
          <div key={ recipe.id }>
            <Link to={ `/meals/${recipe.id}` }>
              <img
                className={ styles['image-recipe'] }
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt="Imagem da Receita"
              />
            </Link>
            <p
              data-testid={ `${index}-horizontal-top-text` }
            >
              {`${recipe.nationality} - ${recipe.category}`}

            </p>
            <Link to={ `/meals/${recipe.id}` }>
              <h4
                data-testid={ `${index}-horizontal-name` }
              >
                {recipe.name}

              </h4>
            </Link>
            <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
            <button onClick={ () => copyLink(`http://localhost:3000/meals/${recipe.id}`) }>
              <img
                data-testid={ `${index}-horizontal-share-btn` }
                src={ shareIcon }
                alt="Compartilhar receita"
              />

            </button>

            <p
              data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }
            >
              {recipe.tags[0]}

            </p>
            <p
              data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }
            >
              {recipe.tags[1]}

            </p>

          </div>
        );
      })}
      {copied && <p>Link copied!</p>}
    </div>
  );
}

export default DoneRecipes;
