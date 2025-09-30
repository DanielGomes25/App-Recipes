import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import Context from '../context/Context';
import SearchBar from './SearchBar';

function Header() {
  const { titleHeader, loadingSearch, textSearch, setTextSearch } = useContext(Context);
  const [searchInput, setSearchInput] = useState(false);

  const searchOnClick = () => {
    if (searchInput) {
      setSearchInput(false);
    } else {
      setSearchInput(true);
    }
  };

  return (
    <div className={ styles.header }>
      <div className={ styles.actions }>
        <Link to="/profile">
          <img
            data-testid="profile-top-btn"
            src={ profileIcon }
            alt="Profile Icon"
          />
        </Link>
        {loadingSearch && (
          <button onClick={ searchOnClick }>
            <img
              data-testid="search-top-btn"
              src={ searchIcon }
              alt="Search Icon"
            />
          </button>
        )}
        {searchInput && (
          <input
            className={ styles.searchInput }
            type="text"
            data-testid="search-input"
            value={ textSearch }
            onChange={ ({ target }) => setTextSearch(target.value) }
          />
        )}
      </div>
      <h2 data-testid="page-title" className={ styles.title }>{titleHeader}</h2>
      <SearchBar />
    </div>
  );
}

export default Header;
