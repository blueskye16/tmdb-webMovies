import "./style/style.css";
import $ from "jquery";
import moment from "moment";
const api_key = "api_key=623353059db48f17ef551c106c4c2a4c";
const baseUrl = "https://api.themoviedb.org/3/";
const imgUrl = "https://image.tmdb.org/t/p/w500/";
const tmdbMovie = "https://www.themoviedb.org/movie/";
const formEl = document.querySelector(".card-body");
let page = 1;

const displayTime = () => {
  moment.locale("id");
  $(".time").text(moment().format("LTS"));
  $(".date").text(moment().format("LL"));
};

const updateTime = () => {
  displayTime();
  setTimeout(updateTime, 1000);
};

updateTime();

class WebBar extends HTMLElement {
  constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowDOM.innerHTML = `
      <style>
      :host {
        display: flex;
        background-color: #222831;
        padding: 2px;
        margin: 0px;
        color: white;
      }
      
      h1 {
        padding-left: 25px;
        font-size: 28px;
      }
      </style>
      
      <h1>Explore</h1>
    `;
  }
}

function getMovies(inputData) {
  const srcUrl = `${baseUrl}search/movie?query=${inputData}&page=${page}&${api_key}`;

  fetch(srcUrl)
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.errors) {
        showResponseMessage(responseJson.errors);
      } else {
        renderAllMovies(responseJson.results);
      }
    })
    .catch((error) => {
      showResponseMessage(error.message);
    });
}

function renderAllMovies(movies) {
  const moviesEl = document.querySelector(".src-results");
  moviesEl.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, id } = movie;
    moviesEl.innerHTML += `
      <div class="src-result">
        <img src="${imgUrl + poster_path}" alt="${title}">
        <a href="${tmdbMovie + id}" target="_blank">${title}</a>
      </div>
    `;
  });
}

function showResponseMessage(message = "Check your internet connection") {
  alert(message);
}

function main() {
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const inputData = document.querySelector("#inputMovieTitle").value;
    getMovies(inputData);
  });
}

// toTop of page
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document

customElements.define("web-bar", WebBar);
main();
