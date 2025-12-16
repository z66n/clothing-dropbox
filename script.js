// Initialize the map
const map = L.map('map').setView([43.7, -79.4], 11); // Toronto default view

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable to store the current route layer
let currentRouteLayer = null;

// Catppuccin color palette (https://github.com/catppuccin/catppuccin)
const catppuccin = {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8', // High-contrast color for user location
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1', 
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec', // For drop box markers
    blue: '#89b4fa', // For route line
    lavender: '#b4befe',
    text: '#cdd6f4',
    subtext1: '#bac2de',
    subtext0: '#a6adc8',
    overlay2: '#9399b2',
    overlay1: '#7f849c',
    overlay0: '#6c7086',
    surface2: '#585b70',
    surface1: '#45475a',
    surface0: '#313244',
    base: '#1e1e2e',
    mantle: '#181825',
    crust: '#11111b'
};

// Function to get a route using OpenRouteService Directions API in serverless function
async function getRoute(startCoords, endCoords) {
    const params = new URLSearchParams({
        startLat: startCoords.lat,
        startLng: startCoords.lng,
        endLat: endCoords.lat,
        endLng: endCoords.lng
    });

    const response = await fetch(`/.netlify/functions/getRoute?${params.toString()}`);
    const data = await response.json();
    return data;
}

// Function to display the route on the map
function displayRoute(routeData) {
    // Clear the previous route if it exists
    if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
    }

    const coordinates = routeData.features[0].geometry.coordinates;
    const latLngs = coordinates.map(coord => L.latLng(coord[1], coord[0]));

    // Draw the new route on the map using Catppuccin's blue color
    currentRouteLayer = L.polyline(latLngs, { color: catppuccin.blue, weight: 5 }).addTo(map);
    map.fitBounds(currentRouteLayer.getBounds());
}

// Sample Inline GeoJSON data
// const geojsonData = {
// "type": "FeatureCollection",
// "name": "Clothing Drop-Box Locations - 4326",
// "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
// "features": [
// { "type": "Feature", "properties": { "_id": 806, "Permit_No": "P90-5501512", "Permit_Sticker_No": "904469", "Permit_Class": "CLOTHING DROP BOX LOCATION PERMIT (FOR PROFIT)", "Permit_Holder": "AMJ RECYCLING INC", "Permit_Address_Street_No": "1136", "Permit_Address_Street_Name": "DUPONT ST", "Permit_Address_Unit": "None", "Permit_Address_Postal_Code": "M6H2A2", "Permit_Address_Ward": 9, "Permit_Contact_Phone_No_": "(647) 295-6973", "Issue_Date": "20250123", "Cancellation_Date": "None" }, "geometry": { "type": "MultiPoint", "coordinates": [ [ -79.438115951, 43.668848465022997 ] ] } },
// { "type": "Feature", "properties": { "_id": 807, "Permit_No": "P90-5497909", "Permit_Sticker_No": "904464", "Permit_Class": "CLOTHING DROP BOX LOCATION PERMIT (NON-PROFIT)", "Permit_Holder": "B'NAI BRITH NATIONAL ORGANIZATION OF CANADA", "Permit_Address_Street_No": "211", "Permit_Address_Street_Name": "LLOYD MANOR RD", "Permit_Address_Unit": "None", "Permit_Address_Postal_Code": "M9B6H6", "Permit_Address_Ward": 2, "Permit_Contact_Phone_No_": "(416) 633-6224", "Issue_Date": "20250123", "Cancellation_Date": "None" }, "geometry": { "type": "MultiPoint", "coordinates": [ [ -79.556818895, 43.675307146023002 ] ] } }
// ]
// }
// ;

async function loadGeoJSON() {
  try {
    // Fetch from YOUR server (no CORS issues)
    const response = await fetch("/data/clothing-dropboxes.geojson"); 
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const geojson = await response.json();
    console.log("✅ Success! Loaded", geojson.features.length, "features");
    return geojson;
  } catch (error) {
    console.error("❌ Failed to load GeoJSON:", error);
    return null;
  }
}

// Usage
loadGeoJSON().then(geojsonData => {
  if (geojsonData) {
    // Use the data, add markers to the map, filtering out canceled locations
	L.geoJSON(geojsonData, {
		filter: (feature) => feature.properties.Cancellation_Date === "None",
		pointToLayer: (feature, latlng) => {
			// Use Catppuccin's green color for drop box markers
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: catppuccin.sapphire,
				color: catppuccin.surface0,
				weight: 1.5,
				opacity: 1,
				fillOpacity: 0.8
			});
		},
		onEachFeature: (feature, layer) => {
			const props = feature.properties;
			const popupContent = `
				<b>${props.Permit_Holder}</b><br>
				${props.Permit_Address_Street_No} ${props.Permit_Address_Street_Name}<br>
				Postal Code: ${props.Permit_Address_Postal_Code}<br>
				Contact: ${props.Permit_Contact_Phone_No_}
			`;

			layer.bindPopup(popupContent);

			// Add event listener to marker: when clicked, get route from user's location to the drop box
			layer.on('click', async function () {
				navigator.geolocation.getCurrentPosition(
					async function (position) {
						const userLat = position.coords.latitude;
						const userLon = position.coords.longitude;

						const userLocation = { lat: userLat, lng: userLon };
						const dropBoxLocation = {
							lat: feature.geometry.coordinates[0][1], // Latitude
							lng: feature.geometry.coordinates[0][0]  // Longitude
						};

						try {
							// Get the route from OpenRouteService
							const routeData = await getRoute(userLocation, dropBoxLocation);

							// Display the route on the map
							displayRoute(routeData);
						} catch (error) {
							console.error('Error fetching route:', error);
							alert('Failed to fetch route. Please try again.');
						}
					},
					function (error) {
						alert("Geolocation error: " + error.message);
					}
				);
			});
		}
	}).addTo(map);
  }
});

// Show user's location on the map
navigator.geolocation.getCurrentPosition(
    function (position) {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Display user's location on the map
        L.marker([userLat, userLon])
            .addTo(map)
            .bindPopup("Your Location")
            .openPopup();
    },
    function (error) {
        alert("Geolocation error: " + error.message);
    }
);