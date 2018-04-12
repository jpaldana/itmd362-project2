/* https://github.com/madmurphy/cookies.js (GPL3) */
var docCookies={getItem:function(e){return e?decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null:null},setItem:function(e,o,n,t,r,c){if(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e))return!1;var s="";if(n)switch(n.constructor){case Number:s=n===1/0?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+n;break;case String:s="; expires="+n;break;case Date:s="; expires="+n.toUTCString()}return document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(o)+s+(r?"; domain="+r:"")+(t?"; path="+t:"")+(c?"; secure":""),!0},removeItem:function(e,o,n){return this.hasItem(e)?(document.cookie=encodeURIComponent(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(n?"; domain="+n:"")+(o?"; path="+o:""),!0):!1},hasItem:function(e){return!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e)?!1:new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},keys:function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),o=e.length,n=0;o>n;n++)e[n]=decodeURIComponent(e[n]);return e}};"undefined"!=typeof module&&"undefined"!=typeof module.exports&&(module.exports=docCookies); // eslint-disable-line

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
  var genres = {};

  var getGenre = function(id) {
    return genres[id];
  }

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
    }
    else {
      console.log("Failed. Show an error.");
    }
  };

  var updateFragmentText = function(fragments) {
    // replace HTML elements text with correct values
    var details, fullFragment;
    var date, time, formattedTime;
    var $timeContainer, $dateContainer;
    var i;
    if (typeof movies[fragments.movie] === "object") {
      details = movies[fragments.movie];
      fullFragment = location.href.substring(
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
      // replace placeholder dates
      $("#time ol").empty();
      for (date in details.dates) {
        $timeContainer = $("<ol>");
        for (i in details.dates[date]) {
          time = details.dates[date][i];
          formattedTime = getDisplayTime(time);
          $timeContainer.append("<li><a href='seats/?time=" + time + "&date=" + date + "'>" + formattedTime + "</a></li>");
        }
        $dateContainer = $("<li>").text(getDisplayDate(date)).append($timeContainer);
        $("#time > ol").append($dateContainer);
      }
      if (typeof fragments.date === "string") {
        // sanity
        $(".movie-date").text(getDisplayDateTime(fragments.date, fragments.time));
      }
      if (typeof fragments.seats === "string") {
        $(".movie-seats").text("Seats: " + fragments.seats);
      }
    }
  };

  var currentQueryFragments = getQueryFragments();
  var fullFragment = location.href.substring(
    location.href.lastIndexOf("/?") + 2
  );

  var init = function() {
    var i;
    // replace movie posters on home page if tvdb call was successful
    if (Object.keys(genres).length > 0) {
      $("#movies ul").empty();
      for (i in movies) {
        $("#movies ul").append("<li><a href='info/?movie=" + i + "'><figure><img class='poster' src='" + movies[i].poster + "' alt='Poster of " + movies[i].title + "' /><figcaption>" + movies[i].title + "</figcaption></figure></a></li>");
      }
    }
    else {
      console.log("no movies");
    }

    // /info/
    if ($("html#info").length === 1) {
      updateFragmentText(currentQueryFragments);
      $("#info-section a").each(function() {
        $(this).attr("href", $(this).attr("href") + 
        "&movie=" + currentQueryFragments.movie);
      });
    }

    // /info/seats/
    if ($("html#seats").length === 1) {
      updateFragmentText(currentQueryFragments);
    }

    // /info/seats/payment/
    if ($("html#payment").length === 1) {
      updateFragmentText(currentQueryFragments);
    }

    $("#payment-form").on("submit", runPaymentFlow);
    
    // Seat Selection
    
    $('.seats a').on('click', function(e) {
      e.preventDefault();
      $(this).toggleClass('selected');
    });
    
    $('#payment-btn').on('click', function() {
      var selected_seats = [];
      $('.selected').each(function(){
        var seat = $(this).attr('href').substring(1);
        selected_seats.push(seat);
      });
      $(this).attr("href", $(this).attr("href") + "?" + fullFragment + "&seats=" + selected_seats.join(","));
    });
  };

  // try to fetch most popular 2018 movies off TMDb if not already in cache
  if (localStorage.getItem("movie-cache") && localStorage.getItem("genre-cache")) {
    genres = JSON.parse(localStorage.getItem("genre-cache"));
    movies = JSON.parse(localStorage.getItem("movie-cache"));
    console.log("retrieve from local storage", movies);
    init();
  }
  else {
    $.getJSON("https://api.themoviedb.org/3/genre/movie/list?api_key=dd415b0144677fe05f3bebfc458008a5&language=en-US", function(data) {
      var i;
      for (i in data.genres) {
        genres[data.genres[i].id] = data.genres[i].name;
      }
      $.getJSON("https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2018-01-01&primary_release_date.lte=2018-05-01&api_key=dd415b0144677fe05f3bebfc458008a5&language=en-US&sort_by=popularity.desc&certification_country=US&certification=PG-13&include_adult=false&include_video=false&page=1", function(data) {
        var copyDates = movies["avengers-infinity-war"].dates;
        var i, slug;
        movies = {};
        for (i in data.results) {
          // convert title to a url-safe `slug`
          slug = data.results[i].title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
          movies[slug] = {
            "title": data.results[i].title,
            "poster": "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path,
            "backdrop": "https://image.tmdb.org/t/p/w500" + data.results[i].backdrop_path,
            "rating": "PG-13",
            "genre": data.results[i].genre_ids.map(getGenre).join(", "),
            "desc": data.results[i].overview,
            "dates": copyDates
          };
        }
        console.log(movies);
        localStorage.setItem("movie-cache", JSON.stringify(movies));
        localStorage.setItem("genre-cache", JSON.stringify(genres));
      }).fail(function() {
        // failed to get latest movies
        console.log("failed to get latest movies");
      });
    }).fail(function() {
      // failed to get genres
      console.log("failed to get genres");
    });
    init();
  }
});
