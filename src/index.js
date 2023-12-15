import Notiflix from 'notiflix';
import 'spinkit/spinkit.min.css';
import { fetchBreeds, fetchCatByBreed } from './api';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function populateBreedsSelect(breeds) {
  breedSelect.innerHTML = breeds
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join('');
}

function showCatInfo(cat) {
  catInfo.innerHTML = cat
    .map(({ url, breeds }) => {
      const { name, description } = breeds[0];
      return `
        <div>
          <img src="${url}">
          <h2>${name}</h2>
          <p>${description}</p>
        </div>
      `;
    })
    .join('');
}

function createHTMLElement(tag, attributes) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attributes)) {
    element[key] = value;
  }

  return element;
}

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;

  loader.style.display = 'block';
  catInfo.style.display = 'none';
  error.style.display = 'none';

  fetchCatByBreed(selectedBreedId)
    .then(({ data }) => {
      showCatInfo(data);
    })
    .finally(() => {
      loader.style.display = 'none';
      catInfo.style.display = 'block';
    });
});

loader.style.display = 'block';
breedSelect.style.display = 'none';
error.style.display = 'none';

fetchBreeds()
  .then(({ data: breeds }) => {
    populateBreedsSelect(breeds);
    loader.style.display = 'none';
    breedSelect.style.display = 'block';
  })
  .catch(err => {
    console.error('Помилка отримання порід:', err);
    error.style.display = 'block';
    Notiflix.Notify.Failure('Помилка отримання порід');
  });
