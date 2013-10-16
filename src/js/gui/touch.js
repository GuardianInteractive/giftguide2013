//From https://raw.github.com/madrobby/zepto/master/src/touch.js
//MIT Licenced.
var gui = gui || {};
gui.touch = gui.touch || {};

(function(global){
  var touch = {}, touchTimeout;

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }

  var longTapDelay = 750;
  function longTap() {
    if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
      $(touch.target).trigger('longTap');
      touch = {};
    }
  }


  $(document).ready(function() {
    gui.touch.bind (document);
  });

  gui.touch.bind = function(target) {
    $(target).bind('touchstart', function(e){
      var o = e.originalEvent;
      var now = Date.now(), delta = now - (touch.last || now);
      touch.target = parentIfText(o.touches[0].target);
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 = o.touches[0].pageX;
      touch.y1 = o.touches[0].pageY;
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      touch.last = now;
      setTimeout(longTap, longTapDelay);
    }).bind('touchmove', function(e){
      var o = e.originalEvent;
      touch.x2 = o.touches[0].pageX;
      touch.y2 = o.touches[0].pageY;
    }).bind('touchend', function(e){
      var o = e.originalEvent;
      gui.log(touch.target);
      if (touch.isDoubleTap) {
        $(touch.target).trigger('doubleTap');
        touch = {};
      } else if (touch.x2 > 0 || touch.y2 > 0) {
        (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30)  &&
        $(touch.target).trigger('swipe') &&
        $(touch.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      } else if ('last' in touch) {
        touchTimeout = setTimeout(function(){
          touchTimeout = null;
          $(touch.target).trigger('tap')
          touch = {};
        }, 50);
      }
    }).bind('touchcancel', function(){ touch = {} });
  };

	gui.touch.unbind = function(target) {
    	$(target).unbind('touchstart').unbind('touchmove').unbind('touchend').unbind('touchcancel');
  };

  // ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'longTap'].forEach(function(m){
  // $.fn[m] = function(callback){ return this.bind(m, callback) }
// });
})(this);
