var markers = [];

$(function () {
  $('body').css('height', window.innerHeight);
  $('.slider').height(calcheight());
  
  $('.slider-nav').slick({
    slidesToShow: 3,
    arrows: false,
    focusOnSelect: true,
    asNavFor: $('.slider'),
    initialSlide: 1
  });
  
  $('.slider').slick({
    slidesToShow: 1,
    arrows: false,
    asNavFor: $('.slider-nav'),
    initialSlide: 1
  });

  $('.slider').height(calcheight());

  $('input.reg').click(function (e) {
    e.preventDefault();
    $('.msg.error').remove();
    $('.error').removeClass('error');
    var req = {
      email: $('[name="email"]').val(),
      phone: $('[name="phone"]').val(),
      password: $('[name="password"]').val(),
      rep_password: $('[name="rep_password"]').val()
    };
    $.post('/api/auth/reg', req).done(function (data) {
      if (data.ok) window.location.replace("/login");
      data.fields.forEach(field => {
        $('[name="' + field + '"]').addClass('error');
      });
      $('<div class="error msg">'+ data.msg + '</div>').insertBefore('form > div:first-child');
    });
  });

  $('input').click(function () {
    if (!$(this).hasClass('error')) return;
    $('.msg.error').remove();
    $('.error').removeClass('error');
  });

  $('[name="phone"]').mask('+38 (000) 000-00-00');

  $('.login-btn').click(function (e) {
    e.preventDefault();
    e.preventDefault();
    $('.msg.error').remove();
    $('.error').removeClass('error');
    var req = {
      phone: $('[name="phone"]').val(),
      password: $('[name="password"]').val()
    };
    $.post('/api/auth/login', req).done(function (data) {
      if (data.ok) location.replace('/');
      else {
          data.fields.forEach(field => {
          $('[name="' + field + '"]').addClass('error');
        });
        $('<div class="error msg">'+ data.msg + '</div>').insertBefore('form > div:first-child');
      }
    });
  });

  if ($('#map').length) map();
})

function calcheight() {
  return window.innerHeight - $('.slider-nav').height() - $('.user-tab').height();
}

function map() {
  var pos,
      markerInfo = new google.maps.InfoWindow();
  navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.setCenter(pos);
  }, function() {
  });
  var map = new google.maps.Map(document.getElementById('map'), {
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
        if (data.message) markers[i].info.setContent(data.message);
        else markers[i].info.setContent('Помилка.. Спробуйте пізніше.');
        return;
      }
      markers[i].marker.setMap(null);
    });
  });
}