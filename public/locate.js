function findLocation(){
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
          //position.coords.latitude
          //position.coords.longitude
          $('#latField').val(position.coords.latitude);
          $('#lngField').val(position.coords.longitude);
          $('#myLocationBtn').show();

      });
  }
}

function initializeMap(lat,lng,title) {
  var myLatlng = new google.maps.LatLng(lat,lng);
  var mapOptions = {
    zoom: 10,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var marker = new google.maps.Marker({
    position: myLatlng,
    title:title,
    icon:'/images/cascadiaFlag2.png'

  });
  marker.setMap(map);
}

