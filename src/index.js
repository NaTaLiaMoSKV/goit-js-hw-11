import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayApiService } from './api-service';

const galleryContainer = document.querySelector('.gallery');
const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const apiService = new PixabayApiService();

form.addEventListener('submit', onformSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function onformSubmit(e) {
  e.preventDefault();

  clearGalleryContainer();
  hideLoadMoreBtn();

  apiService.searchQuery = e.target.elements[0].value;
  apiService.resetPage();
  const dataImg = await apiService.fetchImages();

  if(dataImg.hits.length === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  addCardsMarkup(dataImg);
  if(isCollectionFinished(dataImg)) return;
  else Notiflix.Notify.success(`Hooray! We found ${dataImg.totalHits} images.`);
  showLoadMoreBtn();
}

async function onLoadMoreBtn() {
  const newDataImg = await apiService.fetchImages();
  addCardsMarkup(newDataImg);
  if (isCollectionFinished(newDataImg)) return;
}

function addCardsMarkup(dataImg) {
  const cardsMarkup = createCardsMarkup(dataImg.hits);
  galleryContainer.insertAdjacentHTML('beforeend', cardsMarkup);
  const lightbox = new SimpleLightbox('.photo-card a', {});
}

function isCollectionFinished(dataImg) {
  if (apiService.countImages() >= dataImg.totalHits) {
    hideLoadMoreBtn();
    Notiflix.Notify.info('We\'re sorry, but you\'ve reached the end of search results.');
    return true;
  } return false;
}

function createCardsMarkup(cards) {
  return cards.map( ({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    return  `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>
  `;
  }).join('');
}

function clearGalleryContainer() {
  galleryContainer.innerHTML = '';
}

function showLoadMoreBtn() {
  if(loadMoreBtn.classList.contains('is-hidden')) {
    loadMoreBtn.classList.remove('is-hidden');
  }
}

function hideLoadMoreBtn() {
  if(!loadMoreBtn.classList.contains('is-hidden')) {
    loadMoreBtn.classList.add('is-hidden');
  }
}
