var markers = [],
    pos,
    markerInfo = new google.maps.InfoWindow(),
    start = new google.maps.Marker(),
    finish = new google.maps.Marker();

function map() {

  // $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBG2I3uy1WnkiNMJMwkqbyrQ0aFYWd5jzs', {}).done(function (data) {
  //   pos = data.location;
  //   map.setCenter(pos);
  // });

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.617953144089846, lng: 26.258654594421387},
    zoom: 16,
    disableDefaultUI: true
  });

  start.setPosition(map.getCenter());
  start.setIcon({
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 6,
    strokeColor: 'green',
    fillColor: 'green',
    fillOpacity: 1
  });
  finish.setPosition(map.getCenter());
  finish.setIcon({
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    scale: 6,
    strokeColor: 'red',
    fillColor: 'red',
    fillOpacity: 1
  });

  function addMarkerWithTimeout(marker, timeout) {
    window.setTimeout(function() {
      var i = parseInt(timeout / 100);
      markers.push({
        marker: new google.maps.Marker({
          position: marker.pos,
          map: map,
          animation: google.maps.Animation.DROP,
          icon: marker.icon
        }),
        info: (marker.icon.indexOf('leaf') != -1) ? '<span data-index="' + i + '" data-pick="' + marker.id + '" class="info-pick">Підібрати</span>' +
              '<span data-index="' + i + '" data-remove="' + marker.id + '" class="info-remove">Видалити</span>' : 
              '<span data-index="' + i + '" data-localize="' + marker.id + '" class="info-pick">Локалізувати</span>' +
              '<span data-index="' + i + '" data-remove="' + marker.id + '" class="info-remove">Видалити</span>',
        author: marker.author
      });
      markers[i].marker.addListener('click', function () {
        markerInfo.close();
        markerInfo.setContent(markers[i].info);
        markerInfo.open(map, markers[i].marker);
        setTimeout(function() {mapClicksInit()}, 50);
      });
    }, timeout);
  }

  $.get('/api/marker/get').done(function (data) {
    if (!data.ok) {
      var getErrInfo = new google.maps.InfoWindow({content: 'Помилка під час завантаження маркерів'});
      var getErrInfoMarker = new google.maps.Marker({
        position: map.getCenter(),
        map: map
      });
      getErrInfo.open(map, getErrInfoMarker);
      getErrInfoMarker.addListener('click', function () {
        getErrInfo.open(map, getErrInfoMarker);
      });
    } else {
      for (var i = 0; i < data.markers.length; i++)
        addMarkerWithTimeout(data.markers[i], i * 100);
    }
  });

  $('.work').click(function () {
    if ($('.add-small.selected').length < 2) {
      Swal.fire({
        toast: true,
        title: 'Вкажіть точку старту та кінець маршруту',
        type: 'error',
        position: 'bottom',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    if ($(this).hasClass('end')) {
      directionsDisplay.setMap(null);
      $(this).removeClass('end').text('Розпочати роботу');
    } else {
      directions(map);
      $(this).addClass('end').text('Закінчити роботу');
      $('.slider-nav, .slider').slick('slickGoTo', 0);
    }
  });

  $('.add-small').click(function () {
    google.maps.event.clearListeners(map, 'click');
    if ($(this).hasClass('start')) {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').addClass('selected');
      } else {
        $('.add-small.active').removeClass('active').addClass('selected');
        start.setMap(map);
        $(this).addClass('active').removeClass('selected');
        map.addListener('click', (e) => {start.setPosition(e.latLng)});
      }
    } else if ($(this).hasClass('finish')) {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').addClass('selected');
      } else {
        $('.add-small.active').removeClass('active').addClass('selected');
        finish.setMap(map);
        $(this).addClass('active').removeClass('selected');
        map.addListener('click', (e) => {finish.setPosition(e.latLng)});
      }
    }
  });
}

function mapClicksInit() {
  $('[data-remove]').click(function (e) {
    e.preventDefault();
    var id = $(this).data('remove'),
        i = parseInt($(this).data('index'));
    $.post('/api/marker/remove', {id: id}).done(function (data) {
      if (!data.ok) {
        if (data.message) markerInfo.setContent(data.message), markerInfo.open(map, markers[i].marker);
        else markerInfo.setContent('Помилка.. Спробуйте пізніше.'), markerInfo.open(map, markers[i].marker);
        return;
      }
      markers[i].marker.setMap(null);
    });
  });
  $('[data-pick]').click(function (e) {
    e.preventDefault();
    var id = $(this).data('pick'),
        i = parseInt($(this).data('index'));
    $.post('/api/marker/pick', {id: id, author: markers[i].author}).done(function (data) {
      if (!data.ok) {
        if (data.message) markerInfo.setContent(data.message), markerInfo.open(map, markers[i].marker);
        else markerInfo.setContent('Помилка.. Спробуйте пізніше.'), markerInfo.open(map, markers[i].marker);
        return;
      }
      markers[i].marker.setMap(null);
    });
  });
  $('[data-localize]').click(function (e) {
    e.preventDefault();
    var id = $(this).data('localize'),
        i = parseInt($(this).data('index'));
    $.post('/api/marker/localize', {id: id, author: markers[i].author}).done(function (data) {
      if (!data.ok) {
        if (data.message) markerInfo.setContent(data.message), markerInfo.open(map, markers[i].marker);
        else markerInfo.setContent('Помилка.. Спробуйте пізніше.'), markerInfo.open(map, markers[i].marker);
        return;
      }
      markers[i].marker.setMap(null);
    });
  });
}

var directionsDisplay = new google.maps.DirectionsRenderer(),
    directionsService = new google.maps.DirectionsService();

directionsDisplay.setOptions({
  markerOptions: {
    opacity: 0.5,
    zIndex: 99999,
    clickable: false
  }
});

function directions(map) {
  directionsDisplay.setMap(map);
  var waypoints = [];
  for (var i = 0; i < markers.length; i++)
    if (markers[i].marker.getIcon().indexOf('fire') == -1 && markers[i].marker.getMap() != null) waypoints.push({location: markers[i].marker.getPosition()});
  var request = {
    origin: start.getPosition(),
    destination: finish.getPosition(),
    waypoints: waypoints,
    optimizeWaypoints: true,
    avoidTolls: false,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response,status) {
    if(status == 'OK') {
      directionsDisplay.setDirections(response);
      Swal.fire({
        toast: true,
        title: 'Маршрут успішно побудовано',
        type: 'success',
        position: 'bottom',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}