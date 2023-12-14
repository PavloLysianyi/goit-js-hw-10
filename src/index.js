import axios from 'axios';
import SlimSelect from 'slim-select';

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
    .then(breeds => {
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.text = breed.name;
        breedSelect.add(option);
      });
    })
    .catch(handleError)
    .finally(() => {
      loader.style.display = 'none';
      breedSelect.style.display = 'block';
    });
}

function fetchCatByBreed(breedId) {
  loader.style.display = 'block';
  catInfo.style.display = 'none';
  error.style.display = 'none';

  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0])
    .then(catData => {
      const image = document.createElement('img');
      image.src = catData.url;

      const breedName = document.createElement('h2');
      breedName.textContent = catData.breeds[0].name;

      const description = document.createElement('p');
      description.textContent = catData.breeds[0].description;

      const temperament = document.createElement('p');
      temperament.textContent = `Temperament: ${catData.breeds[0].temperament}`;

      catInfo.innerHTML = '';
      catInfo.appendChild(image);
      catInfo.appendChild(breedName);
      catInfo.appendChild(description);
      catInfo.appendChild(temperament);
    })
    .catch(handleError)
    .finally(() => {
      loader.style.display = 'none';
      catInfo.style.display = 'block';
    });
}

function handleError(error) {
  loader.style.display = 'none';
  error.style.display = 'block';
  console.error('Error:', error);
}

breedSelect.addEventListener('change', function () {
  const selectedBreedId = this.value;
  if (selectedBreedId) {
    fetchCatByBreed(selectedBreedId);
  }
});

fetchBreeds();

fetchBreeds().then(() => {
  new SlimSelect({
    select: '.breed-select',
    placeholder: 'Select Cat Breed',
  });
});
