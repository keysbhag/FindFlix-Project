function getSearchInfo() {

    let queryString = document.location.search;
    var inputVal = queryString.split('=')[1];
    getSearchResult(inputVal);

}

getSearchInfo();

// Initial Ratings function - will update later
let ratings = {
    movie1: 2.3,
    movie2: 3.9,
    movie3: 3.0,
    movie4: 4.1,
    movie5: 1.3,
    movie6: 0.5,
    movie7: 3.3,
    movie8: 5.0
}

//Total stars
let starsTotal =5;

//Run getRatings when DOM loads
document.addEventListener('DOMContentLoaded', getRatings)



// Get ratings
function getRatings(){
    for(let rating in ratings) {
        //Get percentage
        let starPercentage = (ratings[rating] / starsTotal) * 100;
        // Round to nearest 10
        let starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
        
        // Set width stars-inner to percentage
        document.querySelector(`.${rating}.stars-inner`).style.width = starPercentageRounded; //debug

    }
}