	define([], function() {'use strict';

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
				baseUrl : '',//'', //http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/dec/christmas-gift-guide
				paths : {
					// the left side is the module ID,
					// the right side is the path to
					// the jQuery file, relative to baseUrl.
					// Also, the path should NOT include
					// the '.js' file extension. This example
					// is using jQuery 1.9.0 located at
					// js/lib/jquery-1.9.0.js, relative to
					// the HTML page.
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
				req2(['boot'], function(App) {
					App.setup(el, context, false);
				});
			} else {
				// curl, i.e. next-gen
				cfg.preloads = ['jquery'];
				require(cfg, []).then(function() {

					
					el.classList.add('gu-interactive');
					el.setAttribute('style', 'margin: 1em -10px;');
				
					var baseUrl = 'http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/dec/christmas-gift-guide/';
					var iframeUrl = baseUrl + 'codeobject.html' + location.search;

					var styleEl = document.createElement('link');
					styleEl.setAttribute('rel', 'stylesheet');
					styleEl.setAttribute('type', 'text/css');
					styleEl.setAttribute('href', baseUrl + 'css/interactive-figure.css');
					el.appendChild(styleEl);

					
					var iframeEl = document.createElement('iframe');
					iframeEl.setAttribute('src', iframeUrl);
					iframeEl.setAttribute('scrolling', 'no');
					iframeEl.setAttribute('seemless', 'seemless');
					iframeEl.setAttribute('frameborder', '0');
					iframeEl.setAttribute('style', 'height: 2000px; width: 100%; overflow-y: hidden; border: none;');
					el.appendChild(iframeEl);

					
				});
			}
		}
	}
});

