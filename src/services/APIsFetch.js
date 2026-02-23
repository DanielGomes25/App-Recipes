export const ingredientFetchMeal = async (ingredientMeal) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientMeal}`);
  const data = await response.json();
  return data;
};

export const nameFetchMeal = async (nameMeal) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nameMeal}`);
  const data = await response.json();
  return data;
};

export const firsLetterFetchMeal = async (firstLetterMeal) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetterMeal}`);
  const data = await response.json();
  return data;
};

export const ingredientFetchDrink = async (ingredientDrink) => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientDrink}`);
  const data = await response.json();
  return data;
};

export const nameFetchDrink = async (nameDrink) => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nameDrink}`);
  const data = await response.json();
  return data;
};

export const firsLetterFetchDrink = async (firstLetterDrink) => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${firstLetterDrink}`);
  const data = await response.json();
  return data;
};

export const FetchIdDrink = async (id) => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data;
};

export const allMeals = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();
  return data;
};

export const FetchIdMeals = async (id) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data;
};

export const allDrinks = async () => {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
  const data = await response.json();
  console.log(data);
  return data;
};

export const getCategories = async (server, categoryName) => {
  const url = `https://www.${server}.com/api/json/v1/1/filter.php?c=${categoryName}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const mealCategoryFetch = async () => {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
  const data = await response.json();
  return data;
};

export const drinkCategoryFetch = async () => {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
  const data = await response.json();
  return data;
};
