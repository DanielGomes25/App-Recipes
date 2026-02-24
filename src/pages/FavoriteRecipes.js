import React, { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Context from '../context/Context';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import styles from '../styles/FavoritesRecipes.module.css';

// Página de receitas favoritas com filtros, compartilhamento e remoção.
function FavoriteRecipes() {
  const { setTitleHeader, setLoadingSearch } = useContext(Context);
  const [alert, setAlert] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [recipeFilter, setRecipeFilter] = useState('All');

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (storedFavorites && storedFavorites.length > 0) {
      return;
    }
    const mockRecipes = [{
      id: '52771',
      type: 'meal',
      nationality: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: 'Alcoholic',
      name: 'Spicy Arrabiata Penne',
      image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
    },
    {
      id: '178319',
      type: 'drink',
      nationality: 'Italian',
      category: 'Vegetarian',
      alcoholicOrNot: 'Alcoholic',
      name: 'Aquamarine',
      image: 'https://www.thecocktaildb.com/images/media/drink/zvsre31572902738.jpg',
    }];
    localStorage.setItem('favoriteRecipes', JSON.stringify(mockRecipes));
  }, []);

  // Carrega favoritos do localStorage e sincroniza estados da página.
  const getFavoriteRecipes = useCallback(() => {
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipesStorage) {
      setRecipeFilter(favoriteRecipesStorage);
      setFavoriteRecipes(favoriteRecipesStorage);
    }
  }, [setRecipeFilter]);

  useMemo(() => {
    getFavoriteRecipes();
  }, [getFavoriteRecipes]);

  useEffect(() => {
    setTitleHeader('Favorite Recipes');
    setLoadingSearch(false);
    getFavoriteRecipes();
  }, [setTitleHeader, setLoadingSearch, setFavoriteRecipes, getFavoriteRecipes]);

  // Aplica filtro da lista por tipo de receita.
  const handleFilter = (filter) => {
    if (filter === 'All') {
      setFavoriteRecipes(recipeFilter);
    } else if (filter === 'meal') {
      setFavoriteRecipes(recipeFilter.filter((recipe) => recipe.type === 'meal'));
    } else {
      setFavoriteRecipes(recipeFilter.filter((recipe) => recipe.type === 'drink'));
    }
  };

  // Remove receita da lista exibida e persiste no localStorage.
  const handleRemoveFavorite = (index) => {
    const spliceFavorite = [...favoriteRecipes].toSpliced(index, 1);
    setFavoriteRecipes(spliceFavorite);
    localStorage.setItem('favoriteRecipes', JSON.stringify(spliceFavorite));
  };

  // Copia link da receita e exibe feedback visual ao usuário.
  const handleShareBtn = (element) => {
    navigator.clipboard.writeText(`http://localhost:3000${element}`);
    setAlert(true);
    const duration = 3000;
    setTimeout(() => {
      setAlert(false);
    }, duration);
    global.alert('Link copied!');
  };

  console.log(favoriteRecipes);
  return (
    <div className="meals">
      <Header />
      <div className={ styles.filters }>
        <button
          type="button"
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilter('All') }
          className={ styles.filterButton }
        >
          All
        </button>
        <button
          type="button"
          data-testid="filter-by-meal-btn"
          onClick={ () => handleFilter('meal') }
          className={ styles.filterButton }
        >
          Meals
        </button>
        <button
          type="button"
          data-testid="filter-by-drink-btn"
          onClick={ () => handleFilter('Drinks') }
          className={ styles.filterButton }
        >
          Drinks
        </button>
      </div>
      <div className={ styles.grid }>
        {favoriteRecipes.map((recipe, index) => (
          <div key={ index } className={ styles.card }>
            <p className={ styles.meta }>{recipe.type}</p>
            <p data-testid={ `${index}-horizontal-top-text` } className={ styles.meta }>
              {recipe.type === 'meal'
                ? `${recipe.nationality} - ${recipe.category}`
                : `${recipe.alcoholicOrNot}`}
            </p>
            <Link
              to={ recipe.type === 'meal'
                ? `/meals/${recipe.id}` : `/drinks/${recipe.id}` }
              className={ styles.cardLink }
            >
              <p data-testid={ `${index}-horizontal-name` } className={ styles.title }>
                {recipe.name}
              </p>
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt={ recipe.name }
                className={ styles['favorite-recipe-img'] }
              />
            </Link>
            <div className={ styles.actions }>
              <button
                type="button"
                src={ shareIcon }
                data-testid={ `${index}-horizontal-share-btn` }
                onClick={ () => handleShareBtn(
                  recipe.type === 'meal'
                    ? `/meals/${recipe.id}` : `/drinks/${recipe.id}`,
                ) }
                className={ styles.iconButton }
              >
                <img
                  src={ shareIcon }
                  alt="Share Icon"
                />
              </button>
              <button
                type="button"
                src={ blackHeartIcon }
                data-testid={ `${index}-horizontal-favorite-btn` }
                onClick={ () => handleRemoveFavorite(index) }
                className={ styles.iconButton }
              >
                <img
                  src={ blackHeartIcon }
                  alt="Favorite Icon"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
      {alert && <p>Link copied!</p>}
    </div>
  );
}

export default FavoriteRecipes;
