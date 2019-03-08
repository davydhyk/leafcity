var markers = [],
    pos,
    markerInfo = new google.maps.InfoWindow();

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