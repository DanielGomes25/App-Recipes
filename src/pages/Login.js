import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [disableButton, setDisableButton] = useState(false);

  const validateForm = () => {
    const emailValidate = userInfo.email.includes('.com');
    // const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i;
    const PASSWORD_LENGTH = 6;
    // const checkEmail = regexEmail.test(userInfo.email);
    const checkPassword = userInfo.password.length >= PASSWORD_LENGTH;
    if (checkPassword && emailValidate) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo((preveState) => ({ ...preveState, [name]: value }));
    validateForm();
  };
  const history = useHistory();
  const mealsRoute = () => {
    history.push('/meals');
  };

  const saveInStorage = () => {
    const user = userInfo.email;
    localStorage
      .setItem('user', JSON.stringify({ email: user }));
    mealsRoute();
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div>
          <h1 className="login-title">Bem vindo</h1>
          <p className="login-subtitle">Entre para acessar suas receitas.</p>
        </div>
        <form>
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              data-testid="email-input"
              onChange={ handleChange }
              value={ userInfo.email }
              name="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              data-testid="password-input"
              onChange={ handleChange }
              value={ userInfo.password }
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            data-testid="login-submit-btn"
            disabled={ !disableButton }
            onClick={ saveInStorage }
            className="login-button"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
