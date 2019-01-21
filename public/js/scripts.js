$(function () {
  $('body').css('height', window.innerHeight);
  $('.slider').height(calcheight());
  
  $('.slider-nav').slick({
    slidesToShow: 3,
    arrows: false,
    focusOnSelect: true,
    asNavFor: $('.slider')
  });
  
  $('.slider').slick({
    slidesToShow: 1,
    arrows: false,
    asNavFor: $('.slider-nav')
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
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.617953144089846, lng: 26.258654594421387},
    zoom: 17,
    disableDefaultUI: true
  });
  var points = [
    {lat: 50.619954144089846, lng: 26.259654594421387}, 
    {lat: 50.618754144089846, lng: 26.257254594421387}, 
    {lat: 50.618954144089846, lng: 26.258654594421387}
  ];
  var markers = [];
  function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function() {
      markers.push(new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'img/marker.png'
      }));
    }, timeout);
  }
  for (var i = 0; i < points.length; i++) {
    addMarkerWithTimeout(points[i], i * 300);
  }
  points = [ 
    {lat: 50.617953144095846, lng: 26.260654594415387}, 
    {lat: 50.616953144085846, lng: 26.257654594428387}
  ];
  function aaddMarkerWithTimeout(position, timeout) {
    window.setTimeout(function() {
      markers.push(new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'img/fire-marker.png'
      }));
    }, timeout);
  }
  for (var i = 0; i < points.length; i++) {
    aaddMarkerWithTimeout(points[i], i * 300);
  }
  var infowindow = new google.maps.InfoWindow;
  $.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBG2I3uy1WnkiNMJMwkqbyrQ0aFYWd5jzs', {}).done(function (data) {
    // map.setCenter(data.location);
    // alert(JSON.stringify(data));
    // console.log(JSON.stringify(data));
  });
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    // alert(JSON.stringify(pos));
    // console.log(JSON.stringify(pos));
    map.setCenter(pos);
  }, function() {
  });
}