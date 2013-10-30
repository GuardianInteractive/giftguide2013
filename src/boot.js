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
				baseUrl : '', //http://interactive.guim.co.uk/next-gen/artanddesign/ng-interactive/2013/oct/shipyard-clydebank-photograph
				paths : {
					// the left side is the module ID,
					// the right side is the path to
					// the jQuery file, relative to baseUrl.
					// Also, the path should NOT include
					// the '.js' file extension. This example
					// is using jQuery 1.9.0 located at
					// js/lib/jquery-1.9.0.js, relative to
					// the HTML page.
					json2 : 'js/libs/json2',
					googleSpreadsheet : 'js/libs/jquery.google.spreadsheet',
					activityIndicator : "js/libs/jquery.activity-indicator-1.0.0",
					modernizr : 'js/libs/modernizr',
					underscore : 'js/libs/underscore',
					backbone : 'js/libs/backbone',
					miso : 'js/libs/miso.ds.deps.min.0.2.2',
					jcarousel : 'js/libs/jquery.jcarousel.min',
					TweenLite : 'js/libs/TweenLite.min',
					EasePack : 'js/libs/easing/EasePack.min',
					CSSPlugin : 'js/libs/plugins/CSSPlugin.min',
					core : 'js/gui/core',
					anim : 'js/gui/anim.js',
					analytics : 'js/gui/analytics',
					data : 'js/gui/data',
					error : 'js/gui/error',
					social : 'js/gui/social',
					touch : 'js/gui/touch',
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
				require(cfg, ['boot']).then(function(App) {
					App.setup(el, context, true);
				});
			}
		}
	}
});

