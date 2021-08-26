var map = new ol.Map({
    target: 'map',
    renderer: 'webgl',
    controls : ol.control.defaults({
      attribution : false,
      zoom : false,
    }),
    loadTilesWhileAnimating: true,
    loadTilesWhileInteracting: true,
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: new ol.proj.fromLonLat([121, 23.4696923]),
      zoom: 8
    })
  });


  $(".sidebar-item").click(function () {
    $(".sidebar-item.active").removeClass('active')
    $(this).addClass('active')
 });
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

map.on('singleclick', function(e){
  // alert(e.coordinate);
  alert(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));
  
      // 通過getEventCoordinate方法獲取地理位置，再轉換為wgs84座標，並彈出對話方塊顯示
  // alert(map.getEventCoordinate(e.originalEvent));
      // alert(ol.proj.transform(map.getEventCoordinate(e.originalEvent), 'EPSG:3857', 'EPSG:4326'));
  
      // var lonlat = map.getCoordinateFromPixel(e.pixel);
    // alert(lonlat);
      // alert(ol.proj.transform(lonlat,"EPSG:3857", "EPSG:4326")); //由3857座標系轉為4326
　　　　 
  })

  $('#myTab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })