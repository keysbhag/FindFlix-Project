let searchButton = document.getElementById('search-button');
let searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    let searchVal = searchInput.value;

    window.location.replace('./single-page.html?q=' + searchVal);

});
var favs = JSON.parse(localStorage.getItem("favs"));
var carouselEl = document.querySelector(".carousel-inner");
var carouselItem = "";
var carouselItem1 = "";
var carouselItem2 = "";


var getFavs = function () {
    console.log(favs);
    if (favs == null) {
        favs = [];
        console.log(favs);
        localStorage.setItem("favs", JSON.stringify(favs));
    } else {
        favs = JSON.parse(localStorage.getItem("favs"));
        for (let i = 0; i < favs.length; i = i + 2) {
            if (favs.length - i == 1) {
                var resultUrl1 = "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + favs[i];
                fetch(resultUrl1).then(resp => resp.json())
                    .then(function (data) {
                        var posterUrl1 = data.Poster;
                        carouselItem = carouselItem.concat('<div class="carousel-item"><div class="three-display flex justify-center gap-12"><img class="d-block" src="' + posterUrl1 + '" alt="Favourite Movie Posters" width="35%"></div></div>');
                        carouselEl.innerHTML = carouselItem;
                    });
            } else {
                var resultUrl1 = "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + favs[i];
                var resultUrl2 = "https://www.omdbapi.com/?apikey=5972139b&r=json&i=" + favs[i + 1];
                console.log(resultUrl1);
                console.log(resultUrl2);
                Promise.all([fetch(resultUrl1).then(resp => resp.json()),
                        fetch(resultUrl2).then(resp => resp.json()),
                    ])
                    .then(function (data) {
                        var posterUrl1 = data[0].Poster;
                        var posterUrl2 = data[1].Poster;
                        carouselItem = carouselItem.concat('<div class="carousel-item"><div class="three-display flex justify-center gap-12"><img class="d-block" src="' + posterUrl1 + '" alt="Favourite Movie Posters" width="35%"><img class="d-block" src="' + posterUrl2 + '" alt="Favourite Movie Posters" width="35%"></div></div>');
                        carouselEl.innerHTML = carouselItem;
                        carouselEl.firstChild.classList.add("active");
                    });
            }

        }
    }
};

getFavs();