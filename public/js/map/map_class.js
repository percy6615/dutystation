export default class MapClass {
  constructor() {
    this.map = this.createmap();
    console.log("new")
  }
  createmap() {
    var map = new ol.Map({
      target: 'map',
      renderer: 'webgl',
      controls: ol.control.defaults({
        attribution: false,
        zoom: false,
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

    this.singleclick(map)

    return map;
  }
  singleclick(map) {
    map.on('singleclick', function (e) {
      // alert(e.coordinate);
      alert(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));
      // 通過getEventCoordinate方法獲取地理位置，再轉換為wgs84座標，並彈出對話方塊顯示
      // alert(map.getEventCoordinate(e.originalEvent));
      // alert(ol.proj.transform(map.getEventCoordinate(e.originalEvent), 'EPSG:3857', 'EPSG:4326'));
      // var lonlat = map.getCoordinateFromPixel(e.pixel);
      // alert(lonlat);
      // alert(ol.proj.transform(lonlat,"EPSG:3857", "EPSG:4326")); //由3857座標系轉為4326
    })
  }

  getMap() {
    return this.map;
  }

  satelliteMap() {
    this.addWMTSLayer('https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}', "taiwan-sate")
    this.addWMTSLayer('https://wmts.nlsc.gov.tw/wmts/EMAP2/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}', "taiwan-sate-road")

  }
  addTileLayer() {

  }
  addWMTSLayer(_url, _id) {
    var projection = ol.proj.get('EPSG:3857');
    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(21);
    var matrixIds = new Array(21);
    for (var z = 0; z < 21; ++z) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }
    var layer = new ol.layer.Tile
      ({
        source: new ol.source.WMTS({
          url: _url,
          layer: 'EMAP',
          crossOrigin: "anonymous",
          requestEncoding: "REST",
          matrixSet: "GoogleMapsCompatible",
          format: "image/jpg",
          transparente: true,
          projection: projection,
          tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            matrixIds: matrixIds,
            resolutions: resolutions
          }),
          style: 'default',
          maxZoom: 20
        }),
      });
    layer.set("id", _id, false);
    layer.setVisible(true);
    this.getMap().addLayer(layer);
  }

  findLayerByID(id) {
    var layer = map.getLayers().getArray();
    for (var i in layer) {
      if (layer[i].get("id") == id) {
        return layer[i];
      }
    }
  }
}



