
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      
      // Gọi hàm để gợi ý các bệnh viện gần với vị trí đó
      suggestNearbyHospitals(latitude, longitude);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  function suggestNearbyHospitals(latitude, longitude) {
    // Gửi yêu cầu tìm bệnh viện gần với vị trí người dùng
    var request = {
      location: new google.maps.LatLng(latitude, longitude),
      radius: '5000', // Bán kính tìm kiếm bệnh viện (đơn vị mét)
      type: ['hospital'] // Loại địa điểm cần tìm (ở đây là bệnh viện)
    };
  
    // Gọi API Places
    var service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Duyệt qua các kết quả và hiển thị thông tin
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          console.log(place.name);
          console.log(place.vicinity);
          console.log('---');
        }
      }
    });
  }

  let map;
	
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true
});

function successLocation(position) {
  // const latitude = position.coords.latitude;
  // const longitude = position.coords.longitude;
  const latitude = 21.004564;
  const longitude = 105.811870;
  setupMap([latitude, longitude]);
  fetchNearbyHospitals([latitude, longitude]);
}

function errorLocation() {
  // Xử lý khi không thể lấy vị trí người dùng
  setupMap([0, 0]); // Thiết lập vị trí mặc định cho bản đồ
}

function setupMap(center) {
  map = L.map('map').setView(center, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker(center).addTo(map);
}

function fetchNearbyHospitals(center) {
let hospitalList = '';
const radius = 5000; // Bán kính tìm kiếm bệnh viện (đơn vị: mét)

const query = `[out:json];
  (
    node["amenity"="hospital"](around:${radius},${center[0]},${center[1]});
    way["amenity"="hospital"](around:${radius},${center[0]},${center[1]});
    relation["amenity"="hospital"](around:${radius},${center[0]},${center[1]});
  );
  out body;
  >;
  out skel qt;`;

const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    const hospitals = data.elements;

    hospitals.forEach(hospital => {
      const lat = hospital.lat || (hospital.center && hospital.center.lat);
      const lon = hospital.lon || (hospital.center && hospital.center.lon);

      if (lat && lon) {
        const marker = L.marker([lat, lon], { icon: redIcon }).addTo(map);
        L.marker([lat, lon], { icon: redIcon }).addTo(map).on('click', function() {
          const name = hospital.tags.name || 'N/A';
          const address = hospital.tags['addr:street'] || 'N/A';
          const hospitalInfo = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Address:</strong> ${address}</p>
            <hr>
          `;
          const googleSearchQuery = `${name}`;
          const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(googleSearchQuery)}`;

          window.open(googleSearchUrl);
          marker.on('mouseover', function() {
            const name = hospital.tags.name || 'N/A';
      
            // Tạo một tooltip hiển thị tên bệnh viện khi trỏ chuột vào biểu tượng
            marker.bindTooltip(name).openTooltip();
          });
      
          marker.on('mouseout', function() {
            // Đóng tooltip khi di chuột ra khỏi biểu tượng
            marker.closeTooltip();
          });
      
        });
        

        const name = hospital.tags.name || 'N/A';
        const address = hospital.tags['addr:street'] || 'N/A';
        const hospitalInfo = `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Address:</strong> ${address}</p>
          <hr>
        `;

        hospitalList += hospitalInfo;
      }
    });

    document.getElementById('hospital-list').innerHTML = hospitalList;
  })
  .catch(error => {
    console.error('Error fetching hospitals:', error);
  });
}

// Biểu tượng màu đỏ
const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function showMap() {
  var mapElement = document.getElementById("map");
  mapElement.classList.remove("not-active");
  document.body.classList.add("dark");
}
function closeMap() {
  var mapElement = document.getElementById("map");
  mapElement.classList.add("not-active");
  document.body.classList.remove("dark");
  var selection = document.querySelector('.selection');
		selection.classList.add('not-active');
    var isOpen = !selection.classList.contains('not-active');

		// Lưu trạng thái vào local storage
		if (isOpen) {
			saveSelectionState('yes');
		} else {
			saveSelectionState('no');
		}

}



