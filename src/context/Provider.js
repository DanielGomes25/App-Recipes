import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './Context';

function Provider({ children }) {
  const [titleHeader, setTitleHeader] = useState('Title');
  const [loadingSearch, setLoadingSearch] = useState(true);
  const [textSearch, setTextSearch] = useState('');
  const [recipesSearch, setRecipesSearch] = useState([]);
  const [recipesData, setRecipesData] = useState([]);

  const values = useMemo(
    () => ({
      titleHeader,
      setTitleHeader,
      loadingSearch,
      setLoadingSearch,
      textSearch,
      setTextSearch,
      recipesSearch,
      setRecipesSearch,
      recipesData,
      setRecipesData,
    }),
    [
      titleHeader,
      setTitleHeader,
      loadingSearch,
      setLoadingSearch,
      textSearch,
      setTextSearch,
      recipesSearch,
      setRecipesSearch,
      recipesData,
      setRecipesData,
    ],
  );

  return (
    <Context.Provider value={ values }>
      {children}
    </Context.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Provider;
