import Notiflix from 'notiflix';
import 'spinkit/spinkit.min.css';
import { fetchBreeds, fetchCatByBreed } from './api';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function populateBreedsSelect(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.text = breed.name;
    breedSelect.appendChild(option);
  });
}

function showCatInfo(cat) {
  catInfo.innerHTML = '';

  const catElements = cat.map(catItem => {
    const { url, breeds } = catItem;

    const catImage = createHTMLElement('img', { src: url });

    const catName = createHTMLElement('h2', { textContent: breeds[0].name });

    const catDescription = createHTMLElement('p', {
      textContent: breeds[0].description,
    });

    return [catImage, catName, catDescription];
  });

  const fragment = document.createDocumentFragment();

  catElements.forEach(elements => {
    elements.forEach(element => {
      fragment.appendChild(element);
    });
  });

  catInfo.appendChild(fragment);
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
    .then(cat => {
      showCatInfo(cat);
    })
    .catch(err => console.error('Помилка отримання інформації про кота:', err))
    .finally(() => {
      loader.style.display = 'none';
      catInfo.style.display = 'block';
    });
});

loader.style.display = 'block';
breedSelect.style.display = 'none';
error.style.display = 'none';

fetchBreeds()
  .then(breeds => {
    populateBreedsSelect(breeds);
    loader.style.display = 'none';
    breedSelect.style.display = 'block';
  })
  .catch(err => {
    console.error('Помилка отримання порід:', err);
    error.style.display = 'block';
    Notiflix.Notify.Failure('Помилка отримання порід');
  });
