$("form[name=signup_form]").submit(function (event) {
        var $form = $(this);
        var $error = $form.find(".error");
        var data = $form.serialize();

      $.ajax({
        url: "/user/signup",
        type: "POST",
        data: data,
        dataType: "json",
        success: function(resp) {
        window.location.href = "/dashboard";
      },
        error: function (resp){
        $error.text(resp.responseJSON.error);
      }
    });
  
      event.preventDefault();
});

$("form[name=login_form]").submit(function (event) {
  var $form = $(this);
  var $error = $form.find(".error");
  var data = $form.serialize();

$.ajax({
  url: "/user/login",
  type: "POST",
  data: data,
  dataType: "json",
  success: function(resp) {
  window.location.href = "/dashboard";
},
  error: function (resp){
  $error.text(resp.responseJSON.error);
}
});

event.preventDefault();
});