$("form[name=update-precentages]").submit(function (event) {
    var needs = jQuery('input[name="needs%"]').val();
    var wants = jQuery('input[name="wants%"]').val();
    var savings = jQuery('input[name="savings%"]').val();
    if (parseInt(needs) + parseInt(wants) + parseInt(savings) == 100){
        $("#error-settings").css("visibility", "hidden");
        $.ajax({
          url: "/update/precentages/",
            type: "POST",
            data: {"needs":parseInt(needs),
                  "wants":parseInt(wants),
                  "savings":parseInt(savings)},
          success: function(resp) {
          alert(resp["resp"]);
        },
          error: function (resp){
        }
        });
    }else{
        $("#error-settings").css("visibility", "visible");
    }
  
  event.preventDefault();
  });

function setPreferenceVal(){
    if(document.URL.toString().includes("settings")){
        $.ajax({
            url: "/get/precentages/",
              type: "POST",
            success: function(resp) {
            $("#needs").val(resp["needs"]);
            $("#wants").val(resp["wants"]);
            $("#savings").val(resp["savings"]);
          },
            error: function (resp){
          }
          });
    }
}