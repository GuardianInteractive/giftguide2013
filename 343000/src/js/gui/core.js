var gui = gui || {};
gui.version = 'alpha.2';

if (this.console && this.console.log && (gui.env == 'development')) {
  gui.log = function() { console.log( Array.prototype.slice.call(arguments) ); }
} else {
  gui.log = function() {};
}
if (this.console && this.console.log && (gui.env == 'development')) {
  gui.warn = function() { console.warn( Array.prototype.slice.call(arguments) ); }
} else {
  gui.warn = function() {};
}

//nasty quick hack to fix POS IE
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
    for(var i=0; i<this.length; i++){
      if(this[i]==obj){
        return i;
      }
    }
    return -1;
  }
}



gui.browser = gui.browser || {};

gui.browser.ieVersion = function()
{
    var rv = -1;
    // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
    }
    return rv;
}();

gui.browser.isIE7 = function()
{
    return gui.browser.ieVersion == 7;
}();
