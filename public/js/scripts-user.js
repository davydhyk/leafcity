var markers = [],
    pos,
    markerInfo = new google.maps.InfoWindow(),
    map;

function map() {
  var pos,
      markerInfo = new google.maps.InfoWindow();
  $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBG2I3uy1WnkiNMJMwkqbyrQ0aFYWd5jzs', {}).done(function (data) {
    pos = data.location;
    map.setCenter(pos);
  });
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.617953144089846, lng: 26.258654594421387},
    zoom: 17,
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
        info: '<span data-index="' + i + '" data-remove="' + marker.id + '" class="info-remove">Видалити</span>'
      });
      if (window.user_id == marker.author) {
        markers[i].marker.addListener('click', function () {
          markerInfo.close();
          markerInfo.setContent(markers[i].info);
          markerInfo.open(map, markers[i].marker);
          setTimeout(function() {mapClicksInit()}, 50);
        });
      }
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
  var marker = new google.maps.Marker({animation: google.maps.Animation.DROP});
  $('.add-small').click(function () {
    if ($(this).hasClass('active')) {
      var btn = $(this);
      var req = {
        pos: {
          lat: marker.getPosition().lat,
          lng: marker.getPosition().lng
        },
        icon: marker.getIcon()
      }
      $.post('/api/marker/add', req).done(function (data) {
        if (!data.ok) {
          var addInfoErr = new google.maps.InfoWindow({content: 'Помилка.. Спробуйте пізніше.'});
          addInfoErr.open(map, marker);
          setTimeout(function () {addInfoErr.close();}, 2000);
          return;
        }
        btn.removeClass('active');
        markers.push(new google.maps.Marker({
          position: marker.getPosition(),
          map: map,
          animation: google.maps.Animation.DROP,
          icon: marker.getIcon()
        }));
        marker.setMap(undefined);
      });
    } else {
      $('.add-small.active').removeClass('active');
      $(this).addClass('active');
      if (!marker.getPosition()) marker.setPosition(map.getCenter());
      marker.setMap(map);
      marker.setIcon('img/' + this.className.replace(/add-small| |active/g, '') + '-marker.png');
      map.addListener('click', function (e) {
        marker.setPosition(e.latLng);
        map.panTo(marker.getPosition());
      });
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
}