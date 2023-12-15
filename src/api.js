import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_rn81S0WQPrMxUwuMHj8VnUr6pJKvu0XfKTpYntSXNQ4AjYOHpCIP4bmPRYJE2ERU';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds');
}

export function fetchCatByBreed(breedId) {
  return axios.get(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
  );
}
