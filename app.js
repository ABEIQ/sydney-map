// Initialise map centered on Sydney (fallback)
const map = L.map('map').setView([-33.8688, 151.2093], 11);

// Add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Load your data
fetch('data.json')
  .then(res => res.json())
  .then(data => {

    const bounds = [];

    data.forEach(place => {
      const marker = L.marker([place.lat, place.lng]).addTo(map);

      // Keep track of all marker positions
      bounds.push([place.lat, place.lng]);

      // Build popup HTML
      let popupContent = `
        <div class="popup-title">${place.name}</div>
        <div>${place.notes || ""}</div>
      `;

      // Add video links
      if (place.videos && place.videos.length > 0) {
        popupContent += `<div class="popup-links">`;
        place.videos.forEach(link => {
          popupContent += `<a href="${link}" target="_blank">Watch video</a>`;
        });
        popupContent += `</div>`;
      }

      // Google Maps directions link
      const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

      popupContent += `
        <div class="popup-links">
          <a href="${mapsLink}" target="_blank">Get Directions</a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Auto zoom to fit all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  })
  .catch(err => {
    console.error("Error loading data.json:", err);
  });
