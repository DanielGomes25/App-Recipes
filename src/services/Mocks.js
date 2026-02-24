export const mockMeals = {
  meals:
    [
      {
        strMeal: 'Brown Stew Chicken',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg',
        idMeal: '52940',
      }],
  drinks:
      [
        {
          strDrink: 'Brown Stew Chicken',
          strDrinkThumb: 'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg',
          idDrink: '52940',
        }],
};

export const mockFavRecipe = [
  {
    id: '52940',
    type: 'meal',
    nationality: 'italian',
    category: 'Vegetarian',
    alcoholicOrNot: '',
    name: 'Vegan Chocolate Cake',
    image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
  },
  {
    id: '13286',
    type: 'drink',
    nationality: '',
    category: '',
    alcoholicOrNot: 'Alcoholic',
    name: 'Margarita',
    image: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
  },
];

// Simula o fluxo de compartilhamento usado nos testes de favoritas.
export const handleShareBtn = (element) => {
  navigator.clipboard.writeText(`http://localhost:3000${element}`);
  setAlert(true);
  const duration = 3000;
  setTimeout(() => {
    setAlert(false);
  }, duration);
  global.alert('Link copied!');
};
