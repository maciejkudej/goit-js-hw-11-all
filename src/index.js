import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';

Notiflix.Notify.init({
  width: '280px',
  position: 'center-top',
  distance: '90px',
  timeout: 2000,
});

const searchInput = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
const inputForm = document.querySelector('input');

searchInput.addEventListener('submit', searchImages);
buttonLoadMore.addEventListener('click', loadMore);

buttonLoadMore.style.display = 'none';

let page = 1;
let userInput = '';
let hits = 0;

async function searchImages(e) {
  e.preventDefault();
  clearGallery();
  hideLoadMoreButton();

  try {
    userInput = inputForm.value.trim();
    page = 1;

    if (!userInput) {
      return;
    }

    const response = await fetchImages(userInput, page);
    hits = response.hits.length;

    if (response.totalHits > 40) {
      showLoadMoreButton();
    }

    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

      renderGallery(response.hits);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadMore() {
  page += 1;

  try {
    const response = await fetchImages(userInput, page);
    renderGallery(response.hits);

    hits += response.hits.length;
    if (hits === response.totalHits) {
      hideLoadMoreButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function showLoadMoreButton() {
  buttonLoadMore.style.display = 'block';
}

function hideLoadMoreButton() {
  buttonLoadMore.style.display = 'none';
}

function clearGallery() {
  gallery.innerHTML = '';
  hits = 0;
}

function renderGallery(hits) {
  const galleryMarkup = hits
    .map(hit => {
      return `<div class="photo-card">
        <a class="gallery__item" href="${hit.largeImageURL}" rel="noopener noreferrer">
          <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b><p>${hit.likes}</p>
            </p>
            <p class="info-item">
              <b>Views</b><p>${hit.views}</p>
            </p>
            <p class="info-item">
              <b>Comments</b><p>${hit.comments}</p>
            </p>
            <p class="info-item">
              <b>Downloads</b><p>${hit.downloads}</p>
            </p>
          </div>
        </a>
      </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  simpleLightbox.refresh();
}

const simpleLightbox = new SimpleLightbox('.gallery a ', {
  captionsData: 'alt',
  captionDelay: 250,
});
