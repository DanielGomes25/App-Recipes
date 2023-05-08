import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Profile from './pages/Profile';
import Done from './pages/Done';
import Favorites from './pages/Favorites';
import Meals from './pages/Meals';
import Drinks from './pages/Drinks';
import MealsDetails from './pages/MealsDetails';
import DrinksDetails from './pages/DrinksDetails';
import DrinksProgress from './pages/DrinksProgress';
import MealsProgress from './pages/MealsProgress';

function App() {
  return (
    <Switch>
      <Route exact path="/meals" component={ Meals } />
      <Route exact path="/drinks" component={ Drinks } />
      <Route exact path="/meals/:id-da-receita" component={ MealsDetails } />
      <Route exact path="/drinks/:id-da-receita" component={ DrinksDetails } />
      <Route exact path="/meals/:id-da-receita/in-progress" component={ MealsProgress } />
      <Route
        exact
        path="/drinks/:id-da-receita/in-progress"
        component={ DrinksProgress }
      />
      <Route exact path="/profile" component={ Profile } />
      <Route exact path="/done-recipes" component={ Done } />
      <Route exact path="/favorite-recipes" component={ Favorites } />
      <Route exact path="/" component={ Login } />
    </Switch>
  );
}

export default App;
