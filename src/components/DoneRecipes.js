import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import styles from './DoneRecipes.module.css';

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
    const recipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    setRecipesDone(recipes);
    setRenderRecipes(recipes);
  }, [setRecipesDone]);

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  return (
    <div>
      <div className={ styles.filters }>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ () => filterRecipes('meal') }
          className={ styles.filterButton }
        >
          Meals
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ () => filterRecipes('drink') }
          className={ styles.filterButton }
        >
          Drinks
        </button>
        <button
          data-testid="filter-by-all-btn"
          onClick={ () => setRenderRecipes(recipesDone) }
          className={ styles.filterButton }
        >
          All
        </button>
      </div>
      <div className={ styles.grid }>
        {renderRecipes && renderRecipes.map((recipe, index) => {
          if (recipe.type === 'drink') {
            return (
              <div key={ recipe.id } className={ styles.card }>
                <Link to={ `/drinks/${recipe.id}` }>
                  <img
                    className={ styles['image-recipe'] }
                    data-testid={ `${index}-horizontal-image` }
                    src={ recipe.image }
                    alt="Imagem da Receita"
                  />
                </Link>
                <p
                  data-testid={ `${index}-horizontal-top-text` }
                  className={ styles.meta }
                >
                  {recipe.category}
                </p>
                <Link to={ `/drinks/${recipe.id}` }>
                  <h4
                    data-testid={ `${index}-horizontal-name` }
                    className={ styles.title }
                  >
                    {recipe.name}
                  </h4>
                </Link>
                <p
                  data-testid={ `${index}-horizontal-done-date` }
                  className={ styles.date }
                >
                  {recipe.doneDate}
                </p>
                <button
                  onClick={ () => copyLink(`http://localhost:3000/drinks/${recipe.id}`) }
                  className={ styles.shareButton }
                >
                  <img
                    data-testid={ `${index}-horizontal-share-btn` }
                    src={ shareIcon }
                    alt="Compartilhar receita"
                  />
                </button>

                <div className={ styles.tags }>
                  {recipe.tags[0] && (
                    <span
                      data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }
                      className={ styles.tag }
                    >
                      {recipe.tags[0]}
                    </span>
                  )}
                  {recipe.tags[1] && (
                    <span
                      data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }
                      className={ styles.tag }
                    >
                      {recipe.tags[1]}
                    </span>
                  )}
                </div>

                <p
                  data-testid={ `${index}-horizontal-top-text` }
                  className={ styles.meta }
                >
                  {recipe.alcoholicOrNot}
                </p>
              </div>
            );
          }

          return (
            <div key={ recipe.id } className={ styles.card }>
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
                className={ styles.meta }
              >
                {`${recipe.nationality} - ${recipe.category}`}

              </p>
              <Link to={ `/meals/${recipe.id}` }>
                <h4
                  data-testid={ `${index}-horizontal-name` }
                  className={ styles.title }
                >
                  {recipe.name}

                </h4>
              </Link>
              <p
                data-testid={ `${index}-horizontal-done-date` }
                className={ styles.date }
              >
                {recipe.doneDate}
              </p>
              <button
                onClick={ () => copyLink(`http://localhost:3000/meals/${recipe.id}`) }
                className={ styles.shareButton }
              >
                <img
                  data-testid={ `${index}-horizontal-share-btn` }
                  src={ shareIcon }
                  alt="Compartilhar receita"
                />

              </button>

              <div className={ styles.tags }>
                {recipe.tags[0] && (
                  <span
                    data-testid={ `${index}-${recipe.tags[0]}-horizontal-tag` }
                    className={ styles.tag }
                  >
                    {recipe.tags[0]}
                  </span>
                )}
                {recipe.tags[1] && (
                  <span
                    data-testid={ `${index}-${recipe.tags[1]}-horizontal-tag` }
                    className={ styles.tag }
                  >
                    {recipe.tags[1]}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {copied && <p>Link copied!</p>}
    </div>
  );
}

export default DoneRecipes;
