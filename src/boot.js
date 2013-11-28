	define([], function() {'use strict';
        var isDev = /localhost|gnm\d+\.int\.gnl/.test(document.location.host);
        var baseUrl = (isDev) ? 'http://localhost:9090/' : 'http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/christmas-gift-guide-2013-presents-ideas-interactive/';




        function addStyleElm(el) {
            //var baseUrl = '/';
            var styleEl = document.createElement('link');
            styleEl.setAttribute('rel', 'stylesheet');
            styleEl.setAttribute('type', 'text/css');
            styleEl.setAttribute('href', baseUrl + 'css/interactive-figure.css');
            el.appendChild(styleEl);

//            var iframeUrl = baseUrl + 'index.html' + location.search;
//            var iframeEl = document.createElement('iframe');
//            iframeEl.setAttribute('src', iframeUrl);
//            iframeEl.setAttribute('scrolling', 'no');
//            iframeEl.setAttribute('seemless', 'seemless');
//            iframeEl.setAttribute('frameborder', '0');
//            iframeEl.setAttribute('style', 'height: 2000px; width: 100%; overflow-y: hidden; border: none;');
//            el.appendChild(iframeEl);
        }

        function getScrollTop(){
            if(typeof pageYOffset!= 'undefined'){
                //most browsers except IE before #9
                return pageYOffset;
            }
            else{
                var B= document.body; //IE 'quirks'
                var D= document.documentElement; //IE with doctype
                D= (D.clientHeight)? D: B;
                return D.scrollTop;
            }
        }

        function setupPage(el) {
            el.className = el.className + ' gu-interactive';
            addStyleElm(el);

            var XDMSocket = new easyXDM.Socket({
                remote: baseUrl + "/index.html" + document.location.search,
                container: el,
                props: {
                    scrolling: 'no',
                    seemless: 'seamless',
                    style: {width: "100%", 'min-height': '700px'}
                },
                onMessage: function(message, origin){
                    if (message === 'undefined') {
                        return;
                    }

                    var data = JSON.parse(message);
                    if (data.height) {
                        this.container.getElementsByTagName("iframe")[0].style.height = data.height + "px";
                    }

                    if (data.scrollTop && !data.target) {
                        el.scrollIntoView();
                    }

                    if (data.scrollTop && data.target) {
                        var scrollTop = parseInt(data.target + el.offsetTop, 10);
                        setTimeout(function() {
                            window.scroll(0, scrollTop);
                        }, 10);
                    }

                }
            });

            function sendScrollData() {
                //var headerHeight = (jQ) ? jQ(el).offset().top : $(el).offset().top;
                var top = getScrollTop() + 60;
                if (typeof jQ !== 'undefined') {
                    top -= jQ(el).offset().top;
                }

                if (typeof $ !== 'undefined' && typeof $().offset === 'function') {
                    top -= $(el).offset().top;
                }

                console.log('top', top);
                top += (el.getBoundingClientRect().top > 0) ? el.getBoundingClientRect().top : 0;
                //top += (el.getBoundingClientRect().bottom > 0) ? el.getBoundingClientRect().top : 0;
                XDMSocket.postMessage(top);
            }

            if (!window.addEventListener) {
                window.attachEvent("onScroll", sendScrollData);
            } else {
                window.addEventListener("scroll", sendScrollData, false);
            }

            sendScrollData();
        }


	return {
		/**
		 *
		 * @param el        : The Element of the interactive that is being progressively enhanced.
		 * @param context   : The DOM context this module must work within.
		 * @param config    : The configuration object for this page.
		 * @param mediator  : The event system (publish/subscribe) for this page.
		 *
		 **/
		boot : function(el, context, config, mediator) {
			var cfg = {
				context : 'interactive',
				baseUrl : baseUrl,
				paths : {
					//json2 : 'js/libs/json2',
					jquery: 'js/libs/jquery-1.8.1',
					jcarousel : 'js/libs/jquery.jcarousel.min',
					TweenMax : 'js/libs/TweenMax.min',
					boot : 'js/gui/boot',
					model : 'js/gui/xmas/model/model',
					observer : 'js/gui/xmas/observer/observer',
					controller : 'js/gui/xmas/controller/controller',
					initLoadView : 'js/gui/xmas/view/initLoadView',
					mainView : 'js/gui/xmas/view/mainView',
					filterPanel : 'js/gui/xmas/view/filterPanel',
					wishListBox : 'js/gui/xmas/view/wishListBox',
					productsGridView : 'js/gui/xmas/view/productsGridView',
					singularProductView : 'js/gui/xmas/view/singularProductView'
				}
			};

			if ( typeof require() === 'function') {
				var req2 = require.config(cfg);
				req2([baseUrl + 'js/libs/easyXDM.js'], function() {
                    setupPage(el);
				});
			} else {
				// curl, i.e. next-gen
				cfg.preloads = ['jquery'];
				require(cfg, ['js!' + baseUrl + 'js/libs/easyXDM.js']).then(function() {
                    setupPage(el);
				});
			}
		}
	}
});

