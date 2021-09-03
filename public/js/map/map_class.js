export default class MapClass {
    constructor() {
        this.overlay = this.createOverlayer()
        this.map = this.createmap(this.overlay);
        console.log("new")
    }
    createOverlayer() {
        var container = document.getElementById('popup');
        var overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        return overlay;
    }
    createmap(overlay) {

        var map = new ol.Map({
            target: 'map',
            renderer: 'webgl',
            controls: ol.control.defaults({
                attribution: false,
                zoom: false,
            }),
            overlays: [overlay],
            // hitTolerance:3,
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
        this.mapListener(map, overlay)




        return map;
    }
    mapListener(map, overlay) {
        map.on('singleclick', function(e) {
            // alert(e.coordinate);
            var coordinate = e.coordinate;
            overlay.setPosition(coordinate);

            // alert(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'));
            // 通過getEventCoordinate方法獲取地理位置，再轉換為wgs84座標，並彈出對話方塊顯示
            // alert(map.getEventCoordinate(e.originalEvent));
            // alert(ol.proj.transform(map.getEventCoordinate(e.originalEvent), 'EPSG:3857', 'EPSG:4326'));
            // var lonlat = map.getCoordinateFromPixel(e.pixel);
            // alert(lonlat);
            // alert(ol.proj.transform(lonlat,"EPSG:3857", "EPSG:4326")); //由3857座標系轉為4326
        });
        // 右鍵
        // map.getViewport().addEventListener("contextmenu",function(e){
        //   e.preventDefault()
        //   // console.log("contextmenu")
        //   // console.log( map.getEventCoordinate(e))
        //   overlay.setPosition(map.getEventCoordinate(e));
        // })
    }

    getMap() {
        return this.map;
    }

    satelliteMap() {
        var tf = true;
        if (!this.addWMTSLayer('https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}', "taiwan-sate")) {
            this.removeLayerByID("taiwan-sate")
            tf = false;
        }
        if (!this.addWMTSLayer('https://wmts.nlsc.gov.tw/wmts/EMAP2/default/EPSG:3857/{TileMatrix}/{TileRow}/{TileCol}', "taiwan-sate-road")) {
            this.removeLayerByID("taiwan-sate-road")
            tf = false;
        }
        return tf;
    }
    addTileLayer() {

    }

    findLayerByID(id) {
        var layer = this.getMap().getLayers().getArray();
        for (var i in layer) {
            if (layer[i].get("id") == id) {
                return layer[i];
            }
        }
        return undefined
    }

    addWMTSLayer(_url, _id) {
        if (this.findLayerByID(_id) == undefined) {
            var projection = ol.proj.get('EPSG:3857');
            var projectionExtent = projection.getExtent();
            var size = ol.extent.getWidth(projectionExtent) / 256;
            var resolutions = new Array(21);
            var matrixIds = new Array(21);
            for (var z = 0; z < 21; ++z) {
                resolutions[z] = size / Math.pow(2, z);
                matrixIds[z] = z;
            }
            var layer = new ol.layer.Tile({
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
            return true
        } else {
            return false
        }

    }

    setCenterbyCoord(lat, long) {
        map.getView().animate({
            center: ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'),
            duration: 1000
        });
    }

    removeLayerByID(id) {
        var layer = this.findLayerByID(id)
        if (layer != undefined) {
            this.getMap().removeLayer(layer);
            return true
        } else {
            return false
        }
    }
}