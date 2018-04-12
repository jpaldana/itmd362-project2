$(function() {
  // for date
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var movies = {};
  var genres = {};
  var TMDB_API_KEY = "dd415b0144677fe05f3bebfc458008a5";
  var TICKET_PRICE = 8.50;
  var CACHE_TIMEOUT = 3600 * 1000; // 60 minutes

  var getGenre = function(id) {
    return genres[id];
  };

  var logEvent = function(message, input) {
    console.log(message);
    $("input[name='"+input+"']").after(
      "<p class='error'>"+message+"</li>"
    );
    $("input[name='"+input+"']").addClass(
      "error"
    );
  };

  var getQueryFragments = function() {
    var queryFragments = location.href.substring(
      location.href.lastIndexOf("/?") + 2
    ).split("&");
    var pairs = {};
    var i, splitFragment;
    for (i in queryFragments) {
      splitFragment = queryFragments[i].split("=");
      pairs[splitFragment[0]] = splitFragment[1];
    }
    return pairs;
  };

  var getDisplayYMD = function(d) {
    return d.getFullYear() + (d.getMonth() < 10 ? "-0" : "-") + d.getMonth() + (d.getDate() < 10 ? "-0" : "-") + d.getDate();
  };
  var getDisplayDate = function(date) {
    var d = new Date(date + "T12:00:00Z");
    var formattedDate = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    return formattedDate;
  };
  var getDisplayTime = function(time) {
    var d = new Date("2018-01-01T" + time + "-06:00"); // -06:00 for Chicago/Central Time
    var formattedTime = (function(hours, minutes) {
      if (hours > 12) {
        return (hours - 12) + ":" + (minutes < 10 ? "0" + minutes : minutes) + " PM";
      }
      else if (hours === 12) {
        // 12:00 PM
        return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " PM";
      }
      else {
        return hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " AM";
      }
    })(d.getHours(), d.getMinutes());
    return formattedTime;
  };
  var getDisplayDateTime = function(date, time) {
    return getDisplayDate(date) + " - " + getDisplayTime(time);
  };

  var validatePaymentFields = function(form_array) {
    // make sure the following fields are not empty
    var isValid = true;
    var i;
    
    form_array[0].regex = /.+/;
    form_array[1].regex = /^[^\s@]+@[^\s@]+$/;
    form_array[2].regex = /^\d{5}$/;
    form_array[3].regex = /^\d{15,16}$/;
    form_array[4].regex = /^\d{2}\/\d{2}$/;
    form_array[5].regex = /^\d{3,4}$/;
    
    for(i = 0; i < form_array.length; i++) {
      if(!form_array[i].regex.test(form_array[i].value)) {
        isValid = false;
        logEvent("Invalid " + form_array[i].name, form_array[i].name);
      }
    }
    return isValid;
  };

  var runPaymentFlow = function(e) {
    var form_array = $(this).serializeArray();
    e.preventDefault();
    $("p.error").remove();
    $("input.error").removeClass("error");
    if (validatePaymentFields(form_array)) {
      logEvent("Thank you");
      console.log("Success, pretend to POST data request or something.");
      $("#payment-form").hide();
      $("#payment-section").addClass("confirmation");
      $("#payment-section").prepend("<h2>Order Confirmation<h2>");
      $("#payment-section").append("<h2>Payment Details:</h2>");
      $("#payment-section").append("<ol><li>"+form_array[0].value+"</li><li>"+form_array[1].value+"</li><li>****"+form_array[3].value.substring(12)+"</ol>");
    }
    else {
      console.log("Failed. Show an error.");
    }
  };

  var updateTmdbData = function() {
    var i;
    if (Object.keys(genres).length > 0) {
      // replace movie posters on home page if tvdb call was successful
      $("#movies ul").empty();
      for (i in movies) {
        $("#movies ul").append("<li><a href='info/?movie=" + i + "'><figure><img class='poster' src='" + movies[i].poster + "' alt='Poster of " + movies[i].title + "' /><figcaption>" + movies[i].title + "</figcaption></figure></a></li>");
      }
      // replace background image with backdrop if movie is selected
      if (typeof currentQueryFragments.movie === "string") {
        $("html").css("background-image", "linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.95) 80%, rgba(0,0,0,0.75) 100%), url(" + movies[currentQueryFragments.movie].backdrop + ")").addClass("movie-backdrop");
      }
    }
    else {
      console.log("no movies to load");
    }
  };

  var updateDates = function(details) {
    var i, date, time, $timeContainer;
    $("#time ol").empty();
    for (date in details.dates) {
      $timeContainer = $("<ol>");
      for (i in details.dates[date]) {
        time = details.dates[date][i];
        $timeContainer.append("<li><a href='seats/?time=" + time + "&date=" + date + "'>" + getDisplayTime(time) + "</a></li>");
      }
      $("#time > ol").append($("<li>").text(getDisplayDate(date)).append($timeContainer));
    }
  };

  var updateSeats = function() {
    var i, seats = currentQueryFragments.seats.split(",");
    if (typeof currentQueryFragments.seats !== "object") {
      return;
    }
    $(".movie-seats, #selected-tickets").text("Seats: " + seats.join(", ") + " = $" + parseFloat(seats.length * TICKET_PRICE).toFixed(2));
    // if the user went back to the seats page, pre-select the seats
    for (i in seats) {
      $("a[href='#" + seats[i] + "']").addClass("selected");
    }
    $("#payment-btn").show();
  };

  var updateFragmentText = function() {
    // replace HTML elements text with correct values
    var details;
    if (typeof currentQueryFragments.movie === "string") {
      $("#info-section a").each(function() {
        $(this).attr("href", $(this).attr("href") + 
        "&movie=" + currentQueryFragments.movie);
      });
      if (typeof movies[currentQueryFragments.movie] === "object") {
        details = movies[currentQueryFragments.movie];
        $("a.return").each(function() {
          $(this).attr("href", $(this).attr("href") + "?" + fullFragment);
        });
        $(".movie-title").text(details.title);
        $(".movie-poster#poster").attr("src", details.poster.substring(0, 4) === "http" ? details.poster : "../media/posters/" + details.poster);
        $(".movie-meta#genre").text(details.genre);
        $(".movie-meta#rating").text(details.rating);
        $("p#plot-summary-text").text(details.desc);
        if (typeof currentQueryFragments.date === "string") {
          // update date/time text if it's set
          $(".movie-date").text(getDisplayDateTime(currentQueryFragments.date, currentQueryFragments.time));
        }
  
        // replace placeholder dates in /info/
        updateDates(details);
  
        // reselect seats if returning to /seats/ page; updates text on /payment/
        updateSeats();
      }
    }
  };

  var currentQueryFragments = getQueryFragments();
  var fullFragment = location.href.substring(
    location.href.lastIndexOf("/?") + 2
  );

  var init = function() {
    $("#payment-btn").hide();
    $("#payment-form").on("submit", runPaymentFlow);
    updateTmdbData();
    updateFragmentText();

    // Seat Selection
    $(".seats a").on("click", function(e) {
      e.preventDefault();
      $(this).toggleClass("selected");
      if ($(".seats a.selected").length > 0) {
        $("#payment-btn").show();
        $("#selected-tickets").text($(".seats a.selected").text() + " = $" + parseFloat($(".seats a.selected").length * TICKET_PRICE).toFixed(2));
      }
      else {
        $("#payment-btn").hide();
        $("#selected-tickets").text("None");
      }
    });
    
    $("#payment-btn").on("click", function() {
      var selected_seats = [];
      $(".selected").each(function(){
        selected_seats.push($(this).attr("href").substring(1));
      });
      if (fullFragment.indexOf("&seats=") >= 0) {
        fullFragment = fullFragment.substring(0, fullFragment.indexOf("&seats=")); // don't duplicate &seats=
      }
      $(this).attr("href", $(this).attr("href") + "?" + fullFragment + "&seats=" + selected_seats.join(","));
    });
  };

  // try to fetch most popular 2018 movies off TMDb if not already in cache
  if (localStorage.getItem("time-cache")) {
    if (new Date().getTime() - parseFloat(localStorage.getItem("time-cache")) > CACHE_TIMEOUT) {
      console.log(new Date().getTime() - parseFloat(localStorage.getItem("time-cache")));
      localStorage.removeItem("movie-cache");
      localStorage.removeItem("genre-cache");
      localStorage.removeItem("time-cache");
      console.log("flushing cache");
    }
    else {
      console.log("using cache");
    }
  }
  else {
    localStorage.removeItem("movie-cache");
    localStorage.removeItem("genre-cache");
  }
  if (localStorage.getItem("movie-cache") && localStorage.getItem("genre-cache")) {
    genres = JSON.parse(localStorage.getItem("genre-cache"));
    movies = JSON.parse(localStorage.getItem("movie-cache"));
    console.log("retrieve from local storage", movies);
    init();
  }
  else {
    $.getJSON("https://api.themoviedb.org/3/genre/movie/list?api_key="+TMDB_API_KEY+"&language=en-US", function(data) {
      var i;
      for (i in data.genres) {
        genres[data.genres[i].id] = data.genres[i].name;
      }
      $.getJSON("https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2018-01-01&primary_release_date.lte=2018-05-01&api_key="+TMDB_API_KEY+"&language=en-US&sort_by=popularity.desc&certification_country=US&certification=PG-13&include_adult=false&include_video=false&page=1", function(data) {
        var i, d = new Date(), s, g = ["12:00:00", "14:00:00", "16:00:00"], slug;
        var genDates = {};
        for (i = 0; i < 7; i++) {
          s = getDisplayYMD(d);
          genDates[s] = g;
          d.setDate(d.getDate()+1);
        }
        movies = {};
        for (i in data.results) {
          // convert title to a url-safe `slug`
          slug = data.results[i].title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
          $.getJSON("https://api.themoviedb.org/3/movie/" + data.results[i].id + "?api_key="+TMDB_API_KEY+"&append_to_response=releases,videos", function(data) {
            slug = data.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
            movies[slug].info = data;
            localStorage.setItem("movie-cache", JSON.stringify(movies));
            console.log("got deferred movie info for", slug);
          });
          movies[slug] = {
            "title": data.results[i].title,
            "poster": "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path,
            "backdrop": "https://image.tmdb.org/t/p/w1280" + data.results[i].backdrop_path,
            "rating": "PG-13",
            "genre": data.results[i].genre_ids.map(getGenre).join(", "),
            "desc": data.results[i].overview,
            "dates": genDates,
            "info": false
          };
        }
        console.log(movies);
        localStorage.setItem("movie-cache", JSON.stringify(movies));
        localStorage.setItem("genre-cache", JSON.stringify(genres));
        localStorage.setItem("time-cache", new Date().getTime());
        init();
      }).fail(function() {
        // failed to get latest movies
        console.log("failed to get latest movies");
        init();
      });
    }).fail(function() {
      // failed to get genres
      console.log("failed to get genres");
      init();
    });
  }
});
