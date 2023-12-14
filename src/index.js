import axios from 'axios';
import Notiflix from 'notiflix';
import '../node_modules/spinkit/spinkit.min.css';

axios.defaults.headers.common['x-api-key'] =
  'live_rn81S0WQPrMxUwuMHj8VnUr6pJKvu0XfKTpYntSXNQ4AjYOHpCIP4bmPRYJE2ERU';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function fetchBreeds() {
  loader.style.display = 'block';
  breedSelect.style.display = 'none';
  error.style.display = 'none';

  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .finally(() => {
      loader.style.display = 'none';
      breedSelect.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching breeds:', error);
      error.style.display = 'block';
      Notiflix.Notify.Failure('Error fetching breeds');
      throw error;
    });
}

function fetchCatByBreed(breedId) {
  loader.style.display = 'block';
  catInfo.style.display = 'none';
  error.style.display = 'none';

  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .finally(() => {
      loader.style.display = 'none';
      catInfo.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching cat by breed:', error);
      error.style.display = 'block';
      Notiflix.Notify.Failure('Error fetching cat by breed');
      throw error;
    });
}

function populateBreedsSelect(breeds) {
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.text = breed.name;
    breedSelect.appendChild(option);
  });
}

function showCatInfo(cat) {
  const catImage = document.createElement('img');
  catImage.src = cat[0].url;

  const catName = document.createElement('h2');
  catName.textContent = cat[0].breeds[0].name;

  const catDescription = document.createElement('p');
  catDescription.textContent = cat[0].breeds[0].description;

  catInfo.innerHTML = '';

  catInfo.appendChild(catImage);
  catInfo.appendChild(catName);
  catInfo.appendChild(catDescription);
}

breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;

  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      showCatInfo(cat);
    })
    .catch(err => console.error('Error fetching cat info:', err));
});

fetchBreeds()
  .then(breeds => populateBreedsSelect(breeds))
  .catch(err => console.error('Error fetching breeds:', err));
