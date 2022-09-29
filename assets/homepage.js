let searchButton = document.getElementById('search-button');
let searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    let searchVal = searchInput.value;

    window.location.replace('./single-page.html?q=' + searchVal);

})