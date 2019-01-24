
function setup_search() {
  $("#main").html("<h2>Please search for a location's weather!</h2><input class='input-field' type='text' placeholder='Ex: New York, NY' id='location'><input class='btn' type='submit' value='Search' id='search'>");
}

function location(data, local) {
  if (data.timezone.indexOf("America") !== -1) {
    return "<h2 class='local'>"+ local +"</h2><h3 class='country'>United States</h3>"
  } else {
    return "<h2 class='local'>"+ local +"</h2><h3 class='country'>"+ data.timezone +"</h3>"
  }
}

function current(data, local) {
  var location_string = location(data,local);

  return "<div class='current'><p>" + data.currently.icon + data.currently.summary + "</p><h3 class='temp'>" + data.currently.temperature + " degrees</h3>" + location_string + "<p>" + data.currently.time + "</p></div>"
}

function details(data, local) {
  return "<div class='details'><h3>" + data.currently.icon + data.currently.summary + "</h3><p>Feels Like: " + data.currently.apparentTemperature + " degrees</p><p>Humidity: " + data.currently.humidity + "%</p><p>Visibility: " + data.currently.visibility + " miles</p><p>UV Index: "+ data.currently.uvIndex + "</p></div>"
}

function hourly(data, local) {

}

function daily(data, local) {

}

function handle_it(data, local) {
  var current_string = current(data,local);
  var details_string = details(data,local);
  var hourly_string = hourly(data,local);
  var daily_string = daily(data,local);
  debugger;
  $("#main").html(current_string + details_string + hourly_string + daily_string);
}

function search_location() {
  var local = $("#location").val();
  var url = "https://shielded-tor-51189.herokuapp.com/api/v1/forecast?location=" + local;
  $.get(url).done( function (data) {
    handle_it(data, local);
    alert("Knailed it!");
  })
}

window.onload = setup_search();

$(document).ready( function() {

  $("#search").click(search_location);

  $("#location").keypress( function( e ) {
    if ( e.which == 13 ) {
      $("#search").click();
    }
  });


})
