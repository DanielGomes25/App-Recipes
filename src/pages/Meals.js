import { useContext, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Context from '../context/Context';
import Recipes from '../components/Recipes';

function Meals() {
  const { setTitleHeader, setLoadingSearch } = useContext(Context);

  useEffect(() => {
    setTitleHeader('Meals');
    setLoadingSearch(true);
  }, [setTitleHeader, setLoadingSearch]);

  return (
    <div className="meals">
      <Header />
      <Recipes />
      <Footer />
    </div>
  );
}

export default Meals;
