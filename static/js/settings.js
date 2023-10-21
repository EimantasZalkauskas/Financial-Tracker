$("form[name=update-precentages]").submit(function (event) {
    var needs = jQuery('input[name="needs%"]').val();
    var wants = jQuery('input[name="wants%"]').val();
    var savings = jQuery('input[name="savings%"]').val();
    var currency = jQuery('select[name=currency]').val();
    if (parseInt(needs) + parseInt(wants) + parseInt(savings) == 100){
        $("#error-settings").css("visibility", "hidden");
        $.ajax({
          url: "/update/precentages/",
            type: "POST",
            data: {"needs":parseInt(needs),
                  "wants":parseInt(wants),
                  "savings":parseInt(savings),
                  "currency": currency},
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
        // Currency

        var currency_symbols = {
            'USD': '$', // US Dollar
            'EUR': '€', // Euro
            'CRC': '₡', // Costa Rican Colón
            'GBP': '£', // British Pound Sterling
            'ILS': '₪', // Israeli New Sheqel
            'INR': '₹', // Indian Rupee
            'JPY': '¥', // Japanese Yen
            'KRW': '₩', // South Korean Won
            'NGN': '₦', // Nigerian Naira
            'PHP': '₱', // Philippine Peso
            'PLN': 'zł', // Polish Zloty
            'PYG': '₲', // Paraguayan Guarani
            'THB': '฿', // Thai Baht
            'UAH': '₴', // Ukrainian Hryvnia
            'VND': '₫', // Vietnamese Dong
        };

        for (const [key, value] of Object.entries(currency_symbols)) {
            $("#currency").append($("<option>", {
                value: value,
                text: key
            }));
          }

        // Values for Precentages
        $.ajax({
            url: "/get/precentages/",
              type: "POST",
            success: function(resp) {
            $("#needs").val(resp["needs"]);
            $("#wants").val(resp["wants"]);
            $("#savings").val(resp["savings"]);
            $("#currency").val(resp["currency"]);
          },
            error: function (resp){
          }
          });
        
    }
}