var markers = [],
    pos,
    markerInfo = new google.maps.InfoWindow();

$('#users-search').on('input', function () {
  console.log($(this).val());
  var text = $(this).val().toLowerCase();
  $(this).next().find('li').each(function () {
    var finded = false;
    $(this).find('span').each(function () {
      if ($(this).text().toLowerCase().indexOf(text) != -1) finded = true;
    })
    if (finded) $(this).show();
    else $(this).hide();
  });
})

$('.users-icons .delete').click(function () {
  Swal.fire({
    title: 'Ви впевнені?',
    text: "Ви більше не зможете повернути користувача.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#009b71',
    cancelButtonColor: '#ea431c',
    confirmButtonText: 'Так, видалити!',
    cancelButtonText: 'Відмінити!'
  }).then((res) => {
    if (res.value) {
      var base = $(this).parent().parent();
      $.post('/api/profile/remove', {id: base.data('user-id')}).done(function (data) {
        if (data.ok) base.remove();
        Swal.fire({
          toast: true,
          title: data.ok ? 'Користувача успішно видалено!' : 'Сталася помилка!',
          type: data.ok ? 'success' : 'error',
          position: 'bottom',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  })
});

$('.users-icons .stats').click(function () {
  Swal.fire({
    title: 'Ви впевнені що хочете скинути статистику?',
    text: "Ви більше не зможете її повернути.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#009b71',
    cancelButtonColor: '#ea431c',
    confirmButtonText: 'Так, скинути!',
    cancelButtonText: 'Відмінити!'
  }).then((res) => {
    if (res.value) {
      var base = $(this).parent().parent();
      $.post('/api/profile/reset', {id: base.data('user-id')}).done(function (data) {
        Swal.fire({
          toast: true,
          title: data.ok ? 'Статистику успішно скинуто!' : 'Сталася помилка!',
          type: data.ok ? 'success' : 'error',
          position: 'bottom',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  })
});

$('.users-icons a:nth-child(1)').click(async function () {
  var role = $(this).text();
  var el = $(this);
  var user_id = $(this).parent().parent().data('user-id');
  const {value: new_role} = await Swal.fire({
    title: 'Виберіть роль користувача',
    input: 'select',
    inputOptions: {
      'admin': 'Адміністратор',
      'driver': 'Водій',
      'user': 'Користувач'
    },
    inputPlaceholder: 'Виберіть роль користувача',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value && value != role) {
          resolve()
        } else {
          resolve('Ви повинні вибрати роль або змінити її')
        }
      })
    }
  })
  if (new_role) {
    $.post('/api/profile/role', {id: user_id, role: new_role}).done((data) => {
      if (data.ok) el.removeClass(role).addClass(new_role).text(new_role);
      Swal.fire({
        toast: true,
        title: data.ok ? 'Роль користувача успішно змінено!' : 'Сталася помилка!',
        type: data.ok ? 'success' : 'error',
        position: 'bottom',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
});

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