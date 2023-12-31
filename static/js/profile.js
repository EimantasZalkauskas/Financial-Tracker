var expensesBarChart = new Chart(document.getElementById("expensesBarChart"), {
    type: 'bar',
    options: {
      legend: {
        display: false
      },
     tooltips: {
        enabled: false
      },
      title: {
        display: false,
      },
      scales: {
        y: {
          beginAtZero: true
        },
        gridLines: {
            display: false
          }
        },
      animation: {
          animateScale: true,
      },
    },
    data: {
        labels: [],
        datasets: [
            {
                data: [],
                borderWidth: 1,
                backgroundColor: ["#3e95cd", "#3e95cd","#3e95cd","#3e95cd","#3e95cd","#3e95cd"],
                backgroundColorOnHover: ["#3e95cd", "#3e95cd","#3e95cd","#3e95cd","#3e95cd","#3e95cd"],
            }]
        }
    });

var incomeBarChart = new Chart(document.getElementById("incomeBarChart"), {
      type: 'bar',
      options: {
        legend: {
          display: false
        },
       tooltips: {
          enabled: false
        },
        title: {
          display: false,
        },
        scales: {
          y: {
            beginAtZero: true
          },
          gridLines: {
              display: false
            }
          },
        animation: {
            animateScale: true,
        },
      },
      data: {
          labels: [],
          datasets: [
              {
                  data: [],
                  borderWidth: 1,
                  backgroundColor: ["#3e95cd", "#3e95cd","#3e95cd","#3e95cd","#3e95cd","#3e95cd"],
                  backgroundColorOnHover: ["#3e95cd", "#3e95cd","#3e95cd","#3e95cd","#3e95cd","#3e95cd"],
              }]
          }
      });


// Profile Bar Charts
function ProcessBarChartExpenses() {
  if(document.URL.toString().includes("summary")){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    var date = new Date();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    var num_month = getMonthFromString(month);
    var date_arr = incramentPlusOneToDate(num_month, year, 6);
    $.ajax({
      type: "POST",
      url: "/user/get/totals/expenses",
      data: {"date1": date_arr[0],
            "date2": date_arr[1],
            "date3": date_arr[2],
            "date4": date_arr[3],
            "date5": date_arr[4],
            "date6": date_arr[5],},
      dataType: "json",
    }).done(function(data) {
      sorted_dict = sort_month_year(data[0]);
      var total = 0;
      // Get date range
      getDateRange(sorted_dict);
      //Get average expenses
      for (const [key, value] of Object.entries(sorted_dict)) {
        addData(expensesBarChart, key, value);
        total += value;
      }
      // Total Avg Calc
      $("#total-expenses").html(CURRENT_CURRENCY + total);
      $("#avg-expenses").html(CURRENT_CURRENCY + Math.round(total / Object.keys(sorted_dict).length));

      // Avg Precentage Calc
      var pref_totals = {}
      for(i=0; i < data[2].length; i++){
        for(y=0; y < data[2][i].length; y++){
          if(data[2][i][y]["type"] in pref_totals){
            current_amount = pref_totals[data[2][i][y]["type"]];
            pref_totals[data[2][i][y]["type"]] = parseInt(current_amount) + parseInt(data[2][i][y]["amount"]);
          }
          else{
            pref_totals[data[2][i][y]["type"]] = parseInt(data[2][i][y]["amount"]);
          }
        }
      }
      console.log(pref_totals);
      for (const [key, value] of Object.entries(pref_totals)) {
        percentage(value, total, key);
      }

      // Precentage Calc
      $("#needs").html(data[1]["needs"]+"%");
      $("#wants").html(data[1]["wants"]+"%");
      $("#savings").html(data[1]["savings"]+"%");
      
    });
  }
  }

  function ProcessBarChartIncome() {
    if(document.URL.toString().includes("summary")){
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
      var date = new Date();
      var month = months[date.getMonth()];
      var year = date.getFullYear();
      var num_month = getMonthFromString(month);
      var date_arr = incramentPlusOneToDate(num_month, year, 6);
      $.ajax({
        type: "POST",
        url: "/user/get/totals/income",
        data: {"date1": date_arr[0],
              "date2": date_arr[1],
              "date3": date_arr[2],
              "date4": date_arr[3],
              "date5": date_arr[4],
              "date6": date_arr[5],},
        dataType: "json",
      }).done(function(data) {
        sorted_dict = sort_month_year(data);
        var total = 0;

        //Get average income

        for (const [key, value] of Object.entries(sorted_dict)) {
          addData(incomeBarChart, key, value);
          total += value;
        }
        $("#total-income").html(CURRENT_CURRENCY+total);
        $("#avg-income").html(CURRENT_CURRENCY + Math.round(total / Object.keys(sorted_dict).length));
        
      });
    }
    }

function getDateRange(dict_values){
  var first = Object.keys(dict_values)[0];
  var last = Object.keys(dict_values)[Object.keys(dict_values).length -1];

  $("#summary-date-range").html("Summary " + first + " - " + last);
}

function calcAverage(dict_values){
  
}

function sort_month_year(date){
    arr = [];
    new_dict = {};
    for(let key in date){
        arr.push(key);
    }
    var sorted = arr.sort(function(a,b) {
        a = a.split("-");
        b = b.split("-")
        return new Date(a[1], a[0], 1) - new Date(b[1], b[0], 1)
    });
    for(i = 0; i <  Object.keys(date).length; i++){
        new_dict[sorted[i]] = date[sorted[i]];
    }
    return new_dict;

}
