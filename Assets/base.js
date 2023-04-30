// variables marked by their html ids:
var searchBtn = document.querySelector("#searchBtn");
var searchInput = document.querySelector("#searchInput");
var searchHistory = document.querySelector("#searchHistory");

// main function to connect to the weather API and get the forcast, both current and future(5 days)
function getWeather (){

    // variables for this func, gotten by ids. First two only take the value of the input of the corresponding id while Dayjs gets us the time. currentDate gets the value from dayjs and puts it in a specific format as shown!
    var searchInput = document.querySelector("#searchInput").value
    var units = document.querySelector("#units").value;
    var now = dayjs(); 
    var currentDate = (now.format('YYYY-MM-DD'));  

    // Capitalize the first letter of searchInput var: gets first charcter of searchInput, capitalizes it, then adds the rest of the word
    searchInput = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);

    // API variables: key, api for current weather, and api for future forcast (both api links have the variables taken from the above vairables so that whatever the user input is, it gets applied and sent to the api)
    var apiKey = '41527770fabd0238fc849f91a7c6c131';
    var urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&units=${units}&appid=${apiKey}`;
    var urlFuture = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&units=${units}&appid=${apiKey}`;

    // fetching our api for current weather
    fetch(urlCurrent)
    .then(response => response.json())
    .then(data => {
        
        // variables that will later display the api data, they are simply being introduced here
        var cityName = document.querySelector("#cityName");
        var temp = document.querySelector("#temp");
        var wind = document.querySelector("#wind");
        var humidity = document.querySelector("#humidity");

        // these variables are specifically for the weather icon. Note that "data" is the api data object and whatever comes after is the path for our target information. THIS WILL BE THE CASE EVERY TIME! (so later on, this well be seen again!)
        var iconCode = data.weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
        var imgIcon = document.querySelector("#imgIcon");
        var divIcon = document.querySelector("#icon");

        // makes the div visible when an icon exists (because otherwise it loads an empty pic). And later we insert the icon url (from api) into the img source so that it is displayed properly!
        divIcon.style.visibility = "visible";
        imgIcon.src = iconUrl;

        // variables for units and corresponding data (temperature and wind speed, values of which are taken from api)
        var tempUnit = "°F"
        var windUnit = "MPH"
        var tempVar = `${data.main.temp}`
        var windVar = `${data.wind.speed}`

        // display corresponding data and units depending on the user's selected unit!
        if (units === "imperial") {
        
            tempUnit = "°F"
            windUnit = "MPH"

            // Convert tempVar to a number (because it is given as a string in some cases), round it to the nearest integer (toFixed() method returns a string), and convert back to a number
            tempVar = Number(parseFloat(tempVar).toFixed(0));
    
            // Convert windVar to a number, round it to the nearest integer, and convert back to a number
            windVar = Number(parseFloat(windVar).toFixed(0));

        } else if (units === "metric") {

            tempUnit = "°C"
            windUnit = "KMH"

            // Convert tempVar to a number, round it to the nearest integer, and convert back to a number
            tempVar = Number(parseFloat(tempVar).toFixed(0));

            // Convert windVar to a number, round it to the nearest integer, and convert back to a number. And this converts meter per seconds to Kilometers per hours
            windVar = Number(parseFloat(windVar * 3.6).toFixed(0));

        };

        //variables now display the text taken from the api! (instead of simply copying the searchInput, the cityName displays the name given from the api as well as the country code. I notcied this is better because sometimes the same city name is present in more than one country and if uer treis to search for the country code, the cityName would then look something like: cityName, coutrycode inputed, countrycode from api. So, what we have is the best! The inuput now is "CityName, CC")
        cityName.textContent = `${data.name},${data.sys.country} (${currentDate})`;
        temp.textContent = `Temperature: ${tempVar} ${tempUnit}`;
        wind.textContent = `Wind Speed: ${windVar} ${windUnit}`;
        humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)} %`;


        // Removes the warning as no error is present! (this is important in case there was an error before anf the code in the error section was triggered as it removes the error and the breakline that were created!)
        var existingInputAlert = inputDiv.querySelector("p");
        if (existingInputAlert) {
            inputDiv.removeChild(existingInputAlert);
        }
        var existingLineBreak = inputDiv.querySelector("br");
        if (existingLineBreak) {
            inputDiv.removeChild(existingLineBreak);
        }

    })

    .catch(error => {
        // Handle any errors
        console.error(error);

        // In case of an error, gives a written warning under the input box!
        // Check if there is an existing p element or linebreak in inputDiv
        var existingInputAlert = inputDiv.querySelector("p");
        if (existingInputAlert) {
            inputDiv.removeChild(existingInputAlert);
        }
        var existingLineBreak = inputDiv.querySelector("br");
        if (existingLineBreak) {
            inputDiv.removeChild(existingLineBreak);
        }
    
        // this var creates a "p" element in html and styles it
        var inputAlert = document.createElement("p");
        inputAlert.style.fontSize = "14px";
        inputAlert.style.fontWeight = "bold";
        inputAlert.style.color = "red";
    
        // the warning text is created then appendened accordingly. Simimlarly for the line break!
        inputAlert.innerHTML = 'Invalid city name, please try again!';
        inputDiv.appendChild(inputAlert);
        var lineBreak = document.createElement("br");
        inputDiv.appendChild(lineBreak);  
    });

    // second fetch for the second api which is for the future forcast! (I'll only comment on the important bits of code as it is simila ot the one above it!)
    fetch(urlFuture)
    .then(response => response.json())
    .then(data => {
        
        var futureDay = document.querySelector("#futureDay");
        // this will later be filled with text, for now, it is an empty string!
        var futureHTML = "";

        // this for loop exists because the api gives an array with 40 values, 8 values (weather readings) for each day, one each 3 hours. We satrted i as 6 because that happened to be noon, the midde of the day. So our api shows the future weather, for 5 days, each at noon!
        for (var i=6; i<40; i+=8){

            var tempUnit = "°F"
            var windUnit = "MPH"
            var tempVar = `${data.list[i].main.temp}`
            var windVar = `${data.list[i].wind.speed}`
            var humidity = `${data.list[i].main.humidity}`
            var date = `${data.list[i].dt_txt.split(" ")[0]}`
            var iconCode = data.list[i].weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

            if (units === "imperial") {
            
                tempUnit = "°F"
                windUnit = "MPH"

                // Convert tempVar to a number, round it to the nearest integer, and convert back to a number
                tempVar = Number(parseFloat(tempVar).toFixed(0));
        
                // Convert windVar to a number, round it to the nearest integer, and convert back to a number
                windVar = Number(parseFloat(windVar).toFixed(0));
    
            } else if (units === "metric") {
    
                tempUnit = "°C"
                windUnit = "KMH"

                // Convert tempVar to a number, round it to the nearest integer, and convert back to a number
                tempVar = Number(parseFloat(tempVar).toFixed(0));

                // Convert windVar to a number, round it to the nearest integer, and convert back to a number + converts mps to kph
                windVar = Number(parseFloat(windVar * 3.6).toFixed(0));

            };
    
            // now this var that was an empty string is being filled with data from the api 
            futureHTML += `
            <div class="dayCard">
            <div> ${date}  </div>
            <div id="icon" style="visibility: visible;"><img id="imgIcon" src="${iconUrl}" alt="Weather icon"></div>
            <div> Temperature: ${tempVar} ${tempUnit} </div>
            <div> Wind Speed: ${windVar} ${windUnit} </div>
            <div> Humidity: ${humidity} % </div>
            </div>
            `;

        }

        // futureDay is the one representing out html, it is being filled with futureHTML!
        futureDay.innerHTML = futureHTML;

    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });

};


// Add the search term to the search history in the local storage
function addSearchToHistory() {

    var searchTerm = searchInput.value.trim();

    // Capitalize the first letter of searchTerm: gets first charcter of searchTerm, capitalizes it, then adds the rest of the word
    searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);

    // if the search box is not empty, do this:
    if (searchTerm !== null) {
        // Make API call to check if city exists
        // we're using the same api we used above but with only the city name as a variable in order to make sure there is a valid response: status code is between 200 and 299, so, not 400 or 404 etc. If so, then do add the searchTerm to historyList as shown below!

        var apiKey = '41527770fabd0238fc849f91a7c6c131';
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`)
        .then(response => {

            if (response.ok) {

                // City exists, add to historyList
                var historyList = JSON.parse(localStorage.getItem("searchHistory")) || [];

                // Check if the search term already exists in historyList
                if (historyList.includes(searchTerm)) {
                    historyList.splice(historyList.indexOf(searchTerm), 1);
                }

                // Add the search term to the beginning of the array
                historyList.unshift(searchTerm);

                // Save items to local storage
                localStorage.setItem("searchHistory", JSON.stringify(historyList));

                // Limit the history to the 10 most recent searches
                if (historyList.length > 10) {
                    historyList.pop();
                }

                localStorage.setItem('searchHistory', JSON.stringify(historyList));

                renderSearchHistory();
            } 
        })
        .catch(error => {
            console.error(error);
        });
    };
};


// Display the search history that was stored!
function renderSearchHistory() {

    // Clear the existing search history
    searchHistory.innerHTML = "";

    var historyList = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add each search term to the search history
    historyList.forEach(function(searchTerm) {

        var historyBtn = document.createElement("li");
        historyBtn.innerHTML = searchTerm;
        searchHistory.appendChild(historyBtn);

        // When clicking on the "historyBtn" (that is not really a btn), the searchTerm is inputed and the weather function is run as though you have clicked on the search btn or pressed Enter!
        historyBtn.addEventListener("click", function() {
            searchInput.value = searchTerm;
            getWeather();
        });
    });
};


// This sequence of events is to prevent the page from loading an empty screen:
// Get weather for Toronto, and Render the search history (if there was any)
// Wait for the page to finish loading before running this function
window.onload = function() {

    var searchInput = document.querySelector("#searchInput");
    // Set the value of the search input to "Toronto" cuz why not?
    searchInput.value = "Toronto";
    getWeather();
    renderSearchHistory();
};

// Introduce the search function, which gets the value of the user's search input, gets the weather for that search term, and adds the search term to the search history:
function search() {

  var searchTerm = searchInput.value.trim();

  // If the search term is not empty, then do this:
  if (searchTerm !== "") {
    // Get the weather for the search term
    getWeather(searchTerm);
    // Add the search term to the search history
    addSearchToHistory();
  }
};

// When the search button is clicked, the search function is called!
searchBtn.addEventListener("click", search);

// When the search Enter key is pressed, the search function is called!
searchInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    search();
  }
});