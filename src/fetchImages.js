import axios from 'axios';

export async function fetchImages(userInput, page) {
  const parameters = {
    key: '34888467-996768132fcbcd381981e54b0',
    q: userInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  };

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: parameters,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
