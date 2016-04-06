'use strict';

(function() {
  var slideToShow;
  var delay;
  var currentSlideNum;
  var slides;


  // parses a query string into an object
  // For example, if the current URL is:
  // http://localhost?slideToShow=3&delay=1000
  // becomes
  // parseQueryString() will give you
  // { slideToShow: '3', delay: '1000' }
  function parseQueryString() {
    var qs = document.location.search;
    var obj = {};

    if (!qs) {
      return obj;
    }

    qs.substring(1) // drop ? at beginning
      .split('&')
      .forEach((pair) => {
        var keyVal = pair.split('=');
        if (keyVal.length === 2) {
          // pair of values
          // &slide=2
          var key = keyVal[0];
          var val = keyVal[1];
          obj[key] = val;
        } else if (keyVal.length === 1) {
          //singleton
          // &loop === &loop=true
          obj[keyVal] = true;
        }
      });
      return obj;
  }


  function nextSlide() {
    var prevSlideNum = currentSlideNum;
    currentSlideNum = (currentSlideNum + 1) % slides.length;

    // if previous slide was slide to show,
    // remove is-active class
    if (prevSlideNum === slideToShow) {
      slides[prevSlideNum]
        .classList
        .remove('is-active');
    }

    if (currentSlideNum === slideToShow) {
      slides[currentSlideNum]
        .classList
        .add('is-active');
    }

    // TODO: Account for time drift
    var cycleLength = (delay * slides.length); // 4000
    var currentTime = Date.now() % cycleLength; // 3005
    var nextTime = (currentSlideNum + 1) * delay; // 4000

    setTimeout(nextSlide, nextTime - currentTime);
  }

  // align timing computer clock
  // basically, if 0 === currentTime % cycleLength
  // then we're synchronized and can start
  // toggling slides
  function synchronize() {
    var cycleLength = slides.length * delay;
    var currentTime = Date.now() % cycleLength;
    var tMinusZero = cycleLength - currentTime;

    setTimeout(nextSlide, tMinusZero);
  }

  function init() {
    var params = parseQueryString();

    // setup vars
    slideToShow = parseInt(params.slideToShow, 10) || 0;
    delay = parseInt(params.delay, 10) || 1000;
    currentSlideNum = 0;  // currently active slide
    slides = document.querySelectorAll('.slides .slide');

    // synchonize watches and start show!
    synchronize();
  }

  init();
})();
