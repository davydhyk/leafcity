$(function () {
  $('[data-edit]').click(function () {
    var type = $(this).data('edit-type');
    if (type == "name") editName($(this));
    else if (type == "address") editAddress($(this));
  });
})

function editName(e) {
  Swal.fire({
    title: 'Введіть ваше ім\'я та прізвище',
    input: 'text',
    focusConfirm: false,
    inputValue: e.text().indexOf('исніть') == -1 ? e.text() : '',
    showCancelButton: true,
    inputValidator: (value) => {
      return (!value && 'Не залишайте поле пустим') || (value == e.text() && 'Внесіть зміни');
    }
  }).then(res => {
    if (res.dismiss) return;
    $.post('/api/profile/name', {name: res.value}).done(data => {
      if (data.ok) e.html(res.value);
      Swal.fire({
        toast: true,
        title: data.ok ? 'Прізвище та ім\'я успішно змінені' : 'Сталася помилка!',
        type: data.ok ? 'success' : 'error',
        position: 'bottom',
        showConfirmButton: false,
        timer: 1500
      });
    });
  });
}

function editAddress(e) {
  Swal.fire({
    title: 'Введіть вашу адресу',
    input: 'text',
    focusConfirm: false,
    inputValue: e.text().indexOf('исніть') == -1 ? e.text() : '',
    showCancelButton: true,
    inputValidator: (value) => {
      return (!value && 'Не залишайте поле пустим') || (value == e.text() && 'Внесіть зміни');
    }
  }).then(res => {
    if (res.dismiss) return;
    $.post('/api/profile/address', {address: res.value}).done(data => {
      if (data.ok) e.html(res.value);
      Swal.fire({
        toast: true,
        title: data.ok ? 'Адреса успішно змінена' : 'Сталася помилка!',
        type: data.ok ? 'success' : 'error',
        position: 'bottom',
        showConfirmButton: false,
        timer: 1500
      });
    });
  });
}