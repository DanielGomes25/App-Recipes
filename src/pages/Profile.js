import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Context from '../context/Context';

function Profile() {
  const { setTitleHeader, setLoadingSearch } = useContext(Context);

  useEffect(() => {
    setTitleHeader('Profile');
    setLoadingSearch(false);
  }, [setTitleHeader, setLoadingSearch]);

  const getEmail = () => {
    const savedEmail = JSON.parse(localStorage.getItem('user'));
    const storedEmail = savedEmail ? savedEmail.email : '';
    return storedEmail;
  };

  const history = useHistory();

  const doneRecipesRoute = () => {
    history.push('/done-recipes');
  };

  const favoriteRecipesRoute = () => {
    history.push('/favorite-recipes');
  };

  const logoutRoute = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="meals">
      <Header />
      <p
        data-testid="profile-email"
      >
        {getEmail()}

      </p>
      <button
        type="button"
        data-testid="profile-done-btn"
        onClick={ doneRecipesRoute }
      >
        Done Recipes
      </button>

      <button
        type="button"
        data-testid="profile-favorite-btn"
        onClick={ favoriteRecipesRoute }
      >
        Favorite Recipes
      </button>

      <button
        type="button"
        data-testid="profile-logout-btn"
        onClick={ logoutRoute }
      >
        Logout
      </button>
      <Footer />
    </div>
  );
}

export default Profile;
