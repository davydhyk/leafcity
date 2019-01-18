$(function () {
  $(window).on('resize', function () {
    $('body').css('height', window.innerHeight);
    $('.slider').height(calcheight());
  });
  $(window).trigger('resize');
  
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
})

function calcheight() {
  return window.innerHeight - $('.slider-nav').height() - $('.user-tab').height();
}