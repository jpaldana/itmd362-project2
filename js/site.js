$(function() {
  var paymentName = $("#payment_name");
  var paymentEmail = $("#payment_email");
  var paymentZip = $("#payment_zip");
  var paymentCc = $("#payment_cc");
  var paymentDate = $("#payment_date");
  var paymentCvv = $("#payment_cvv");

  var validatePaymentFields = function() {
    // make sure the following fields are not empty
    if (paymentName.val().length == 0 ||
        paymentEmail.val().length == 0 ||
        paymentZip.val().length == 0 ||
        paymentCc.val().length == 0 ||
        paymentDate.val().length == 0 ||
        paymentCvv.val().length == 0) {
      console.log("Empty field detected.");
    }

  };

  var runPaymentFlow = function(e) {
    e.preventDefault();
    if (validatePaymentFields()) {
      console.log("Success, pretend to POST data request or something.");
    }
    else {
      console.log("Failed. Show an error.");
    }
  };

  $("#payment_checkout").on("click", runPaymentFlow);
});
