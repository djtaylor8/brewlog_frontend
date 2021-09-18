class MapAdapter {
    
    static newMap() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGp0YXlsb3IiLCJhIjoiY2t0NmJyNTh3MGd6aTJxbzhzajV5d251OSJ9.i0hGcpcDK2kDXEyK3l2NHA'
    
        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-95.7129,37.0902],
            zoom: 3
        });
             map.addControl(
                new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            }), 
        );
        return map;
    }

    static centerMap(map) {
        map.flyTo({
            center: [-95.7129,37.0902],
            zoom: 3
        })
    }
}
