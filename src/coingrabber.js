function coingrabber(){}


// var SDK = typeof window !== 'undefined' ? window.COIN_API_SDK : require("./coinapi_v1")["default"]
//
// var cryptoApi = new SDK("7F2E3F11-2194-4945-9888-16822C39CCD0"); //"2014-11-02T23:59:59"
// //var numberOfCoins;

function getPrice(coin, date){
  let price = 10; // wil be the price of the coin on a given date in BTC
  return price;
}

function volatility(coin, startDate, nowDate){
  let mean = priceMean(getPrice(coin, startDate), getPrice(coin, nowDate));
  let goodDays = 10; // this will be the number of days the price of the coin is above mean
  let badDays = 10; // this will be the number of days the price of the coin is below mean
  return goodDays / badDays; // may want to process this better for a visual queue
}

function marketCap(){
  return 100000000; // this will actually pull the market cap data from the api results
}

function priceMean(startPrice, nowPrice){
  return (startPrice + nowPrice) /2;
}

function churn (days, numberOfTrades){
  return numberOfTrades / days;
}




function SortCoin(name, id, sortId, imgUrl) {
  this.name = name;
  this.id = id;
  this.sortId = sortId;
  this.imgUrl = imgUrl;
}

var todayDate = function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = yyyy+'-'+mm+'-'+dd;
  return today;
}

var dateUSFormat = function(date) {
  var dd = date.slice(0,2);
  var mm = date.slice(3,5);
  var yyyy = date.slice(6,10);

  var newDate = mm+'/'+dd+'/'+yyyy;
  return newDate;
}

// function calculate(coinType, fiatAmount, fiatType, startDate, endDate) {
//   var sellPrice;
//   var buyPrice;
//   var result;
//   var numberOfCoins;
//   var BuyPriceObject;
//
//   $.get('http://138.197.214.133/api/v1/attendee', function(response) {
// };

$(document).ready(function() {

  var startDate;
  var endDate;
  var coinTest = "";
  var fiatType;
  var fiatAmount;

  $("#buy-date").attr("max", todayDate());
  $("#sell-date").attr("max", todayDate());

  $(".crypto-search-btn").change(function() {
    console.log("hello");
  })


  //disable calculate button until all fields are populated - not working all the way
  // $("input").change(function() {
  //
  //   var empty = false;
  //   //console.log("at the beginning, empty is " + empty)
  //   if ($("#fiat-amount").val() === "") {
  //     empty = true;
  //   }
  //
  //   if ($(".crypto-search-btn").text() === '' || $(".crypto-search-btn").text() === "Cryptocurrency of Choice") {
  //    empty = true;
  //   }
  //
  //   if ($("#buy-date").val() === "") {
  //     empty = true;
  //   }
  //
  //   if ($("#sell-date").val() === "") {
  //     empty = true;
  //   }
  //
  //
  //
  //
  //   //console.log(empty);
  //   if (empty) {
  //     $("button#calculate").attr("disabled", "disabled");
  //   } else {
  //     $("button#calculate").removeAttr("disabled");
  //   }
  //       //console.log("after this change, empty is " + empty);
  //
  // });
// });

  // Make sure user can't select sell date to be before the buy date
  $("#buy-date").change(function() {
    var buyDate = $("input#buy-date").val();
    $("#sell-date").attr("min", buyDate);
  });


  $.get("https://min-api.cryptocompare.com/data/all/coinlist", function(response) {
    var listItems = '';
    var sortedCoins = [];

    //var listItems = '<option selected="selected" value="0">- Select -</option>';
    Object.keys(response.Data).forEach(function(key) {
      var coinName = key;
      var sortId = response.Data[key].SortOrder;
      var imgUrl = response.Data[key].ImageUrl;
      var id = response.Data[key].Id;
      var sortedCoin = new SortCoin(coinName, id, sortId, imgUrl);
      sortedCoins.push(sortedCoin);
    });

    sortedCoins.sort(function(a, b) {
      return a.sortId-b.sortId;
    });

    sortedCoins.forEach(function(sortedCoin) {
      listItems += "<li value='" + sortedCoin.id + "'><a><img class='crypto-icon' src='https://www.cryptocompare.com" + sortedCoin.imgUrl + "'><span class='key-span'>" + sortedCoin.name + "</span></a></li>";
    });

    //$("#coinType").append('<input class="form-control" id="coin-type-input" type="text" placeholder="Search..">');
    $("#coinType").append(listItems);
    $("#coin-type-input").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      //console.log("this is the value for each list item: " + value);
      $("#coinType li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
    $("li").click(function() {
      coinTest = $(this).text();
      $(".crypto-search-btn").text(coinTest);
      $(".crypto-search-btn").attr("value", coinTest);


      var requestStartDate = "https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=" + $(this).val();
      $.get(requestStartDate, function(response) {
        var dateFromAPI = response.Data.General.StartDate;
        var formattedDate = dateUSFormat(dateFromAPI);
        date = new Date(formattedDate);
        date = date.toISOString().slice(0, 10);
        $("#buy-date").attr("min", date);
      });
    });
  });

  $("button#calculate").click(function(event) {
    event.preventDefault();

    $("#moonWell").addClass("moonWellMove");

    var buyPrice;
    var sellPrice;
    startDate = $("input#buy-date").val();

    //coinTest = $("#coinType").val();
    fiatTest = $("#fiatType").val();
    fiatAmount = parseFloat($("input#fiat-amount").val());

    startDate = Date.parse($("input#buy-date").val());
    startDate /= 1000;
    endDate = Date.parse($("input#sell-date").val());
    endDate /= 1000;
    // Config for HTTP request urls
    var requestBuyPrice = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + coinTest + "&tsyms=" + fiatTest + "&ts=" + startDate;
    var requestSellPrice = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + coinTest + "&tsyms=" + fiatTest + "&ts=" + endDate;

    // Output variables
    var buyDate = new Date((startDate * 1000) + 86400000);
    console.log("THIS BUYDATE" + buyDateOutput);
    var sellDate = new Date((endDate * 1000) + 86400000);
    var DateDifferenceOutput = false;
    var fiatSymbol = function convertToSymbol(fiatSymbol) {
      if (fiatSymbol === "USD") {
        fiatSymbol = "$";
      } else if (fiatSymbol === "EUR") {
        fiatSymbol = "€";
      } else if (fiatSymbol === "CAD") {
        fiatSymbol = "$";
      } else if (fiatSymbol === "GBP") {
        fiatSymbol = "£";
      }
      else if (fiatSymbol === "RUR") {
        fiatSymbol = "₽";
      } else if (fiatSymbol === "JPY") {
        fiatSymbol = "¥";
      } else if (fiatSymbol === "CNY") {
        fiatSymbol = "¥";
      } else {
        fiatSymbol = "$";
      }
      return fiatSymbol;
    };

    // These functions change the output date format to month/date/year, e.g. 01/12/2018
    var buyDateOutput = function formatDate(value)
        {
           return value.getMonth()+1 + "/" + value.getDate() + "/" + (value.getYear()+1900); console.log(value.getYear());
        }
    var sellDateOutput = function formatDate(value)
        {
           return value.getMonth()+1 + "/" + value.getDate() + "/" + (value.getYear()+1900); console.log(value.getYear());
        }


    $.get(requestBuyPrice, function(response) {
      var coinVarBuy = response[coinTest];
      buyPrice = coinVarBuy[fiatTest];
      console.log("HERE" + buyPrice);


      $.get(requestSellPrice, function(response) {

        var coinVarSell = response[coinTest];
        sellPrice = coinVarSell[fiatTest];

        var numberOfCoins = fiatAmount / buyPrice;
        var calculateAmountNow = numberOfCoins * sellPrice;
        var profit = Math.round(calculateAmountNow.toFixed(2) - fiatAmount);
        var socialWidgetResult;

        $(".socialWidget").show();

        $(".soc-twitter").attr("href", socialWidgetResult);

        if (profit < 0) {
          $(".result").addClass("red");
          $(".result").html("If I had invested <span title='Buys " + numberOfCoins + " " + coinTest + " on " + buyDateOutput(buyDate) + "'>" + fiatSymbol(fiatTest) + fiatAmount + "</span> in " +  coinTest + "</span> on " + buyDateOutput(buyDate) + " and sold on " + sellDateOutput(sellDate) + " I would have lost <span title='Total value " + fiatSymbol(fiatTest) + Math.round(calculateAmountNow.toFixed(2)) + " on " + sellDateOutput(sellDate) + "'>" + fiatSymbol(fiatTest) + Math.abs(profit) + "</span>");

          // Builidng a message for social media sharing
          socialWidgetResult = ("https://twitter.com/intent/tweet?text=" + "If I had invested " + fiatSymbol(fiatTest) + fiatAmount + " in " +  coinTest + " on " + buyDateOutput(buyDate) + " and sold on " + sellDateOutput(sellDate) + " I would have lost " + fiatSymbol(fiatTest) + Math.abs(profit) + " #FOMO.CHURCH #CRYPTO #BTC #ETH");

        } else {
          $(".result").removeClass("red");
          $(".result").html("If I had invested <span title='Buys " + numberOfCoins + " " + coinTest + " on " + buyDateOutput(buyDate) + "'>" + fiatSymbol(fiatTest) + fiatAmount + "</span> in " +  coinTest + "</span> on " + buyDateOutput(buyDate) + " and sold on " + sellDateOutput(sellDate) + " I would have made <span title='Total value " + fiatSymbol(fiatTest) + Math.round(calculateAmountNow.toFixed(2)) + " on " + sellDateOutput(sellDate) + "'>" + fiatSymbol(fiatTest) + Math.abs(profit) + "</span>");

          // Builidng a message for social media sharing
          socialWidgetResult = ("https://twitter.com/intent/tweet?text=" + "If I had invested " + fiatSymbol(fiatTest) + fiatAmount + " in " +  coinTest + " on " + buyDateOutput(buyDate) + " and sold on " + sellDateOutput(sellDate) + " I would have made " + fiatSymbol(fiatTest) + Math.abs(profit) + "&?hashtags=FOMO.CHURCH ,CRYPTO ,BTC ,ETH");
        }

        $(".soc-twitter").attr("href", socialWidgetResult);

      });

// $(".result").html("If I had invested <span title='" + numberOfCoins + coinTest + "'>" fiatSymbol(fiatTest) + fiatAmount + "</span> in " +  coinTest + " on " + buyDateOutput(buyDate) + " and sold on " + sellDateOutput(sellDate) + " I would have lost <span title='Total " + fiatSymbol(fiatTest) + Math.round(calculateAmountNow.toFixed(2)) + "'>" + fiatSymbol(fiatTest) + Math.abs(profit) + "</span>");
//

    });



  });
});
export { coingrabber }
