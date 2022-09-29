function getSearchInfo() {

    let queryString = document.location.search;
    var inputVal = queryString.split('=')[1];
    getSearchResult(inputVal);

}

getSearchInfo();

