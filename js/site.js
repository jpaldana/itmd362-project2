$(function() {
  var paymentName = $("#payment_name");
  var paymentEmail = $("#payment_email");
  var emailRegex = /^[^\s@]+@[^\s@]+$/;
  var paymentZip = $("#payment_zip");
  var zipRegex = /^\d{5}$/;
  var paymentCc = $("#payment_cc");
  var ccRegex = /^\d{15,16}$/;
  var paymentDate = $("#payment_date");
  var dateRegex = /^\d{2}\/\d{2}$/;
  var paymentCvv = $("#payment_cvv");
  var ccvRegex = /^\d{3,4}$/;
  
  var paymentLog = $("#payment_log");

  var logEvent = function(message) {
    console.log(message);
    paymentLog.append(
      $("<li>").text(message)
    );
  }

  var validatePaymentFields = function() {
    // make sure the following fields are not empty
    var isValid = true;

    if (paymentName.val().length == 0 ||
        paymentEmail.val().length == 0 ||
        paymentZip.val().length == 0 ||
        paymentCc.val().length == 0 ||
        paymentDate.val().length == 0 ||
        paymentCvv.val().length == 0) {
      logEvent("Empty field detected.");
      isValid = false;
    }
    if (!emailRegex.test(paymentEmail.val())) {
      isValid = false;
      logEvent("Invalid e-mail");
    }
    if (!zipRegex.test(paymentZip.val())) {
      isValid = false;
      logEvent("Invalid zipcode");
    }
    if (!ccRegex.test(paymentCc.val())) {
      isValid = false;
      logEvent("Invalid Credit Card Number");
    }
    if (!dateRegex.test(paymentDate.val())) {
      isValid = false;
      logEvent("Invalid Expiration Date");
    }
    if (!ccvRegex.test(paymentCvv.val())) {
      isValid = false;
      logEvent("Invalid CCV");
    }

    return isValid;
  };

  var runPaymentFlow = function(e) {
    e.preventDefault();
    paymentLog.empty();
    if (validatePaymentFields()) {
      logEvent("Success, pretend to POST data request or something.");
    }
    else {
      logEvent("Failed. Show an error.");
    }
  };

  $("#payment_checkout").on("click", runPaymentFlow);
});
