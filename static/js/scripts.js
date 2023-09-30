// Sign Up
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
// Login 
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

// Expenses Tables
function addRow() {
    var name = jQuery('input[name="Name"]').val();
    var type = jQuery('select[name="Type"]').val();
    var amount = jQuery('input[name="Amount"]').val();


    if (name != "" && type != " " && amount != ""){
      $('#expensesTable').append('<tr><td><input type="text" name="Name" class="form-control"></td><td><select class="form-select" name="Type" aria-label="Payment Type"><option ></option><option value="Needs">Needs</option><option value="Wants">Wants</option><option value="Savings">Savings</option></select></td><td><input type="number" name="Amount" class="form-control"></td><td><input type="button" value="X" class="btn btn-danger btn-circle" onclick="deleteRow(this)"/></td></tr>');
    }
}

function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
  
  var month = $("h1").eq(0).text();
  var year = $("h1").eq(1).text();
  var num_month = getMonthFromString(month);
  var date = num_month.toString() + "-" + year.toString();
  var data = [];

  var $row = $(btn).closest("tr");    // Find the row
  var $tds = $row.find("td");
  $.each($tds, function() {
        data.push($(this).text().trim());
    });
  data.pop();

  $.ajax({
    url: "/user/expense/delete",
    type: "POST",
    data: {"name":data[0],
          "type":data[1],
          "amount":data[2],
          "date":date},
    dataType: "json",
    success: function(resp) {
    // window.location.href = "/dashboard";

  },
    error: function (resp){
    
  }
  });
}


function getMonthFromString(mon){

  var d = Date.parse(mon + "1, 2012");
  if(!isNaN(d)){
     return new Date(d).getMonth() + 1;
  }
  return -1;
}
