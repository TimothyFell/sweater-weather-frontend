var moment = require('moment');

function reformat_date(unix) {
  return new Date(unix * 1000);
}

function get_time_and_date(unix) {
  var date = reformat_date(unix);
  return date.toLocaleString();
}

function get_hour(unix) {
  var date = reformat_date(unix);
  var hours = date.getHours();
  if (hours == 0) {
    var current_hour = "12 AM";
    return current_hour
  } else if (hours > 12) {
    var current_hour = (hours - 12).toString() + " PM";
    return current_hour
  } else if (hours = 12) {
    var current_hour = "12 PM";
    return current_hour
  } else {
    var current_hour = hours.toString() + " AM";
    return current_hour
  }
}

function get_day(unix) {
  var days = {1:"Monday", 2:"Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 0: "Sunday"};
  var day = reformat_date(unix).getDay();
  var day_name = days[day]
  return day_name
}

function percentage(decimal) {
  var percent = Math.round(decimal * 100);
  return percent;
}

function current(data, local) {
  return "<section class='current'><div class='weather-data'>"
  + "<div class='icon weather-" + data.currently.icon + "'></div><p>"
  + data.currently.summary + "</p><h3 class='temp'>"
  + data.currently.temperature + "&deg;</h3><p>High: "
  + data.daily["data"][0].temperatureHigh + "&deg; Low: "
  + data.daily["data"][0].temperatureLow + "&deg;</p></div>"
  + "<div class='location-data'><h2 class='local'>" + local
  + "</h2><p class='country'>" + data.timezone + "</p><p>"
  + get_time_and_date(data.currently.time) + "</p></div></section>";
}

function details(data, local) {
  return "<section class='details'><div class='weather-display'><div class='icon weather-"
  + data.currently.icon + "'></div><h3>" + data.currently.summary
  + "</h3></div><div class='weather-details'><p>Feels Like: " + data.currently.apparentTemperature
  + "&deg;</p><p>Humidity: " + percentage(data.currently.humidity)
  + "%</p><p>Visibility: " + data.currently.visibility
  + " miles</p><p>UV Index: "+ data.currently.uvIndex + "</p></div></section>";
}

function hourly_structure(v) {
  return "<div class='hour'><h4>" + get_hour(v.time)
  + "</h4><div class='icon weather-" + v.icon + "'></div><p>"
  + v.temperature + "&deg;</p></div>";
}

function hourly_objects(hourly_data) {
  var limited_hourly_data = hourly_data.slice(0,8);
  var hourly_string = "";
  limited_hourly_data.forEach(function(v) {
    hourly_string += hourly_structure(v)
  })
  return hourly_string
}

function hourly(data, local) {
  return "<section class='hourly'><h3>Hourly Forecast</h3><div class='hours'>"
  + hourly_objects(data.hourly["data"]) + "</div></section>";
}

function daily_structure(v) {
  return "<div class='day'><h4>" + get_day(v.time)
  + "</h4><div class='condition'><div class='icon weather-" + v.icon + "'></div><p>"
  + v.summary + "</p></div><div class='precip'><div class='icon precip-"
  + v.precipType + "'></div><p>" + percentage(v.precipProbability)
  + "%</p></div><div class='high-temp'><div class='icon high'></div><p>" + v.temperatureHigh
  + "&deg;</p></div><div class='low-temp'><div class='icon low'></div><p>"
  + v.temperatureLow + "&deg;</p></div></div>";
}

function daily_objects(daily_data) {
  var limited_daily_data = daily_data.slice(0,8);
  var daily_string = "";
  limited_daily_data.forEach(function(v) {
    daily_string += daily_structure(v)
  })
  return daily_string
}

function daily(data, local) {
  return "<section class='daily'><h3>5 Day Forecast</h3><div class='days'>"
  + daily_objects(data.daily["data"]) + "</div></section>";
}

function handle_it(data, local) {
  var current_string = current(data,local);
  var details_string = details(data,local);
  var hourly_string = hourly(data,local);
  var daily_string = daily(data,local);
  $("#main").html("<div class='current-weather'>" + current_string + details_string + "</div>" + hourly_string + daily_string);
}

function search_location() {
  var local = $("#location").val();
  var url = "https://shielded-tor-51189.herokuapp.com/api/v1/forecast?location=" + local;
  $.get(url).done( function (data) {
    handle_it(data, local);
  })
}

$(document).ready( function() {

  $("#search").click(search_location);

  $("#location").keypress( function( e ) {
    if ( e.which == 13 ) {
      $("#search").click();
    }
  });


})
