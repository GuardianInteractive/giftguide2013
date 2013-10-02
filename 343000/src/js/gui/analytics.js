(function(global) {
    var gui = global.gui || (global.gui = {});

    gui.analytics = function(msg, opts) {
        gui.log('Analytics$ "'+msg+'"', opts);
    };

    gui.analytics.event = function(category, action, opt_label, opt_value, opt_noninteraction){
        var args = [].splice.call(arguments,0);
        args.splice(0, 0, '_trackEvent');
        gui.analytics.GAPush.apply(null, args);
    };
    gui.analytics.pageView = function(url){
        var args = [].splice.call(arguments,0);
        args.splice(0, 0, '_trackPageview');
        gui.analytics.GAPush.apply(null, args);
    };

    gui.analytics.loadGA = function(gaid){

        gui.analytics.GAPushFront('_trackPageview');
        gui.analytics.GAPushFront('_setAccount', gaid);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    };
    gui.analytics.GAPush = function(){
        var args = [].splice.call(arguments,0);
        gui.analytics.getGAStack().push(args);
    };
    gui.analytics.GAPushFront = function(){
        var args = [].splice.call(arguments,0);
        gui.analytics.getGAStack().splice(0, 0, args);
    };
    gui.analytics.getGAStack = function(){
        var _gaq = global._gaq = global._gaq || [];
        return _gaq;
    };

})(this);
