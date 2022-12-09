// Declaration of variables
let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
var modalTitleEl = document.querySelector("#ModalLabel");
var modalBodyEl = document.querySelector(".modal-body");
var likeButtonEl = document.querySelector("#liked");

// Event listener for the search button to be clicked, passes the value in the search input to the next page
searchButton.addEventListener("click", function (event) {
  event.preventDefault();
  let searchVal = searchInput.value;

  if (!searchVal) {
    return 0;
  }
  window.location.replace("./single-page.html?q=" + searchVal);
});

// Populates the favs array with the stored values in local storage to be used for favourited movies
var favs = JSON.parse(localStorage.getItem("favs"));
// Sets the empty strings to be populated with the elements containing the carousel items
var carouselEl = document.querySelector(".carousel-inner");
var carouselItem = "";
var carouselItem1 = "";
var carouselItem2 = "";

// Function checks if there is a stored array of favourited movie ID's and creates img tags with their respective posters to be displayed in the favourites section
var getFavs = function () {
  console.log(favs);
  // if the favs array is empty, the code empties any values in the local storage as well
  if (favs == null) {
    favs = [];
    console.log(favs);
    localStorage.setItem("favs", JSON.stringify(favs));
  } else {
    // We do a JSON parse for a stored array called "favs" and set it into a variable
    favs = JSON.parse(localStorage.getItem("favs"));
    // for loop grabs the ID and uses it to retrieve the movies poster which is displayed in the favourite movie carousel
    for (let i = 0; i < favs.length; i = i + 2) {
      // if there is only one movie left to be displayed it is displayed on its own in one carousel slide
      if (favs.length - i == 1) {
        var resultUrl1 =
          "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + favs[i];
        fetch(resultUrl1)
          .then((resp) => resp.json())
          .then(function (data) {
            var posterUrl1 = data.Poster;

            carouselItem = carouselItem.concat(
              '<div class="carousel-item"><div class="three-display flex justify-center gap-12" data-toggle="modal" data-target="#movieModal"><img class="d-block" id = "' +
                favs[i] +
                '"src="' +
                posterUrl1 +
                '" alt="Favourite Movie Posters" width="25%"></div></div>'
            );

            carouselEl.innerHTML = carouselItem;
            carouselEl.firstChild.classList.add("active");
          });
      } else {
        // else two movie posters are displayed per carousel slide
        var resultUrl1 =
          "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + favs[i];
        var resultUrl2 =
          "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + favs[i + 1];
        console.log(resultUrl1);
        console.log(resultUrl2);
        Promise.all([
          fetch(resultUrl1).then((resp) => resp.json()),
          fetch(resultUrl2).then((resp) => resp.json()),
        ]).then(function (data) {
          var posterUrl1 = data[0].Poster;
          var posterUrl2 = data[1].Poster;

          carouselItem = carouselItem.concat(
            '<div class="carousel-item"><div class="three-display flex justify-center gap-12" data-toggle="modal" data-target="#movieModal"><img class="d-block" id = "' +
              favs[i] +
              '" src="' +
              posterUrl1 +
              '" alt="Favourite Movie Posters" width="25%"><img class="d-block" id = "' +
              favs[i + 1] +
              '" src="' +
              posterUrl2 +
              '" alt="Favourite Movie Posters" width="25%"></div></div>'
          );

          carouselEl.innerHTML = carouselItem;
          carouselEl.firstChild.classList.add("active");
        });
      }
    }
  }
};

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
          '<div class="col-md-12"><img src="' +
          Poster +
          '" alt="Movie Poster" width="100%"></div> <div class="col-md-12"> <ul id="movie-details"><li><strong>Release Date:</strong> ' +
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
          "</li></div>";

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

// Function is used to pop up a modal containing a movies information when that movie is clicked on by the user
function favClicker() {
  var favdivsEl = carouselEl.children;
  console.log(favdivsEl);
  console.log(favdivsEl[0].children[0].children[0]);

  // If there is only one child element within the carousel slide, we run this function that uses and event target to get the id of
  //the movie poster, which is stored in the id attribute of the div, and use it to call the function openSearchResult while passing in that ID.
  for (let i = 0; i < favdivsEl.length; i++) {
    if (favdivsEl[i].children[0].childElementCount == 1) {
      console.log("hi");
      favdivsEl[i].children[0].children[0].addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          console.log(event.currentTarget);
          var imdbID = event.currentTarget.id;
          openSearchResult(imdbID);
        }
      );
    } else {
      // else we do the same thing here as above, when there are 2 movie posters within the slide
      favdivsEl[i].children[0].children[0].addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          console.log(event.currentTarget);
          var imdbID = event.currentTarget.id;
          openSearchResult(imdbID);
        }
      );
      favdivsEl[i].children[0].children[1].addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          console.log(event.currentTarget);
          var imdbID = event.currentTarget.id;
          openSearchResult(imdbID);
        }
      );
    }
  }
}

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
        console.log(favs);
        return;
      }
    }
    // otherwise we will add the ID into the favs array and update local storage
  } else {
    favs.unshift(imdbID);
    localStorage.setItem("favs", JSON.stringify(favs));
    checkLike(imdbID);
    console.log(favs);
  }
});

// Calls get favs function to initialize page
getFavs();

setTimeout(favClicker, 500);
