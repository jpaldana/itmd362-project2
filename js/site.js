$(function() {
  var paymentName = $("#payment_name");
  var paymentEmail = $("#payment_email");
  var paymentZip = $("#payment_zip");
  var paymentCc = $("#payment_cc");
  var paymentDate = $("#payment_date");
  var paymentCvv = $("#payment_cvv");

  var validatePaymentFields = function() {

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
