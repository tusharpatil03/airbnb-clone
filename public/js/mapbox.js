
document.addEventListener("DOMContentLoaded", () => {
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 5 // starting zoom
    });


    // Create a marker and add it to the map
    var marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(listing.geometry.coordinates) // Marker position [lng, lat]
        .setPopup(new mapboxgl.Popup({ offset: 10, className: 'my-class' })
            .setHTML(`<h4>${listing.location}</h4> <p>Exact Location will display after booking`))
        .addTo(map); // Add the marker to the map
});
