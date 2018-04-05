$(function() {
  // for date
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // hardcoded movies for now, ideally would be from an AJAX request
  var movies = {
    "avengers-infinity-war": {
      "title": "Avengers: Infinity War",
      "poster": "avengers_infinity_war.jpg",
      "rating": "PG-13",
      "genre": "Action, Adventure, Fantasy",
      "desc": "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos.",
      "dates": {
        "2018-03-01": ["12:00:00", "14:00:00", "16:00:00"],
        "2018-03-02": ["12:00:00", "14:00:00", "16:00:00"],
        "2018-03-03": ["12:00:00", "14:00:00", "16:00:00"]
      }
    },
    "blade-runner-2049": {
      "title": "Blade Runner 2049",
      "poster": "blade_runner_2049.jpg",
      "rating": "R",
      "genre": "Drama, Mystery, Sci-Fi",
      "desc": "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
      "dates": {
        "2018-03-04": ["12:00:00", "15:00:00", "18:00:00"],
        "2018-03-05": ["12:00:00", "15:00:00", "18:00:00"],
        "2018-03-06": ["12:00:00", "15:00:00", "18:00:00"]
      }
    },
    "dunkirk": {
      "title": "Dunkirk",
      "poster": "dunkirk.jpg",
      "rating": "PG-13",
      "genre": "Action, Drama, History",
      "desc": "Allied soldiers from Belgium, the British Empire and France are surrounded by the German Army, and evacuated during a fierce battle in World War II.",
      "dates": {
        "2018-03-07": ["12:00:00", "16:00:00", "20:00:00"],
        "2018-03-08": ["12:00:00", "16:00:00", "20:00:00"],
        "2018-03-09": ["12:00:00", "16:00:00", "20:00:00"]
      }
    },
    "inception": {
      "title": "Inception",
      "poster": "inception.jpg",
      "rating": "PG-13",
      "genre": "Action, Adventure, Sci-Fi",
      "desc": "A thief, who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.",
      "dates": {
        "2018-03-07": ["14:00:00", "18:00:00", "22:00:00"],
        "2018-03-08": ["14:00:00", "18:00:00", "22:00:00"],
        "2018-03-09": ["14:00:00", "18:00:00", "22:00:00"]
      }
    },
    "la-la-land": {
      "title": "La La Land",
      "poster": "la_la_land.jpg",
      "rating": "PG-13",
      "genre": "Comedy, Drama, Music",
      "desc": "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
      "dates": {
        "2018-03-10": ["12:00:00", "16:00:00", "20:00:00"],
        "2018-03-11": ["12:00:00", "16:00:00", "20:00:00"],
        "2018-03-12": ["12:00:00", "16:00:00", "20:00:00"]
      }
    },
    "thor-ragnarok": {
      "title": "Thor Ragnarok",
      "poster": "thor_ragnarok.jpg",
      "rating": "PG-13",
      "genre": "Action, Adventure, Comedy",
      "desc": "Thor is imprisoned on the planet Sakaar, and must race against time to return to Asgard and stop Ragnarök.",
      "dates": {
        "2018-03-10": ["14:00:00", "18:00:00", "22:00:00"],
        "2018-03-11": ["14:00:00", "18:00:00", "22:00:00"],
        "2018-03-12": ["14:00:00", "18:00:00", "22:00:00"]
      }
    }
  };

  var logEvent = function(message) {
    console.log(message);
    $("#payment_log").append(
      $("<li>").text(message)
    );
  };

  var getQueryFragments = function() {
    var queryFragments = location.href.substring(
      location.href.lastIndexOf("/?") + 2
    ).split("&");
    var pairs = {};
    for (var i in queryFragments) {
      var splitFragment = queryFragments[i].split("=");
      pairs[splitFragment[0]] = splitFragment[1];
    }
    return pairs;
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
      else if (hours == 12) {
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
    
    form_array[0].regex = /.*/;
    form_array[1].regex = /^[^\s@]+@[^\s@]+$/;
    form_array[2].regex = /^\d{5}$/;
    form_array[3].regex = /^\d{15,16}$/;
    form_array[4].regex = /^\d{2}\/\d{2}$/;
    form_array[5].regex = /^\d{3,4}$/;
    
    for(var i = 0; i < form_array.length; i++) {
      if(!form_array[i].regex.test(form_array[i].value)) {
        isValid = false;
        logEvent("Invalid " + form_array[i].name);
      }
    }
    return isValid;
  };

  var runPaymentFlow = function(e) {
    e.preventDefault();
    $("#payment_log").empty();
    var form_array = $(this ).serializeArray();
    if (validatePaymentFields(form_array)) {
      logEvent("Thank you");
      console.log("Success, pretend to POST data request or something.");
    }
    else {
      console.log("Failed. Show an error.");
    }
  };

  $("#payment_form").on("submit", runPaymentFlow);

  var updateFragmentText = function(fragments) {
    // replace HTML elements text with correct values
    if (typeof movies[fragments.movie] == "object") {
      var details = movies[fragments.movie];
      var fullFragment = location.href.substring(
        location.href.lastIndexOf("/?") + 2
      );
      $("a.return").each(function() {
        $(this).attr("href", $(this).attr("href") + "?" + fullFragment);
      });
      $(".movie-title").text(details.title);
      $(".movie-poster#poster").attr("src", "../media/posters/" + details.poster); // TODO?
      $(".movie-meta#genre").text(details.genre);
      $(".movie-meta#rating").text(details.rating);
      $("p#plot-summary-text").text(details.desc);
      if (typeof fragments.date == "string") {
        // sanity
        $(".movie-date").text(getDisplayDateTime(fragments.date, fragments.time));
      }
    }
  };

  // /info/
  if ($("html#info").length == 1) {
    var fragments = getQueryFragments();
    updateFragmentText(fragments);
    $("#info_section a").each(function() {
      $(this).attr("href", $(this).attr("href") + 
      "&movie=" + fragments.movie);
    });
  }

  // /info/seats/
  if ($("html#seats").length == 1) {
    var fragments = getQueryFragments();
    updateFragmentText(fragments);
    // TODO - add seating
    var fullFragment = location.href.substring(
      location.href.lastIndexOf("/?") + 2
    );
    $("#seats_section a").each(function() {
      $(this).attr("href", $(this).attr("href") + "?" + fullFragment);
    });
  }

  // /info/seats/payment/
  if ($("html#payment").length == 1) {
    var fragments = getQueryFragments();
    updateFragmentText(fragments);
  }
});
