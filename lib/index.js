function location(data, local) {
  if (data.timezone.indexOf("America") !== -1) {
    return "<h2 class='local'>"+ local +"</h2><h3 class='country'>United States</h3>"
  } else {
    return "<h2 class='local'>"+ local +"</h2><h3 class='country'>"+ data.timezone +"</h3>";
  }
}

function current(data, local) {
  var location_string = location(data,local);

  return "<section class='current'><div class='icon weather-" + data.currently.icon + "'><p>" + data.currently.summary + "</p></div><h3 class='temp'>" + data.currently.temperature + "&deg;</h3>" + location_string + "<p>" + data.currently.time + "</p></section>";
}

function details(data, local) {
  return "<section class='details'><div class='icon weather-" + data.currently.icon + "'><h3>" + data.currently.summary + "</h3></div><p>Feels Like: " + data.currently.apparentTemperature + "&deg;</p><p>Humidity: " + data.currently.humidity + "%</p><p>Visibility: " + data.currently.visibility + " miles</p><p>UV Index: "+ data.currently.uvIndex + "</p></section>";
}

function hourly_structure(v) {
  return "<div class='hour'><h4>" + v.time + "</h4><div class='icon weather-" + v.icon + "'></div><p>" + v.temperature + "&deg;</p></div>";
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
  return "<section class='hourly'><h3>Hourly Forecast</h3>" + hourly_objects(data.hourly["data"]) + "</section>";
}

function daily_structure(v) {
  return "<div class='day'><h4>" + v.time + "</h4><div class='icon weather-" + v.icon + "'><p>" + v.summary + "</p></div><div class='icon precip-" + v.precipType + "'><p>" + v.precipProbability + "</p></div><div class='icon high'><p>" + v.temperatureHigh + "&deg;</p></div><div class='icon low'><p>" + v.temperatureLow + "&deg;</p></div></div>";
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
  return "<section class='daily'><h3>5 Day Forecast</h3>" + daily_objects(data.daily["data"]) + "</section>";
}

function handle_it(data, local) {
  var current_string = current(data,local);
  var details_string = details(data,local);
  var hourly_string = hourly(data,local);
  var daily_string = daily(data,local);
  $("#main").html(current_string + details_string + hourly_string + daily_string);
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
