	define([], function() {'use strict';
        var baseUrl = 'http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/christmas-gift-guide/';

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

        function setupPage(el) {
            el.classList.add('gu-interactive');
            addStyleElm(el);

            var XDMSocket = new easyXDM.Socket({
                remote: baseUrl + "/index.html",
                container: el,
                props: {
                    scrolling: 'no',
                    seemless: 'seamless',
                    class: 'interactive',
                    style: {width: "100%"}
                },
                onMessage: function(message, origin){
                    this.container.getElementsByTagName("iframe")[0].style.height = message + "px";
                }
            });
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
				baseUrl : 'http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/christmas-gift-guide',
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

