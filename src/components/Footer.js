import React from 'react';
import { useHistory } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';

// Barra inferior com atalhos de navegação para Meals e Drinks.
export default function Footer() {
  const history = useHistory();

  // Redireciona para a listagem de bebidas.
  const redirectToDrinks = () => {
    history.push('/drinks');
  };

  // Redireciona para a listagem de comidas.
  const redirectToMeals = () => {
    history.push('/meals');
  };

  return (
    <footer
      data-testid="footer"
    >
      <button
        type="button"
        data-testid="drinks-bottom-btn"
        src={ drinkIcon }
        onClick={ redirectToDrinks }
      >
        <img src={ drinkIcon } alt="drinks" />
      </button>
      <button
        type="button"
        data-testid="meals-bottom-btn"
        src={ mealIcon }
        onClick={ redirectToMeals }
      >
        <img src={ mealIcon } alt="meals" />
      </button>
    </footer>
  );
}
