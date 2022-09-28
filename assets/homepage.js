function formSubmitHandler (keyWord) {
    console.log(keyWord);
}

function getSearchResult (keyWord){
    var searchUrl = "https://www.omdbapi.com/?apikey=5972139b&r=json&s=" + keyWord;
    console.log(searchUrl);
    fetch (searchUrl)
        .then(function (response){
            if (response.ok){
                console.log(response);
                response.json().then(function (data){
                    for (let i = 0; i < data.Search.length; i++) {
                        var dataItem = data.Search[i];
                        var title = dataItem.Title;
                        var year = dataItem.Year;
                        var imdbID = dataItem.imdbID;
                        var type = dataItem.Type;
                        var poster = dataItem.Poster;
                                                
                    };

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
                        var title = data.Title;
                        var releasedate = data.Released;
                        var type = data.Type;
                        var language = data.Language;
                        var runtime = data.Runtime;
                        var director = data.Director;
                        var actors = data.Actors;
                        var poster = data.Poster;
                        var votes = data.imdbVotes;
                        var boxoffice = data.BoxOffice;   
                        var plot = data.Plot;
                        var ratings = data.Ratings;
                        for (let i = 0; i < ratings.length; i++) {
                            var movieScore = ratings[i].Source + ": " + ratings[i].Value;
                            console.log(movieScore);
                        };
                        console.log(title);
                        console.log(releasedate);
                        console.log(type);
                        console.log(language);
                        console.log(runtime);
                        console.log(director);
                        console.log(actors);
                        console.log(poster);
                        console.log(votes);
                        console.log(boxoffice);
                        console.log(plot);
                    ;

                });
            };
        });
}