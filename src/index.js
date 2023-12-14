import axios from 'axios';
import SlimSelect from 'slim-select';
import 'loaders.css/loaders.min.css';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_rn81S0WQPrMxUwuMHj8VnUr6pJKvu0XfKTpYntSXNQ4AjYOHpCIP4bmPRYJE2ERU';

const breedSelect = new SlimSelect({
  select: '.breed-select',
  placeholder: 'Select Cat Breed',
});

const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function fetchBreeds() {
  loader.style.display = 'block';
  breedSelect.slim.hide();

  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .then(breeds => {
      breeds.forEach(breed => {
        breedSelect.add(breed.name, breed.id);
      });
    })
    .catch(handleError)
    .finally(() => {
      loader.style.display = 'none';
      breedSelect.slim.show();
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

  Notify.failure('An error occurred. Please try again later.');
}

breedSelect.slim.data.placeholder.textContent = 'Select Cat Breed';
breedSelect.slim.data.searchPlaceholder.textContent = 'Search breeds...';

breedSelect.slim.data.search.addEventListener('input', function (event) {
  const query = event.target.value.toLowerCase();

  breedSelect.slim.data.optgroup.forEach(optgroup => {
    const filteredOptions = optgroup.options.filter(option =>
      option.textContent.toLowerCase().includes(query)
    );

    if (filteredOptions.length > 0) {
      breedSelect.slim.set(optgroup, filteredOptions);
    } else {
      breedSelect.slim.set(optgroup, []);
    }
  });
});

breedSelect.slim.data.select.addEventListener('change', function () {
  const selectedBreedId = breedSelect.slim.data.getSelectedValue();
  if (selectedBreedId) {
    fetchCatByBreed(selectedBreedId);
  }
});

fetchBreeds();
