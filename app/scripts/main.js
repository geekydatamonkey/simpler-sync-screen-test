'use strict';

function parseQueryString() {
  var qs = document.location.search;
  var obj = {};

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

(function() {
  var params;
  var slideToShow;
  var delay;
  var activeSlideNum;
  var slides;

  function nextSlide() {
    var prevSlideNum = activeSlideNum;
    activeSlideNum = (activeSlideNum + 1) % slides.length;
    console.log(activeSlideNum);
    console.log(Date.now());

    // if previous slide was slide to show,
    // remove is-active class
    if (prevSlideNum === slideToShow) {
      slides[prevSlideNum]
        .classList
        .remove('is-active');
    }

    if (activeSlideNum === slideToShow) {
      slides[activeSlideNum]
        .classList
        .add('is-active');
    }

    // TODO: Account for time drift
    var cycleLength = (delay * slides.length); // 4000
    var currentTime = Date.now() % cycleLength; // 3005
    var nextTime = (activeSlideNum + 1) * delay; // 4000

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
    // setup vars
    params = parseQueryString();
    console.log(params);
    slideToShow = parseInt(params.slideToShow, 10) || 0;
    delay = params.delay || 1000;
    activeSlideNum = 0;  // currently active slide
    slides = document.querySelectorAll('.slides .slide');

    // synchonize watches and start show!
    synchronize();
  }

  init();
})();
