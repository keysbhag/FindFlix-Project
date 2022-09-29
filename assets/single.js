var searchResultEl = document.getElementById("movie-box");
var modalBodyEl = document.querySelector(".modal-body");
var modalTitleEl = document.querySelector("#ModalLabel");

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
    divHTML = ('<div class="searchResult" data-toggle="modal" data-target="#movieModal" id="' + imdbID + '"> <img src="' + Poster + '" alt="Movie Poster" width="100%"><ul><li>Title: ' + Title + '</li> <li>Year: ' + Year + '</li> <li> Type: ' + Type.charAt(0).toUpperCase() + Type.slice(1) + '</li></ul></div>');
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
                    console.log(Ratings);
                    var movieScore = "";
                    for (let i = 0; i < Ratings.length; i++) {
                        movieScore = movieScore.concat('<li>' + Ratings[i].Source + ": " + Ratings[i].Value + '</li>');
                        console.log(movieScore);
                    };
                    console.log(Title);
                    console.log(Released);
                    console.log(Type);
                    console.log(Language);
                    console.log(Runtime);
                    console.log(Director);
                    console.log(Actors);
                    console.log(Plot);
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
                    modalBodyEl.innerHTML = '<img src="' + Poster + '" alt="Movie Poster" width="100%"> <ul id="movie-details"><li>Release Date: ' + Released + '</li><li>Type: ' + Type.charAt(0).toUpperCase() + Type.slice(1) + '</li><li>Language: ' + Language + '</li>' + showLength + '<li>Director: ' + Director + '</li><li>Starring: ' + Actors + '</li>' + movieScore + '<li><strong>Plot: </strong></li><li>' + Plot + '</li>'
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

