// SCRIPT FOR SWIPE.HTML PAGE

// Take dates from generatedDates[] and display
//      display additional info in "i" button popup



// Mock generatedDates[] array 
let generatedDates = [
    {
        "id": 0,
        "name": "Picnic in the Arb",
        "about": "This is a fun date idea! You should definitely go here.",
        "indoor": true,
        "address": "530 S 4th Ave",
        "season": "spring, summer",
        "price": 0,
        "images": [
            "demoimg.jpg",
            "demoimg2.jpg",
            "demoimg3.jpg"
        ]
    },
    {
        "id": 1,
        "name": "Watch a Movie",
        "about": "This is also a fun date! You should go here instead.",
        "indoor": true,
        "address": "338 E Jefferson St",
        "season": "any",
        "price": 1,
        "images": [
            "demoimg.jpg",
            "demoimg2.jpg",
            "demoimg3.jpg"
        ]
    }
];

// More Info popup
let modal = document.getElementById("myModal");
let btn = document.getElementById("info");
let span = document.getElementsByClassName("close")[0];

// Open and close popup
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Dates data
let likedDates = [];
let index = 0; // maybe save this in session data?
let slideIndex = 0;

// HTML elements
let img = document.getElementById("image");
let dateName = document.getElementById("name");
let price = document.getElementById("price");
let loc = document.getElementById("location");

// HTML popup elements
let modalName = document.getElementById("modalName");
let about = document.getElementById("about");
let season = document.getElementById("season");
let modalLoc = document.getElementById("modalLoc");
let modalPrice = document.getElementById("modalPrice");

// First card (on page load)
img.src = generatedDates[0]["images"][0];
dateName.innerHTML = generatedDates[0]["name"];
price.innerHTML = "price: " + translatePrice(generatedDates[0]["price"]);
loc.innerHTML = "location: " + generatedDates[0]["address"];

// First popup 
modalName.innerHTML = generatedDates[0]["name"];
about.innerHTML = generatedDates[0]["about"];
season.innerHTML = "<b>season: </b>" + generatedDates[0]["season"];
modalLoc.innerHTML = "<b>location: </b>" + translateLoc(generatedDates[0]["indoor"]);
modalPrice.innerHTML = "<b>price: </b>" + translatePrice(generatedDates[0]["price"]);


// Choose reject or heart a date
function swipeDate(heart){
    if (heart) {
        // Add date to likedDates[]
        likedDates.push(generatedDates[index]);
    } 

    // Remove from generatedDates[] so it doesn't display again
    generatedDates.splice(index, 1);

    // Check if there are any more dates
    if (generatedDates.length === 0){
        // if not, display "no more dates"
        dateName.innerHTML = "No more dates :(";
        price.innerHTML = "";
        loc.innerHTML = "";    
        return;
    } 
    
    // Update index (circle through)
    if (index === generatedDates.length-1){
        index = 0;
    } else {
        index += 1;
    }

    // Update date card
    img.src = generatedDates[index]["images"][0];
    dateName.innerHTML = generatedDates[index]["name"];
    price.innerHTML = "price: " + translatePrice(generatedDates[index]["price"]);
    loc.innerHTML = "location: " + generatedDates[index]["address"];

    // Update popup
    modalName.innerHTML = generatedDates[index]["name"];
    about.innerHTML = generatedDates[index]["about"];
    season.innerHTML = "<b>season: </b>" + generatedDates[index]["season"];
    modalLoc.innerHTML = "<b>location: </b>" + translateLoc(generatedDates[index]["indoor"]);
    modalPrice.innerHTML = "<b>price: </b>" + translatePrice(generatedDates[index]["price"]);
}

// Slideshow through images
function scrollImages(direction){
    // Get array of images
    let dateImgs = generatedDates[index]["images"];

    // Scroll right
    if (direction){
        if (slideIndex === dateImgs.length-1){
            slideIndex = 0;
        } else {
            slideIndex += 1;
        }    
    }
    // Scroll left
    else if (!direction){
        if (slideIndex === 0){
            slideIndex = dateImgs.length-1;
        } else {
            slideIndex -= 1;
        }    
    }

    // Set the new img
    img.src = dateImgs[slideIndex];
}

// Translate price to words
function translatePrice(rawPrice){
    if (rawPrice === 0){
        return "free!";
    } else if (rawPrice === 1){
        return "$";
    } else if (rawPrice === 2){
        return "$$$";
    }
}

// Translate indoors to words
function translateLoc(indoors){
    if (indoors){
        return "indoors";
    } else {
        return "outdoors";
    }
}
