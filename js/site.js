$(function() {
  var logEvent = function(message) {
    console.log(message);
    $("#payment_log").append(
      $("<li>").text(message)
    );
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

  $("#payment").on("submit", runPaymentFlow);
});
