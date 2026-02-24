import { useState } from 'react';

// Função para obter o valor inicial do localStorage
const getInitialStoredValue = (key, initialData) => {
  const storedItem = JSON.parse(localStorage.getItem(key));
  return storedItem ?? initialData;
};

// Hook
export default function useLocalStorage(key, initialData) {
  const [storedData, setStoredData] = useState(
    () => getInitialStoredValue(key, initialData),
  );

  // Atualiza estado React e localStorage em uma única chamada.
  const setStorageValue = (data) => {
    setStoredData(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  return [storedData, setStorageValue];
}
