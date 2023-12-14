import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_rn81S0WQPrMxUwuMHj8VnUr6pJKvu0XfKTpYntSXNQ4AjYOHpCIP4bmPRYJE2ERU';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function fetchBreeds() {
  return axios
    .get('https://api.thecatapi.com/v1/breeds')
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching breeds:', error);
      throw error;
    });
}

function fetchCatByBreed(breedId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching cat by breed:', error);
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

  // Clear previous cat info
  catInfo.innerHTML = '';

  // Append new cat info
  catInfo.appendChild(catImage);
  catInfo.appendChild(catName);
  catInfo.appendChild(catDescription);
}

// Event listener for breed select change
breedSelect.addEventListener('change', () => {
  const selectedBreedId = breedSelect.value;

  // Show loader while fetching cat info
  loader.style.display = 'block';
  catInfo.style.display = 'none';
  error.style.display = 'none';

  // Fetch cat info by breed
  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      // Hide loader on successful fetch
      loader.style.display = 'none';
      catInfo.style.display = 'block';

      // Display cat info
      showCatInfo(cat);
    })
    .catch(err => {
      // Hide loader and display error on failed fetch
      loader.style.display = 'none';
      error.style.display = 'block';
      console.error('Error fetching cat info:', err);
    });
});

// Fetch and populate breeds on page load
fetchBreeds()
  .then(breeds => populateBreedsSelect(breeds))
  .catch(err => console.error('Error fetching breeds:', err));
