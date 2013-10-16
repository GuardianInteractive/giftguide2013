(function(global) {
  var gui = global.gui || (global.gui = {});

  gui.fail = function(cause, obj) {
    gui.analytics('error: "'+cause+'" ua: '+navigator.userAgent);
    $('#loading').remove();
    $('body')
    .append("<div id='fail'><span><img src='/assets/sorry.png'>Sorry<br>Something appears to have gone wrong</span></div>")
    .find('span').css('padding-top', ($('body').height() / 2)-75);
  }

})(this)



