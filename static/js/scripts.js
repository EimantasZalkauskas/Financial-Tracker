// Global
var CURRENT_CURRENCY = "£";

$.ajax({
  url: "/get/precentages/",
    type: "POST",
  success: function(resp) {
    CURRENT_CURRENCY = resp["currency"];
},
  error: function (resp){
}
});

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


// Chart Before Draw

Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.chart.ctx;

      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      var words = txt.split(' ');
      var line = '';
      var lines = [];

      // Break words up into multiple lines if necessary
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (var n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  }
});



// Expenses Tables
function addRowExpenses() {
    var name = jQuery('input[name="ExpensesName"]').val();
    var type = jQuery('select[name="ExpensesType"]').val();
    var amount = jQuery('input[name="ExpensesAmount"]').val();

    if (name != "" && type != " " && amount != ""){
      $('#expensesTable').append('<tr><td><input type="text" name="ExpensesName" class="form-control"></td><td><select class="form-select" name="ExpensesType" aria-label="Payment Type"><option ></option><option value="Needs">Needs</option><option value="Wants">Wants</option><option value="Savings">Savings</option></select></td><td><input type="number" name="ExpensesAmount" class="form-control"></td><td><input type="button" value="X" class="btn btn-danger btn-circle" onclick="deleteRowExpenses(this)"/></td></tr>');
    }
}

$("form[name=expenses]").submit(function (event) {
  var name = jQuery('input[name="ExpensesName"]').val();
  var type = jQuery('select[name="ExpensesType"]').val();
  var amount = jQuery('input[name="ExpensesAmount"]').val();
  var month = $("h1").eq(0).text();
  var year = $("h1").eq(1).text();
  var num_month = getMonthFromString(month);

$.ajax({
  url: "/user/expenses/submit",
    type: "POST",
    data: {"name":name,
          "type":type,
          "amount":amount,
          "month":num_month,
          "year":year},
  success: function(resp) {
  window.location.href = "/dashboard/"+num_month+"/"+year;
},
  error: function (resp){
}
});

event.preventDefault();
});

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
      window.location.href = "/dashboard/"+num_month+"/"+year;
    });
      
}

var expensesPieChart = new Chart(document.getElementById("expensesPieChart"), {
    type: 'pie',
    options: {
        legend: { display: true },
        rotation: -20,
        cutoutPercentage: 50,
        animation: {
            animateScale: true,
        },
        elements: {
          center: {
            text: "",
            color: '#FF6384', // Default is #000000
            fontStyle: 'Roboto', // Default is Arial
            sidePadding: 20, // Default is 20 (as a percentage)
            minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
            lineHeight: 25 // Default is 25 (in px), used for when text wraps
          }
        }
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
      var total = 0;
      removeData(expensesPieChart);
      for (const [key, value] of Object.entries(data)) {
        addData(expensesPieChart, key, value);
        total += parseInt(value);
      }
      addTotal(expensesPieChart, total);
      for (const [key, value] of Object.entries(data)) {
        percentage(parseInt(value), total, key);
      }
    });

  }
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

$("form[name=income]").submit(function (event) {
  var name = jQuery('input[name="IncomeName"]').val();
  var type = jQuery('select[name="IncomeType"]').val();
  var amount = jQuery('input[name="IncomeAmount"]').val();
  var month = $("h1").eq(0).text();
  var year = $("h1").eq(1).text();
  var num_month = getMonthFromString(month);

$.ajax({
  url: "/user/income/submit",
    type: "POST",
    data: {"name":name,
          "type":type,
          "amount":amount,
          "month":num_month,
          "year":year},
  success: function(resp) {
  window.location.href = "/dashboard/"+num_month+"/"+year;
},
  error: function (resp){
}
});

event.preventDefault();
});

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
    window.location.href = "/dashboard/"+num_month+"/"+year;


});
}

var incomePieChart = new Chart(document.getElementById("incomePieChart"), {
    type: 'pie',
    options: {
        legend: { display: true },
        rotation: -20,
        cutoutPercentage: 50,
        animation: {
            animateScale: true,
        },
        elements: {
          center: {
            text: "",
            color: '#47b564', // Default is #000000
            fontStyle: 'Roboto', // Default is Arial
            sidePadding: 20, // Default is 20 (as a percentage)
            minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
            lineHeight: 25 // Default is 25 (in px), used for when text wraps
          }
        }
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
      removeData(incomePieChart)
      var total = 0;
      for (const [key, value] of Object.entries(data)) {
        addData(incomePieChart, key, value);
        total += parseInt(value);
      }
      for (const [key, value] of Object.entries(data)) {
        percentage(parseInt(value), total, key);
      }
      addTotal(incomePieChart, total);
      calcRemaining();
    });
  }
}


// Arrow Methods

function nextArrow(){
    var month = $("h1").eq(0).text();
    var year = parseInt($("h1").eq(1).text());
    var num_month = getMonthFromString(month);
    if(num_month == 12){
      year += 1
      num_month = 1
    }else{
      num_month += 1
    }
    $.ajax({
      type: "GET",
      url: '/dashboard/' + num_month + '/' + year
    })
      .done(function(resp){
        window.location.href = '/dashboard/' + num_month + '/' + year;
      })
  }

  function backArrow(){
    var month = $("h1").eq(0).text();
    var year = parseInt($("h1").eq(1).text());
    var num_month = getMonthFromString(month);
    if(num_month == 1){
      year -= 1
      num_month = 12
    }else{
      num_month -= 1
    }
    $.ajax({
      type: "GET",
      url: '/dashboard/' + num_month + '/' + year
    })
      .done(function(resp){
        window.location.href = '/dashboard/' + num_month + '/' + year;
      })
  }


// Other Dashboard Methods

function getMonthFromString(mon){

  var d = Date.parse(mon + "1, 2012");
  if(!isNaN(d)){
     return new Date(d).getMonth() + 1;
  }
  return -1;
}

function addTotal(chart, total) {
  chart.options.elements.center.text = CURRENT_CURRENCY + total;
  chart.update();
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

function incramentPlusOneToDate(month, year, range){
  value_arr = [];
  date = month.toString() + "-" + year.toString();
  value_arr.push(date);
  for(i=1; i < range ; i++){
    if(month - 1 == 1){
      year -= 1
      month = 12
    }else{
      month -= 1
    }
    date = month.toString() + "-" + year.toString();
    value_arr.push(date);
  }
  return value_arr.reverse();
}

function percentage(partialValue, totalValue, key) {

  $.ajax({
    url: "/get/precentages/",
      type: "POST",
    success: function(resp) {
      key = key.replace(/\s/g, '');
      current =  (100 * partialValue) / totalValue;
      $("#"+key).html(Math.round(current)+"%");
      $("#"+key).parent().css("display", "block");

      if(current > resp[key.toLowerCase()]){
        $("#"+key).css("color", "red");
      }
  },
    error: function (resp){
  }
  });

} 

function calcRemaining(){
  var expenses = expensesPieChart.options.elements.center.text.slice(1);
  var income = incomePieChart.options.elements.center.text.slice(1);
  $("#Remaining").html(CURRENT_CURRENCY + (parseInt(income)-parseInt(expenses)).toString());
  if(income-expenses < 0){
    $("#Remaining").css("color", "red");
  }
}