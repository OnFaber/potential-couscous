const map = L.map('map').setView([35.715, 51.404], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


L.marker([35.715, 51.404]).addTo(map)
    .bindPopup('Tehran, république islamique d\'Iran')
    .openPopup();
