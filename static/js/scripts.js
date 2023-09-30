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


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// Expenses Tables
function addRowExpenses() {
    var name = jQuery('input[name="ExpensesName"]').val();
    var type = jQuery('select[name="ExpensesType"]').val();
    var amount = jQuery('input[name="ExpensesAmount"]').val();

    if (name != "" && type != " " && amount != ""){
      $('#expensesTable').append('<tr><td><input type="text" name="ExpensesName" class="form-control"></td><td><select class="form-select" name="ExpensesType" aria-label="Payment Type"><option ></option><option value="Needs">Needs</option><option value="Wants">Wants</option><option value="Savings">Savings</option></select></td><td><input type="number" name="ExpensesAmount" class="form-control"></td><td><input type="button" value="X" class="btn btn-danger btn-circle" onclick="deleteRowExpenses(this)"/></td></tr>');
    }
}

function deleteRowExpenses(btn) {
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
    dataType: "json"
    }).done(function (resp){
    });

    delay(200).then(() => {
      //ProcessChartExpenses();
      window.location.href = "/dashboard";
    });
      
}

var ctx6 = document.getElementById("expensesPieChart");
var expensesPieChart = new Chart(ctx6, {
    type: 'pie',
    options: {
        rotation: -20,
        cutoutPercentage: 50,
        animation: {
            animateScale: true,
        },
    },
    data: {
        labels: [

        ],
        datasets: [
            {
                data: [],
                borderWidth: 1,
                backgroundColor: [
                    'rgba(70, 215, 212, 0.2)',
                    "rgba(245, 225, 50, 0.2)",
                    "rgba(2, 225, 50, 0.2)"
                ],
                borderColor: [
                    '#46d8d5',
                    "#f5e132",
                    "#3fe132"
                ],
                hoverBackgroundColor: [
                    '#46d8d5',
                    "#f5e132",
                    "#3fe132"
                ]
            }]
        }
    });


function ProcessChartExpenses() {
  if(document.URL.toString().includes("dashboard")){
    var month = $("h1").eq(0).text();
    var year = $("h1").eq(1).text();
    var num_month = getMonthFromString(month);
    var date = num_month.toString() + "-" + year.toString();
    $.ajax({
      type: "POST",
      url: "/user/get/expenses",
      data: {"date":date},
      dataType: "json",
    }).done(function(data) {
      console.log(data);
      removeData(expensesPieChart);
      for (const [key, value] of Object.entries(data)) {
        addData(expensesPieChart, key, value);
      }
      
    });
  }
}

function addData(chart, label, newData) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(newData);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
  });
  chart.update();
}



// Income Table
function addRowIncome() {
  var name = jQuery('input[name="IncomeName"]').val();
  var type = jQuery('select[name="IncomeType"]').val();
  var amount = jQuery('input[name="IncomeAmount"]').val();

  if (name != "" && type != " " && amount != ""){
    $('#IncomeTable').append('<tr><td><input type="text" name="IncomeName" class="form-control" required></td><td><select class="form-select" name="IncomeType" aria-label="Payment Type" required><option ></option><option value="Salary">Salary</option><option value="Side Hustle">Side Hustle</option><option value="Second Job">Second Job</option><option value="Other">Other</option></select></td><td><input type="number" name="IncomeAmount" class="form-control" required></td><td><input type="button" value="X" class="btn btn-danger btn-circle" onclick="deleteRowIncome(this)"/></td></tr>');

      }
}

function deleteRowIncome(btn) {
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
  url: "/user/income/delete",
  type: "POST",
  data: {"name":data[0],
        "type":data[1],
        "amount":data[2],
        "date":date},
  dataType: "json"
    }).done(function (resp){
      });

  delay(200).then(() => {
    //ProcessChartExpenses();
    window.location.href = "/dashboard";


});
}

var ctx6 = document.getElementById("incomePieChart");
var incomePieChart = new Chart(ctx6, {
    type: 'pie',
    options: {
        rotation: -20,
        cutoutPercentage: 50,
        animation: {
            animateScale: true,
        },
    },
    data: {
        labels: [

        ],
        datasets: [
            {
                data: [],
                borderWidth: 1,
                backgroundColor: [
                    'rgba(70, 215, 212, 0.2)',
                    "rgba(245, 225, 50, 0.2)",
                    "rgba(2, 225, 50, 0.2)",
                    "rgba(2, 55, 50, 0.2)",
                ],
                borderColor: [
                    '#46d8d5',
                    "#f5e132",
                    "#3fe132",
                    "#18a132"
                ],
                hoverBackgroundColor: [
                    '#46d8d5',
                    "#f5e132",
                    "#3fe132",
                    "#18a132"
                ]
            }]
        }
    });


function ProcessChartIncome() {
  if(document.URL.toString().includes("dashboard")){
    var month = $("h1").eq(0).text();
    var year = $("h1").eq(1).text();
    var num_month = getMonthFromString(month);
    var date = num_month.toString() + "-" + year.toString();
    $.ajax({
      type: "POST",
      url: "/user/get/income",
      data: {"date":date},
      dataType: "json",
    }).done(function(data) {
      console.log(data);
      removeData(incomePieChart)
      
      for (const [key, value] of Object.entries(data)) {
        addData(incomePieChart, key, value);
      }
      
    });
  }
}


// Other Dashboard Methods

function getMonthFromString(mon){

  var d = Date.parse(mon + "1, 2012");
  if(!isNaN(d)){
     return new Date(d).getMonth() + 1;
  }
  return -1;
}
