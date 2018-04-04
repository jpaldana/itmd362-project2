$(function() {
  // for date
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // hardcoded movies for now, ideally would be from an AJAX request
  var movies = {
    "avengers-infinity-war": {
      "title": "Avengers: Infinity War"
    },
    "blade-runner-2049": {
      "title": "Blade Runner 2049"
    },
    "dunkirk": {
      "title": "Dunkirk"
    },
    "inception": {
      "title": "Inception"
    },
    "la-la-land": {
      "title": "La La Land"
    },
    "thor-ragnarok": {
      "title": "Thor Ragnarok"
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

  var getDisplayDate = function(date, time) {
    var d = new Date(date + "T" + time + "-06:00"); // -06:00 for Chicago/Central Time
    var formattedDate = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
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
    return formattedDate + " - " + formattedTime;
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

  var loadMovieSelection = function() {
    var fragments = getQueryFragments();
    if (typeof movies[fragments.movie] == "object") {
      var details = movies[fragments.movie];
      // replace HTML elements text with correct values
      $("#purchase_title").text(details.title);
      $("#purchase_section a").each(function() {
        $(this).attr("href", $(this).attr("href") + 
        "&movie=" + fragments.movie);
      });
    }
    else {
      console.log("Invalid movie?");
    }
  };
  if ($("html#purchase").length == 1) {
    loadMovieSelection();
  }

  var loadSeatSelection = function() {
    var fragments = getQueryFragments();
    if (typeof movies[fragments.movie] == "object") {
      var details = movies[fragments.movie];
      // replace HTML elements text with correct values
      $("#seats_title").text(details.title);
      $("#seats_date").text(getDisplayDate(fragments.date, fragments.time));
    }
    else {
      console.log("Invalid movie?");
    }
  };
  if ($("html#seats").length == 1) {
    loadSeatSelection();
  }
});
