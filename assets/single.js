// Declaration of variables for grabbing elements
var searchResultEl = document.getElementById("movie-box");
var modalBodyEl = document.querySelector(".modal-body");
var modalTitleEl = document.querySelector("#ModalLabel");
var modalFooterEl = document.querySelector(".modal-footer");
var likeButtonEl = document.querySelector("#liked");
var favs = JSON.parse(localStorage.getItem("favs"));
var numResults = document.getElementById("num-results");
var errorMsg = document.getElementById("error-msg");

// Declaring variable or search buttons
let searchButton2 = document.getElementById("search-button2");
let searchInput2 = document.getElementById("search-input2");

// Grabs the passed value from the URL to be used in search function
let queryString = document.location.search;
var getVal = queryString.split("=")[1];

// inputValue variable is dynamically changed throughout the use of the search function on the page
var inputValue = getVal;

// Search count used to determine how many times the search function has been used
let searchCount = 0;

console.log(searchResultEl);

// Kicks off the program by using the initial input value to pass into the getSearchResult function
getSearchResult(inputValue);

// Function gets the id of each movie div display which is the corresponding IMDb ID of each div and passes that
// to another function called openSearchResult
function divClicker() {
  var divsEl = searchResultEl.children;
  console.log(divsEl);
  console.log(divsEl[0]);

  // adds an event listener to each movie div display using for loop and checks if clicked
  for (let i = 0; i < divsEl.length; i++) {
    divsEl[i].addEventListener("click", function (event) {
      event.preventDefault();
      console.log(event.currentTarget);
      var imdbID = event.currentTarget.id;
      openSearchResult(imdbID);
    });
  }
}

// Function gets passed all information needed to be displayed to user and formats it to be displayed in modal
function combineSearch(Title, Year, Type, Poster, imdbID) {
  // checks if the movie div display contains a liked movie by matching ID's, if it does a heart
  // icon will be displayed on the movie display div
  for (let i = 0; i < favs.length; i++) {
    if (imdbID == favs[i]) {
      divHTML =
        '<div class="searchResult heart-card" data-toggle="modal" data-target="#movieModal" id="' +
        imdbID +
        '"> <img src="' +
        Poster +
        '" alt="Movie Poster" width="100%" class="poster"><ul class="description" ><li><strong>' +
        Title +
        "</strong></li> <li>Year: " +
        Year +
        "</li> <li> Type: " +
        Type.charAt(0).toUpperCase() +
        Type.slice(1) +
        '</li></ul><img class = "' +
        imdbID +
        ' heart-ph"id="phIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589054.png" alt="Liked" width="25"></div>';
      return divHTML;
    }
  }
  // If data base does not provide a poster, a placeholder will be added
  if (Poster == "N/A") {
    Poster = "./assets/no-poster.jpeg";
  }
  divHTML =
    '<div class="searchResult" data-toggle="modal" data-target="#movieModal" id="' +
    imdbID +
    '"> <img src="' +
    Poster +
    '" alt="Movie Poster" width="100%" class="poster"><ul class="description" ><li><strong>' +
    Title +
    "</strong></li> <li>Year: " +
    Year +
    "</li> <li> Type: " +
    Type.charAt(0).toUpperCase() +
    Type.slice(1) +
    "</li></ul></div>";
  return divHTML;
}

// If there are no search results this function will determine how to portray which return results haven't
// been displayed
function renderNoResults() {
  if (searchCount == 0) {
    let queryString = document.location.search;
    inputValue = queryString.split("=")[1];
  } else {
    inputValue = searchInput2.value;
  }
  errorMsg.innerHTML = 'There are no results for: "' + inputValue + '"';
}

// This function uses the value that was passed to the page from the URL and appends it to an API URL request
// which will return a JSON object of important information needed to retrieve more data for that desired
// input
function getSearchResult(keyWord) {
  var searchUrl =
    "https://www.omdbapi.com/?apikey=5972139b&r=json&s=" + keyWord;
  // uses a counter to determine how many results have been returned
  var returnLength = 0;
  console.log(searchUrl);
  // sets the div HTML to an empty string
  var divHTML = "";
  fetch(searchUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        if (data.Response == "False") {
          numResults.innerHTML = 0;
          renderNoResults();
        }
        for (let i = 0; i < data.Search.length; i++) {
          var { Title, Year, Type, imdbID, Poster } = data.Search[i];
          // checks to make sure the returned content type is not a game
          if (Type != "game") {
            // calls the combineSearch function to format information
            divHTML = divHTML.concat(
              combineSearch(Title, Year, Type, Poster, imdbID)
            );
            console.log(Title);
            console.log(Year);
            console.log(Type);
            console.log(imdbID);
            console.log(Poster);
            console.log(divHTML);
            //Ups the returnLength everytime a movie div is made
            returnLength++;
          }
        }
        searchResultEl.innerHTML = divHTML;
        searchCount++;
        // Adds the number of results to the page display
        numResults.innerHTML = returnLength;
        console.log(divHTML);
        divClicker();
      });
    }
  });
}

// Function gets the ID from the movie when it's display card is clicked on, pulls that movies info from the movie database and displays it in a pop up modal
function openSearchResult(imdbID) {
  var resultUrl = "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + imdbID;
  console.log(resultUrl);
  fetch(resultUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        var {
          Title,
          Released,
          Type,
          Language,
          Runtime,
          Director,
          Actors,
          Poster,
          Plot,
          Ratings,
        } = data;
        // Youtube API call to find a trailer for a movie with the title, year and type of content
        var trailerURL =
          "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" +
          Title +
          "%20" +
          Released +
          "%20" +
          Type +
          "%20Trailer&key=AIzaSyChqp_YFZL_R5E7abUVSqz6vcQMgvTgu28";
        console.log(trailerURL);
        fetch(trailerURL).then(function (response) {
          if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
              console.log(data.items[0].id.videoId);
              // gets the videos player ID and calls another function to play the trailer
              player.loadVideoById(data.items[0].id.videoId);
            });
          }
        });
        // Displays all content with poster and general information within the modal
        console.log(Ratings);
        var movieScore = "";
        for (let i = 0; i < Ratings.length; i++) {
          movieScore = movieScore.concat(
            "<li><strong>" +
              Ratings[i].Source +
              "</strong>: " +
              Ratings[i].Value +
              "</li>"
          );
          console.log(movieScore);
        }

        if (Poster == "N/A") {
          Poster = "./assets/no-poster.jpeg";
        }
        var showLength = "";
        if (Type == "series") {
          showLength =
            "<li><strong>Total Seasons:</strong> " +
            data.totalSeasons +
            "</li>";
        } else {
          showLength = "<li><strong>Runtime:</strong> " + Runtime + "</li>";
        }
        modalTitleEl.textContent = Title;
        modalBodyEl.innerHTML =
          '<div class="row"><div class="col-sm-12 col-md-5"><img src="' +
          Poster +
          '" alt="Movie Poster" width="100%"></div> <div class="col-sm-12 col-md-7"> <ul id="movie-details"><li><strong>Release Date:</strong> ' +
          Released +
          "</li><li><strong>Type:</strong> " +
          Type.charAt(0).toUpperCase() +
          Type.slice(1) +
          "</li><li><strong>Language:</strong> " +
          Language +
          "</li>" +
          showLength +
          "<li><strong>Director:</strong> " +
          Director +
          "</li><li><strong>Starring:</strong> " +
          Actors +
          "</li>" +
          movieScore +
          "<br><li><strong>Plot: </strong></li><li>" +
          Plot +
          "</li></div></div>";

        // Uses the checkLike function to check if the user has liked the film or not and determines whether to display an empty heart or a red heart
        checkLike(imdbID);
      });
    }
  });
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    width: "auto",
    videoId: "",
    playerVars: {
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //     setTimeout(stopVideo, 6000);
  //     done = true;
  // }
}

function stopVideo() {
  player.stopVideo();
}

$("#movieModal").on("hidden.bs.modal", function () {
  player.stopVideo();
});

// Function checks what Movie ID's are stored in local storage and uses that to determine whether to mark it with a heart to indicate
// favourite or an empty heart to indicate a non favourite
function checkLike(imdbID) {
  favs = JSON.parse(localStorage.getItem("favs"));
  if (favs.includes(imdbID)) {
    likeButtonEl.innerHTML =
      '<img class = "' +
      imdbID +
      '"id="likedIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589054.png" alt="Liked" width="50">';
    return true;
  } else {
    likeButtonEl.innerHTML =
      '<img class = "' +
      imdbID +
      '"id="notlikedIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589197.png" alt="Not Liked" width="50">';
    return false;
  }
}

// Event listener to check whether the like button has been clicked or not
likeButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  var imdbID = likeButtonEl.children[0].className;
  console.log(imdbID);
  if (checkLike(imdbID)) {
    // uses for loop to check through all the favourited ID's
    for (let i = 0; i < favs.length; i++) {
      // if it is in the array when we click the button we are intending to remove the ID and therefore we splice it
      // from the array and update the favs array in local storage
      if (favs[i] == imdbID) {
        favs.splice(i, 1);
        localStorage.setItem("favs", JSON.stringify(favs));
        checkLike(imdbID);
        getSearchResult(inputValue);
        console.log(favs);
        return;
      }
    }
  }
  // otherwise we will add the ID into the favs array and update local storage
  else {
    favs.unshift(imdbID);
    localStorage.setItem("favs", JSON.stringify(favs));
    checkLike(imdbID);
    getSearchResult(inputValue);
    console.log(favs);
  }
});

// event listener for search bar in single-page-html
searchButton2.addEventListener("click", function (event) {
  event.preventDefault();
  // Gets search value from bar
  let newSearchVal = searchInput2.value;
  inputValue = newSearchVal;

  // Clears any error messages
  errorMsg.innerHTML = " ";

  if (!newSearchVal) {
    return 0;
  }

  // Kicks off search function again
  getSearchResult(newSearchVal);
});
