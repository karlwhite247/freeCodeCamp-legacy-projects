$(window).load(function () {
  //Set default input values on page load
  //Default coordinates set to Boston, US
  var openWeatherMapAPI =
      "http://api.openweathermap.org/data/2.5/weather?lat=42.36&lon=-71.06&units=imperial&appid=ca6ff81b256ad199b3de759c58de182b",
    $temp = $("#temp"),
    $tempMax = $("#temp-max"),
    $tempMin = $("#temp-min"),
    temp = 72,
    tempMax = 81,
    tempMin = 64,
    weatherId = 800;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      openWeatherMapAPI =
        "http://api.openweathermap.org/data/2.5/weather?lat=" +
        position.coords.latitude +
        "&lon=" +
        position.coords.longitude +
        "&units=imperial&appid=ca6ff81b256ad199b3de759c58de182b";
      //only calls API if geolocation is enabled
      fetchWeather(openWeatherMapAPI);
    });
  }

  //initialize temperature switch
  $("#switch-temp").bootstrapSwitch();

  //Fetch Weather from OpenWeatherMap by Geografic Coordinates
  //api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}
  function fetchWeather(API) {
    $.getJSON(API, function (json) {
      $temp.html(parseInt(json.main.temp));
      $tempMax.html(parseInt(json.main.temp_max));
      $tempMin.html(parseInt(json.main.temp_min));
      $("#city span").html(json.name + ", " + json.sys.country);
      $("#condition").html(json.weather[0].description);
      $("#humidity").html(json.main.humidity + "%");
      $("#wind").html(json.wind.speed + " mph");
      $("#hpa").html(json.main.pressure + " hPa");
      $("#prec").html(json.clouds.all + " %");

      weatherId = json.weather[0].id;

      //change Background
      if (weatherId >= 200 && weatherId < 550) {
        //rainy bg
        $("body").removeClass("sunny").addClass("rainy");
      } else if (weatherId >= 600 && weatherId < 700) {
        //snow
        $("body").removeClass("sunny").addClass("snow");
      } else if (weatherId >= 700 && weatherId < 800) {
        //mist smoke
        $("body").removeClass("sunny").addClass("snow");
      } else {
        //keep the default
        console.log("BG image set to default");

        //TODO: Change BG based on time
      }

      $("#weather-icon i")
        .removeClass("wi-sleet")
        .addClass("wi-owm-" + weatherId);

      //init temperature variables
      temp = $temp.html();
      tempMax = $tempMax.html();
      tempMin = $tempMin.html();
    });
  }

  $("#switch-temp").on("switchChange.bootstrapSwitch", function (event, state) {
    if (state) {
      $temp.html(toCelsius(temp));
      $tempMax.html(toCelsius(tempMax));
      $tempMin.html(toCelsius(tempMin));
      $("#metric").html("C");
    } else {
      $temp.html(temp);
      $tempMax.html(tempMax);
      $tempMin.html(tempMin);
      $("#metric").html("F");
    }
  });

  function toCelsius(f) {
    return parseInt((5 / 9) * (f - 32));
  }
});