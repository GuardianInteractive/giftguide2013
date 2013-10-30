var gui = gui || {};
gui.xmas = gui.xmas || {};

(function()
{
    gui.xmas.Controller = function()
    {

		//set init vars
		if(gui.xmas.model.isMobile.any()) {
			gui.xmas.model.screenVersion = 'mobile';
			//if(top === self) {
			//if(width === 940) {
			if (parent.frames.length > 0) {
				//I'm in an iframe on mobile ... serve me up the splash screen image and get me outta here!
				document.getElementsByTagName('html')[0].innerHTML = '<a href="' + window.location + '" target="_blank"><img src="assets/images/mobileSplashScreen.jpg" width="940" height="834"></a>';
				document.body.style.margin = "0px";
				document.body.style.padding = "0px";
				gui.xmas.model.displaySplash = true;
			}
		}
    };
	gui.xmas.Controller.prototype = {

		handleResponse: function(data) {
			loaderState.finishedLoadingJSON();
			gui.xmas.model.parseJSONData(data);
		},
	
		loadJSONlistener: function(event) {
			switch(event)
			{
				case gui.xmas.stateStrings.START_LOADING_JSON:
					
					gui.xmas.view.initView.changeLoadingText("-loading json data");
					
					jQ.ajax({
						dataType: 'jsonp',
						jsonpCallback: 'gui.xmas.controller.handleResponse',
						url: gui.xmas.model.masterRootPath + 'data/gifts.jsonp'

					})
					
				break;
				case gui.xmas.stateStrings.LOADER_REMOVED:
					displayState.displayFilterStart();
					loaderState.removeSubscriber(gui.xmas.controller.loadJSONlistener);
				break;
			}
		},
		
		thumbnailLoadListener: function(event) {
			switch(event) {
				case gui.xmas.stateStrings.START_THUMBNAIL_IMAGE_LOAD:
					//gui.xmas.controller.loadThumbnail(0);
				break;
			}
		}
			
	}
	
}());