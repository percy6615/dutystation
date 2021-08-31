import MapClass from "/js/map/map_class.js";
var mapClass = new MapClass();
var _map = mapClass.getMap();

$(document).ready(function () {

  $("#manager").on("click", function (e) {
    clickMenu(".map");
  })

  $("#profile").on("click", function (e) {
    clickMenu(".org");
  });

  $("#setting").on("click", function (e) {
    mapClass.satelliteMap()
  });

  $(".sidebar-item").click(function () {
    $(".sidebar-item.active").removeClass('active')
    $(this).addClass('active')
  });
})
// window._map = _map
// window.mapClass = mapClass
function clickMenu(type) {
  $("main > div").css("display", "none");
  $(type).fadeIn();
  $(type).fadeIn("slow");
  $(type).fadeIn("10000");
  $(type).css("display", "block");
}
// map.setCenter(new OpenLayers.LonLat(0, 0), 0);

// var newl = new OpenLayers.Layer.Text( "text", { location:"./textfile.txt"} );
// map.addLayer(newl);

// var markers = new OpenLayers.Layer.Markers( "Markers" );
// map.addLayer(markers);

// var size = new OpenLayers.Size(21,25);
// var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
// var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
// markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon));

// var halfIcon = icon.clone();
// markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,45),halfIcon));

// marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon.clone());
// marker.setOpacity(0.2);
// marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });
// markers.addMarker(marker); 
// map.addControl(new OpenLayers.Control.LayerSwitcher());
// map.zoomToMaxExtent();

// halfIcon.setOpacity(0.5);



// $('#myTab a').on('click', function (e) {
//   e.preventDefault()
//   $(this).tab('show')
//   $(this).click();
// })







