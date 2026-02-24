import React from 'react';
import App from '../App';
import Provider from '../context/Provider';
import renderWithRouter from '../services/renderWithRouter';

// Teste de smoke: garante que a aplicação monta sem quebrar.
test('Farewell, front-end', () => {
  // Este arquivo pode ser modificado ou deletado sem problemas
  renderWithRouter(
    <Provider>
      <App />
    </Provider>,
  );
});
