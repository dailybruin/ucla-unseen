var dataURL = "https://spreadsheets.google.com/feeds/list/11bSWs8Lf_MvvvbE19rgKXyWmQ4OjM5bWwhm16-fpEYM/od6/public/values?alt=json";

// takes in JSON object from google sheets and turns into a json formatted
// this way based on the original google Doc
// [
// 	{
// 		'column1': info1,
// 		'column2': info2,
// 	}
// ]
function clean_google_sheet_json(data){
	var formatted_json = [];
	var elem = {};
	var real_keyname = '';
	$.each(data.feed.entry.reverse(), function(i, entry) {
		elem = {};
		$.each(entry, function(key, value){
			// fields that were in the spreadsheet start with gsx$
			if (key.indexOf("gsx$") == 0)
			{
				// get everything after gsx$
				real_keyname = key.substring(4);
				elem[real_keyname] = value['$t'];
			}
		});
		formatted_json.push(elem);
	});
	return formatted_json;
}

// Gets data from Google Spreadsheets
$.getJSON(dataURL, function(json){
		var data = clean_google_sheet_json(json);
    var source   = $("#card-template").html();
    var cardTemp = Handlebars.compile(source);

    $("#content").append(cardTemp({apidata: data}));

    var mapMarkers = new Array();
    var infoWindows = new Array();

    $.each(data, function (index, value){
      mapMarkers[mapMarkers.length] = new google.maps.Marker({
          position: new google.maps.LatLng(value["lattitude"], value["longitude"]),
          map: map,
          draggable: false,
          animation: google.maps.Animation.DROP,
          title: value["title"],
          icon: "http://www.clker.com/cliparts/G/I/o/L/E/h/blue-pin-th.png"
      });

      var markerIndex = mapMarkers.length-1;
      google.maps.event.addListener(mapMarkers[markerIndex], 'click', function() {
          map.panTo(mapMarkers[markerIndex].position);
          $('html, body').animate({
              scrollTop: $("#card-" + (markerIndex)).offset().top-75
          }, 1000);
        });
    })
});
