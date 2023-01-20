const axios = require('axios').default;
const API_KEY = '32970043-afcc677e938f183a59875dbcc';
const BASE_URL = 'https://pixabay.com/api/';

export class PixabayApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
    } 

    fetchImages() {
        return axios.get(`${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`)
        .then(function (response) {
        return response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(
            this.page +=1
        )
    }

    countImages() {
        return (this.page - 1) * this.perPage;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}