var myLatLng;

function initMilesAway(locationLat, locationLong, index){
  //point is should be the dining location coordinates
  var point1 = {lat:locationLat, lng:locationLong};
  var distance = getDistance(myLatLng, point1);
  //document.getElementById('theMiles' + index).innerHTML = distance + ' miles';
  return distance;
}

var rad = function(x) {
  return x * Math.PI / 180;
};

//function to get the distance between user and location
var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  d = d*0.000621371192;
  d = parseFloat(d).toFixed(2);
  return d;  // returns the distance in miles
};

function refreshQuarterly() {
  setInterval(function(){
    var minutes = (new Date()).getMinutes();
    if ( !minutes%15 ) location.reload(); // if minutes is a multiple of 15
  }, 60000); //check every minute
}

//when the page loads, ask for user permission for using location
function onPageLoad(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(sendLocation);
    } else {
    alert("Geolocation is not supported by this browser.");
    }
    refreshQuarterly();
}

function myMap(){
 /*just leave this blank function here.
 The googlemaps api calls this one automatically on page load.
 Initially it called initMap, but that was doing things that
 I didn't want it to do right away, so we need this blank function here*/
}

function sendLocation(position){
  myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
  loadTheTable();
}

function initMap(theLat, theLong, index) {
  //blue circle is for user's location
  var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
  var bounds = new google.maps.LatLngBounds();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var myLatLng = {
      	lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      //initialize the map
      var map = new google.maps.Map(document.getElementById('map' + index), {
    		zoom: 14,
    		center: myLatLng
  	  });

      //add a marker for the user's location
      var marker1 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'My Location',
        icon: im
      });

      bounds.extend(marker1.position);

      //add a marker for the dining location
      var location = {lat: theLat, lng: theLong};
      var marker2 = new google.maps.Marker({
        position: location,
        map: map
      });

      //fit the map to show both user location and dining location
      bounds.extend(marker2.position);
      map.fitBounds(bounds);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function loadTheTable(){
  $.getJSON("regularHours.json", function(data) {
    var locationsArray = [];
    var index = 0;
    $.each(data, function (key, val) {
      console.log('------' + val._id + '------');
      //get information about whether the location is closed or open and the 'open till' description if location is open
      getDateTimeInfo();
      var locationStatus; //0=closed, 1=open, 2=24hours
      var closed = false;
      var dateString;
      switch(day){
        case 0: dateString = val.Sunday; break;
        case 1: dateString = val.Monday; break;
        case 2: dateString = val.Tuesday; break;
        case 3: dateString = val.Wednesday; break;
        case 4: dateString = val.Thursday; break;
        case 5: dateString = val.Friday; break;
        case 6: dateString = val.Saturday; break;
      }
      if(dateString === "CLOSED"){
        //closed = true;
        status = 0;
      }
      else if(dateString === "24 HOURS"){
        status = 2;
      }
      else{
        //need to further parse the dateString;
        var displayLocClosing;
        var locClosHr;
        var locClosMin;
        var locOpenHr;
        var locOpenMin;
        var splitForTime = dateString.split("&#45; ");
        displayLocClosing = splitForTime[1];
        var splitStringArray = dateString.split(" ");
        //console.log(splitStringArray);
        locClosAmPm = splitStringArray[4];
        locClosHr = splitStringArray[3];
        var getHour = locClosHr.split(":");
        locClosHr = getHour[0];
        locClosMin = getHour[1];
        locClosMin = parseInt(locClosMin);
        locOpenHr = splitStringArray[0];
        var getOpen = locOpenHr.split(":");
        //console.log(getOpen);
        theLocOpenHr = getOpen[0];
        theLocOpenHr = parseInt(theLocOpenHr);
        locOpenMin = getOpen[1];
        var theLocClosHr;
        //console.log('locClosHr: ' + locClosHr);
        switch(locClosHr){
          case '1':
            if(locClosAmPm === 'AM')
              duration =
              theLocClosHr = 1;
            else
              theLocClosHr = 13;
            break;
          case '2':
            if(locClosAmPm === 'AM')
              theLocClosHr = 2;
            else
              theLocClosHr = 14;
            break;
          case '3':
            if(locClosAmPm === 'AM')
              theLocClosHr = 3;
            else
              theLocClosHr = 15;
            break;
          case '4':
            if(locClosAmPm === 'AM')
              theLocClosHr = 4;
            else
              theLocClosHr = 16;
            break;
          case '5':
            if(locClosAmPm === 'AM')
              theLocClosHr = 5;
            else
              theLocClosHr = 17;
            break;
          case '6':
            if(locClosAmPm === 'AM')
              theLocClosHr = 6;
            else
              theLocClosHr = 18;
            break;
          case '7':
            if(locClosAmPm === 'AM')
              theLocClosHr = 7;
            else
              theLocClosHr = 19;
            break;
          case '8':
            if(locClosAmPm === 'AM')
              theLocClosHr = 8;
            else
              theLocClosHr = 20;
            break;
          case '9':
            if(locClosAmPm === 'AM')
              theLocClosHr = 9;
            else
              theLocClosHr = 21;
            break;
          case '10':
            if(locClosAmPm === 'AM')
              theLocClosHr = 10;
            else
              theLocClosHr = 22;
            break;
          case '11':
            if(locClosAmPm === 'AM')
              theLocClosHr = 11;
            else
              theLocClosHr = 23;
            break;
          case '12':
            if(locClosAmPm === 'AM')
              theLocClosHr = 0;
            else
              theLocClosHr = 12;
            break;
        }
        
        //console.log('theLocClosHr: ' + theLocClosHr);
        //console.log('theLocClosMin: ' + locClosMin);
        //console.log('theLocOpenHr: ' + theLocOpenHr);
        //console.log('locClosAmPm: ' + locClosAmPm); 
        locOpenMin = parseInt(locOpenMin);
        theMinutes = parseInt(theMinutes);
        //console.log('locOpenMin: ' + locOpenMin); 
        if(theHours == theLocOpenHr){
          if(theMinutes < locOpenMin){
            //console.log('1');
            status = 0;
          }
          else{
            status = 1;
            //console.log('2');
          }
        }
        else if(theHours < theLocOpenHr && locClosAmPm === 'AM'){
          if(theHours < theLocClosHr){
            //console.log('3');
            status = 1;
          }
          else if(theHours == theLocClosHr){
            if(theMinutes < locClosMin){
              status = 1;
              //console.log('4');
            }
            else{
              status = 0;
              //console.log('5');
            }
          }
          else{
            status = 0;
            //console.log('6');
          }
        }
        else if(theLocOpenHr < theHours && theHours < theLocClosHr){
          status = 1;
          //console.log('7');
        }
        else if(theLocOpenHr < theHours && theHours == theLocClosHr){
          if(theMinutes < locClosMin){
            status = 1;
            //console.log('8');
          }
          else{
            status = 0;
            //console.log('9');
          }
        }
        else if(theHours > theLocClosHr && locClosAmPm === 'AM'){
          status = 1;
          //console.log('10');
        }
        else{
          status = 0;
          //console.log('11');
        }
      }

      //console.log(val._id);
      //console.log(status);
      if(status == 0){
        var content1 = "<tr class=\"tableRows\" id=\"tableRow" + index + "\"> <td class=\"col-md-4\" id=\"" + val._id + "\"><img src=\"" + val.logoLocation + "\" alt=\"" + val._id + " Logo\" class=\"logos\" id=\"theLogo" + index + "\"><p class=\"miles\" id=\"theMiles" + index + "\"></p></td> <td class=\"locationPreview\"> <h3 class=\"locationName\">" + val._id + "</h3> <h4 class=\"openTill\" id=\"openTill" + index + "\"></h4> <center><i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i></center> </td> </tr> <tr class=\"expandedInformation\"> <td class=\"col-md-4 weeklyHours\"> <h5 class=\"hoursHeading\">Weekly Hours</h5><h6 id=\"dynamicHoursLoadClosed" + index + "\"></h6> </td> <td class=\"displayMap\" id=\"map" + index + "\"> </td> </tr>";
        var content2 = "Monday: " + val.Monday + "<br>Tuesday: " + val.Tuesday + "<br>Wednesday: " + val.Wednesday + "<br>Thursday: " + val.Thursday + "<br>Friday: " + val.Friday + "<br>Saturday: " + val.Saturday + "<br>Sunday: " + val.Sunday;
        theDistance = initMilesAway(val.theLat, val.theLong, index);
        locationsArray.push([theDistance, status, content1, content2, index, "Closed now"]);
        ++index;
      }
      else{
        var content1 = "<tr class=\"tableRows\" id=\"tableRow" + index + "\"> <td class=\"col-md-4\" id=\"" + val._id + "\"><img src=\"" + val.logoLocation + "\" alt=\"" + val._id + " Logo\" class=\"logos\" id=\"theLogo" + index + "\"><p class=\"miles\" id=\"theMiles" + index + "\"></p></td> <td class=\"locationPreview\"> <h3 class=\"locationName\">" + val._id + "</h3> <h4 class=\"openTill\" id=\"openTill" + index + "\"></h4> <center><i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i></center> </td> </tr> <tr class=\"expandedInformation\"> <td class=\"col-md-4 weeklyHours\"> <h5 class=\"hoursHeading\">Weekly Hours</h5><h6 id=\"dynamicHoursLoadOpen" + index + "\"></h6> </td> <td class=\"displayMap\" id=\"map" + index + "\"> </td> </tr>";
        var content2 = "Monday: " + val.Monday + "<br>Tuesday: " + val.Tuesday + "<br>Wednesday: " + val.Wednesday + "<br>Thursday: " + val.Thursday + "<br>Friday: " + val.Friday + "<br>Saturday: " + val.Saturday + "<br>Sunday: " + val.Sunday;
        theDistance = initMilesAway(val.theLat, val.theLong, index);
        if(status == 1)
          locationsArray.push([theDistance, status, content1, content2, index, displayLocClosing]);
        else
          locationsArray.push([theDistance, status, content1, content2, index, "24 Hours"]);
        ++index;
      }
    });

    var sortedArray = sortTheTable(locationsArray);
    for(var q = 0; q < sortedArray.length; q++){
      index = sortedArray[q][4];
      //location is closed, append to the closed table
      if(sortedArray[q][1] == 0){
        $("#dynamicRowLoadClosed").append(sortedArray[q][2]);
        document.getElementById('openTill' + index).innerHTML = "Closed now";
        document.getElementById('tableRow' + index).style = "background-color: rgba(222,222,222, 0.3); color: rgba(185,185,185, 0.9);";
        document.getElementById('openTill' + index).style = "color: red;";
        document.getElementById('theLogo' + index).style = "opacity: 0.4;";
        $("#dynamicHoursLoadClosed" + index).html(sortedArray[q][3]);
        document.getElementById('theMiles' + index).innerHTML = sortedArray[q][0] + ' miles';
      }
      //location is open, append to the open table
      else{
        $("#dynamicRowLoadOpen").append(sortedArray[q][2]);
        $("#dynamicHoursLoadOpen" + index).html(sortedArray[q][3]);
        document.getElementById('theMiles' + index).innerHTML = sortedArray[q][0] + ' miles';
        document.getElementById('openTill' + index).innerHTML = 'Open until ' + sortedArray[q][5];
        document.getElementById('openTill' + index).style = "color: green;";
      }
    }
  });
}

function sortTheTable(myArray){
  var length = myArray.length;
  console.log(length);
  var value, i, j;
  for(i = 0; i < length; i++){
    value = myArray[i];
    for(j=i-1; j > -1 && myArray[j][0] > value; j--){
      myArray[j+1] = myArray[j];
    }
    myArray[j+1] = value;
  }
  return myArray;
}

$('#dynamicRowLoadOpen').on('click', '.tableRows', function() {
  $(this).closest('tr').next('.expandedInformation').toggle();
  theId = $(this)[0].cells[0].id;

  //load the map when the user clicks on the row. This saves a lot of time instead of loading them all on page load
  //loop through json to get the coordinates and pass them to the initMap function
  $.getJSON("regularHours.json", function(data) {
    var index = 0;
    $.each(data, function (key, val) {
      	if(theId.includes("'")){
      		theId = theId.replace("'", "&#39")
      	} 
      if(theId === val._id){
        initMap(val.theLat, val.theLong, index);
      }
      ++index;
    });
  });
});

$('#dynamicRowLoadClosed').on('click', '.tableRows', function() {
  $(this).closest('tr').next('.expandedInformation').toggle();
  theId = $(this)[0].cells[0].id;

  //load the map when the user clicks on the row. This saves a lot of time instead of loading them all on page load
  //loop through json to get the coordinates and pass them to the initMap function
  $.getJSON("regularHours.json", function(data) {
    var index = 0;
    $.each(data, function (key, val) {
      	if(theId.includes("'")){
      		theId = theId.replace("'", "&#39")
      	} 
      if(theId === val._id){
        initMap(val.theLat, val.theLong, index);
      }
      ++index;
    });
  });
});

var day;
var amPm;
var theHours;
var theMinutes;

function getDateTimeInfo(){
  var currentDate = new Date();
  day = currentDate.getDay();
  theHours = currentDate.getHours();
  theMinutes = currentDate.getMinutes();
  //day = 4;
  //theHours = 13;
  //theMinutes = 28;
  //console.log('day is : ' + day);
  //console.log('theHours is : ' + theHours);
  //console.log('theMinutes is : ' + theMinutes);

}

    $("#myInput").on("keyup", function() {
        var total = $(".tableRows").length,
            searchTest = new RegExp(this.value, 'i');

        $(".tableRows").each(function(index) {
            var name = $(this).find('.locationName').text(),
                matches = searchTest.test(name);

            if (matches) {
                $(this).show();
            } else {
                $(this).hide();
                total--;
            }
        });

        $("#noResults").toggle(total === 0);
    });

    $("#searchForm").submit(function() {
        return false;
    });

// Search Function
/*function search() {
  var noResults = document.getElementById('noResults');
  var input, filter, table, tr, td, i, tr2, table2, td2, results; //added results
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table1 = document.getElementById("openTable");
  tr = table1.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        noResults.innerHTML = "";
      } else {
        tr[i].style.display = "none";
      }
    }
        results = true; //removed else, added results

}
    // if elements are in closedTable
        // we want to parse elements
  table2 = document.getElementById("closedTable");
  tr2 = table2.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td2 = tr2[i].getElementsByTagName("td")[0];
    if (td2) {
      if (td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr2[i].style.display = "";
        noResults.innerHTML = "";
      } else {
        tr2[i].style.display = "none";
      }
    }
      results = true; //removed else, added results
    }


if (results == false){ 
        noResults.innerHTML = "No Results Found!";  //moved errormessage here
 }

} */ 


//source: https://developers.google.com/maps/documentation/javascript/examples/marker-simple
//source: https://developers.google.com/maps/documentation/javascript/geolocation
//source: http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
