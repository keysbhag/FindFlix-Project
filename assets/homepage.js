var searchResultEl = document.getElementById("movie-box");



console.log(searchResultEl);

function formSubmitHandler (keyWord) {
    console.log(keyWord);
}

function combineSearch (Title, Year, Type, Poster) {
    if (Poster == "N/A"){
        Poster = "./assets/no-poster.jpeg";
    }
    divHTML = ('<div class="searchResult"> <ul><li><img src="' + Poster + '" alt="Movie Poster" width="200"></li><li>Title: ' + Title + '</li> <li>Year: ' + Year + '</li> <li> Type: ' + Type + '</li></ul></div>');
    return divHTML;
};

function getSearchResult (keyWord){
    var searchUrl = "https://www.omdbapi.com/?apikey=5972139b&r=json&s=" + keyWord;
    console.log(searchUrl);
    var divHTML = "";
    fetch (searchUrl)
        .then(function (response){
            if (response.ok){
                console.log(response);
                response.json().then(function (data){
                    for (let i = 0; i < data.Search.length; i++) {
                        var {Title, Year, Type, imdbID, Poster} = data.Search[i];
                        divHTML = divHTML.concat(combineSearch(Title, Year, Type, Poster));
                        console.log(Title);
                        console.log(Year);
                        console.log(Type);
                        console.log(imdbID);
                        console.log(Poster);
                        console.log(divHTML);
                    };
                    searchResultEl.innerHTML = divHTML;
                    console.log(divHTML);
                });
            };
        });

};

function openSearchResult (imdbID){
    var resultUrl = "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + imdbID;
    console.log(resultUrl);
    fetch (resultUrl)
        .then(function (response){
            if (response.ok){
                console.log(response);
                response.json().then(function (data){
                        var {Title, Released, Type, Language, Runtime, Director, Actors, Poster, imdbVotes, BoxOffice, Plot, Ratings} = data;
                        for (let i = 0; i < Ratings.length; i++) {
                            var movieScore = Ratings[i].Source + ": " + Ratings[i].Value;
                            console.log(movieScore);
                        };
                        console.log(Title);
                        console.log(Released);
                        console.log(Type);
                        console.log(Language);
                        console.log(Runtime);
                        console.log(Director);
                        console.log(Actors);
                        console.log(Poster);
                        console.log(imdbVotes);
                        console.log(BoxOffice);
                        console.log(Plot);
                    ;

                });
            };
        });
}


let searchButton = document.getElementById('search-button');
let searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    let searchVal = searchInput.value;
    
    window.location.replace('./single-page.html?q='+searchVal);
    
})
