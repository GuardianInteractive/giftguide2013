var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};

(function()
{
    gui.xmas.view.InitLoadView = function()
    {
		var displayObj = document.createElement('div');
	};
	gui.xmas.view.InitLoadView.prototype = {
        somethingsHappened: function(what){
			switch(what)
			{
				case gui.xmas.stateStrings.GET_URL_VARS:
					gui.xmas.view.initView.displayLoader("-retrieving url variables");
				break;

				case gui.xmas.stateStrings.FINISHED_LOADING_JSON:
					gui.xmas.view.initView.removeLoader();
					loaderState.removeSubscriber(gui.xmas.view.initView.somethingsHappened);
				break;
			}
		},

		displayLoader: function (textStr) {

			gui.xmas.view.InitLoadView.displayChild = document.createElement('div');

			var loadClip = gui.xmas.view.InitLoadView.displayChild;
			gui.xmas.view.initView.displayObj = loadClip;
			loadClip.className = 'assetsLoading';

			var loadingTitle = document.createElement('h1');
			loadingTitle.innerHTML = 'Loading';
			loadingTitle.className = 'loadingTitle';
			loadClip.appendChild(loadingTitle);

			var loadingDescrip = document.createElement('h2');
			loadingDescrip.innerHTML = textStr;
			loadingDescrip.className = 'loadingTitle';
			loadingDescrip.id = 'loadingDescrip';
			loadClip.appendChild(loadingDescrip);

			var el = gui.xmas.el;

			el.appendChild(loadClip);
		},

		changeLoadingText: function (textStr) {
			jQ("#loadingDescrip").html('<h2>' + textStr + '</h2>');
		},

		removeLoader: function () {
			TweenLite.to(gui.xmas.view.InitLoadView.displayChild, .5, {css:{autoAlpha:0, marginTop:'50px'}, ease:Back.easeIn, onComplete:handleLoaderRemoved});
			function handleLoaderRemoved() {
				var el = gui.xmas.el;
				el.removeChild(gui.xmas.view.InitLoadView.displayChild);
				loaderState.loaderRemoved();
			}
		}

	}

}());