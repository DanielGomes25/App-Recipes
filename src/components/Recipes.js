import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Recipes.module.css';
import {
  allMeals,
  allDrinks,
  getCategories,
  mealCategoryFetch,
  drinkCategoryFetch,
} from '../services/APIsFetch';

export default function Recipes() {
  // Guarda as receitas que serão exibidas na tela
  const [recipesData, setRecipesData] = useState([]);

  // Guarda as categorias (Beef, Chicken, etc)
  const [category, setCategory] = useState([]);

  // Guarda a categoria selecionada
  const [specificCategory, setSpecificCategory] = useState('');

  // Estado para controlar o carregamento de dados
  const [loading, setLoading] = useState(true);

  // Limite de receitas exibidas
  const maxLength = 12;

  // Limite de categorias exibidas
  const maxCategory = 5;

  // Permite acessar a rota atual (/meals ou /drinks)
  const history = useHistory();

  // Função que busca todas as receitas
  const getRecipes = useCallback(async () => {
    setLoading(true);
    let response;
    if (history.location.pathname === '/meals') {
      response = await allMeals();
      setRecipesData(response.meals.slice(0, maxLength));
    } else if (history.location.pathname === '/drinks') {
      response = await allDrinks();
      setRecipesData(response.drinks.slice(0, maxLength));
    }
    setLoading(false);
  }, [history.location.pathname]);

  // Função que busca categorias
  const fetchCategories = async () => {
    let response;
    if (history.location.pathname === '/meals') {
      response = await mealCategoryFetch();
      setCategory(response.meals.slice(0, maxCategory));
    } else if (history.location.pathname === '/drinks') {
      response = await drinkCategoryFetch();
      setCategory(response.drinks.slice(0, maxCategory));
    }
  };

  useEffect(() => {
    getRecipes();
    fetchCategories();
  }, [history.location.pathname, getRecipes]);

  // Função que retorna qual servidor usar para as APIs
  const serverParameter = useCallback(() => {
    if (history.location.pathname === '/meals') {
      return 'themealdb';
    }
    if (history.location.pathname === '/drinks') {
      return 'thecocktaildb';
    }
  }, [history.location.pathname]);

  // Função para buscar receitas por categoria
  const fetchCategory = useCallback(async (categoryName) => {
    if (!categoryName) return;
    setSpecificCategory(categoryName);
    const categories = await getCategories(serverParameter(), categoryName);
    if (history.location.pathname === '/meals') {
      setRecipesData(categories.meals.slice(0, maxLength));
    } else if (history.location.pathname === '/drinks') {
      setRecipesData(categories.drinks.slice(0, maxLength));
    }
  }, [serverParameter, history.location.pathname]);

  // Roda quando a categoria muda
  useEffect(() => {
    if (specificCategory) {
      fetchCategory(specificCategory);
    } else {
      fetchCategory('');
    }
  }, [specificCategory, fetchCategory]);

  // Componente para renderizar o card da receita
  const RecipeCard = ({ recipe, index, isMeal }) => (
    <div className={styles.card} key={index} data-testid={`${index}-recipe-card`}>
      <h2 className={styles.cardTitle} data-testid={`${index}-card-name`}>
        {isMeal ? recipe.strMeal : recipe.strDrink}
      </h2>
      <img
        data-testid={`${index}-card-img`}
        src={isMeal ? recipe.strMealThumb : recipe.strDrinkThumb}
        alt={isMeal ? recipe.strMeal : recipe.strDrink}
      />
    </div>
  );

  return (
    <div className={styles.wrapper}>
      {/* Título */}
      <h1>Recipes</h1>

      {/* Container das categorias */}
      <div className={styles.categories}>
        {category.map((e) => (
          <div key={e.strCategory}>
            <button
              type="button"
              data-testid={`${e.strCategory}-category-filter`}
              onClick={() => fetchCategory(e.strCategory)}
            >
              {e.strCategory}
            </button>
          </div>
        ))}
      </div>

      {/* Botão para mostrar todas as receitas */}
      <button data-testid="All-category-filter" onClick={getRecipes}>
        All
      </button>

      {/* Indicador de carregamento */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.grid}>
          {recipesData.map((e, index) => (
            <RecipeCard
              key={index}
              index={index}
              recipe={e}
              isMeal={history.location.pathname === '/meals'}
            />
          ))}
        </div>
      )}
    </div>
  );
}