import { useContext, useEffect } from 'react';
import Header from '../components/Header';
import Context from '../context/Context';
import DoneRecipes from '../components/DoneRecipes';

// Página que configura o header e renderiza as receitas já finalizadas.
function Done() {
  const { setTitleHeader, setLoadingSearch } = useContext(Context);

  useEffect(() => {
    setTitleHeader('Done Recipes');
    setLoadingSearch(false);
  }, [setTitleHeader, setLoadingSearch]);

  return (
    <div className="meals">
      <Header />
      <DoneRecipes />
    </div>
  );
}

export default Done;
