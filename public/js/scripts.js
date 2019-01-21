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
})

function calcheight() {
  return window.innerHeight - $('.slider-nav').height() - $('.user-tab').height();
}