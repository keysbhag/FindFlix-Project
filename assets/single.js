var searchResultEl = document.getElementById("movie-box");
var modalBodyEl = document.querySelector(".modal-body");
var modalTitleEl = document.querySelector("#ModalLabel");
var modalFooterEl = document.querySelector(".modal-footer");
var likeButtonEl = document.querySelector("#liked");
var favs = JSON.parse(localStorage.getItem("favs"));

console.log(searchResultEl);

function divClicker() {
    var divsEl = searchResultEl.children;
    console.log(divsEl);
    console.log(divsEl[0]);

    for (let i = 0; i < divsEl.length; i++) {
        divsEl[i].addEventListener('click', function (event) {
            event.preventDefault();
            console.log(event.currentTarget);
            var imdbID = event.currentTarget.id;
            openSearchResult(imdbID);
        });
    };
};


function combineSearch(Title, Year, Type, Poster, imdbID) {
    if (Poster == "N/A") {
        Poster = "./assets/no-poster.jpeg";
    }
    divHTML = ('<div class="searchResult" data-toggle="modal" data-target="#movieModal" id="' + imdbID + '"> <img src="' + Poster + '" alt="Movie Poster" width="100%" class="poster"><ul class="description" ><li>Title: ' + Title + '</li> <li>Year: ' + Year + '</li> <li> Type: ' + Type.charAt(0).toUpperCase() + Type.slice(1) + '</li></ul></div>');
    return divHTML;
};

function getSearchResult(keyWord) {
    var searchUrl = "https://www.omdbapi.com/?apikey=5972139b&r=json&s=" + keyWord;
    console.log(searchUrl);
    var divHTML = "";
    fetch(searchUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    for (let i = 0; i < data.Search.length; i++) {
                        var {
                            Title,
                            Year,
                            Type,
                            imdbID,
                            Poster
                        } = data.Search[i];
                        if (Type != "game") {
                            divHTML = divHTML.concat(combineSearch(Title, Year, Type, Poster, imdbID));
                            console.log(Title);
                            console.log(Year);
                            console.log(Type);
                            console.log(imdbID);
                            console.log(Poster);
                            console.log(divHTML);
                        };
                    };
                    searchResultEl.innerHTML = divHTML;
                    console.log(divHTML);
                    divClicker();
                });
            };
        });

};

function openSearchResult(imdbID) {
    var resultUrl = "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + imdbID;
    console.log(resultUrl);
    fetch(resultUrl)
        .then(function (response) {
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
                        Ratings
                    } = data;
                    var trailerURL = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + Title + "%20" + Released + "%20" + Type + "%20Trailer&key=AIzaSyChqp_YFZL_R5E7abUVSqz6vcQMgvTgu28";
                    console.log(trailerURL);
                    fetch(trailerURL)
                        .then(function (response) {
                            if (response.ok) {
                                console.log(response);
                                response.json().then(function (data) {
                                    console.log(data.items[0].id.videoId);
                                    player.loadVideoById(data.items[0].id.videoId);
                                })
                            }
                        })
                    console.log(Ratings);
                    var movieScore = "";
                    for (let i = 0; i < Ratings.length; i++) {
                        movieScore = movieScore.concat('<li>' + Ratings[i].Source + ": " + Ratings[i].Value + '</li>');
                        console.log(movieScore);
                    };

                    if (Poster == "N/A") {
                        Poster = "./assets/no-poster.jpeg";
                    }
                    var showLength = "";
                    if (Type == "series") {
                        showLength = '<li>Total Seasons: ' + data.totalSeasons + '</li>';
                    } else {
                        showLength = '<li>Runtime: ' + Runtime + '</li>';
                    }
                    modalTitleEl.textContent = Title;
                    modalBodyEl.innerHTML = '<img src="' + Poster + '" alt="Movie Poster" width="100%"> <ul id="movie-details"><li>Release Date: ' + Released + '</li><li>Type: ' + Type.charAt(0).toUpperCase() + Type.slice(1) + '</li><li>Language: ' + Language + '</li>' + showLength + '<li>Director: ' + Director + '</li><li>Starring: ' + Actors + '</li>' + movieScore + '<li><strong>Plot: </strong></li><li>' + Plot + '</li>';

                    checkLike(imdbID);
                    likeButtonEl.addEventListener('click', function (event){
                        event.preventDefault();
                        if (checkLike(imdbID)){
                            for (let i = 0; i < favs.length; i++) {
                                if (favs[i] == imdbID){
                                    favs.splice(i, 1);
                                    localStorage.setItem("favs", JSON.stringify(favs));
                                    likeButtonEl.innerHTML = '<img id="notlikedIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589197.png" alt="Not Liked" width="50">'
                                    console.log(favs);
                                    return;
                                }                                
                            }
                        }
                        else{
                            favs.unshift(imdbID);
                            localStorage.setItem("favs", JSON.stringify(favs));
                            likeButtonEl.innerHTML = '<img id="likedIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589054.png" alt="Liked" width="50">'
                            console.log(favs);
                        }
                    })
                });
            };
        });

}

function getSearchInfo() {

    let queryString = document.location.search;
    var inputVal = queryString.split('=')[1];
    getSearchResult(inputVal);

}

getSearchInfo();

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        width: 'auto',
        videoId: '',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
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

$('#movieModal').on('hidden.bs.modal', function () {
    player.stopVideo();
});


function checkLike(imdbID) {
    favs = JSON.parse(localStorage.getItem("favs"));
    if (favs.includes(imdbID)) {
        likeButtonEl.innerHTML = '<img id="likedIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589054.png" alt="Liked" width="50">'
        return true;
    } else {
        likeButtonEl.innerHTML = '<img id="notlikedIcon" src="https://cdn-icons-png.flaticon.com/512/2589/2589197.png" alt="Not Liked" width="50">'
        return false;
    }
}