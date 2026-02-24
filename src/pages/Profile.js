import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Context from '../context/Context';

// Página de perfil com atalhos para receitas feitas, favoritas e logout.
function Profile() {
  const { setTitleHeader, setLoadingSearch } = useContext(Context);

  useEffect(() => {
    setTitleHeader('Profile');
    setLoadingSearch(false);
  }, [setTitleHeader, setLoadingSearch]);

  // Recupera email do usuário salvo localmente.
  const getEmail = () => {
    const savedEmail = JSON.parse(localStorage.getItem('user'));
    const storedEmail = savedEmail ? savedEmail.email : '';
    return storedEmail;
  };

  const history = useHistory();

  // Abre a lista de receitas concluídas.
  const doneRecipesRoute = () => {
    history.push('/done-recipes');
  };

  // Abre a lista de receitas favoritas.
  const favoriteRecipesRoute = () => {
    history.push('/favorite-recipes');
  };

  // Limpa sessão local e retorna para a tela de login.
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
