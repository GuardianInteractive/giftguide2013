var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};
var width, height;

gui.xmas.Boot = (function() {

function loadcss(url) {
   var head = document.getElementsByTagName('head')[0],
   link = document.createElement('link');
   link.type = 'text/css';
   link.rel = 'stylesheet';
   link.href = url;
   head.appendChild(link);
   return link;
 }


function handleWindowResize() {
	width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	var bg = jQ('.mainHolderBg');
	var rightSideWidth = jQ('.rightSideHolder').width();
	bg.css('height', height);
	if (width < 9400) {
		if (!gui.xmas.model.smallView) {
			gui.xmas.model.smallView = true;
			changeToDifferentView(true);
		}
		rightSideWidth = jQ('.rightSideHolderSmall').width();
	}
	else {
		if (gui.xmas.model.smallView) {
			gui.xmas.model.smallView = false;
			changeToDifferentView(false);
		}
	}
    if (gui.xmas.view.mainView.budgeRightSideDown) {
    	gui.xmas.view.mainView.budgeRightSideDown();
    }
}

function changeToDifferentView(small) {
	if (small) {
		jQ('.leftSideHolder')
			.removeClass('leftSideHolder').addClass('leftSideHolderSmall');
		jQ('.rightSideHolder')
			.removeClass('rightSideHolder').addClass('rightSideHolderSmall');
	}
	else {
		jQ('.leftSideHolderSmall')
			.removeClass('leftSideHolderSmall').addClass('leftSideHolder');
		jQ('.rightSideHolderSmall')
			.removeClass('rightSideHolderSmall').addClass('rightSideHolder');
	}
}

function setup(el, context, isNextGen) {
	console.log('in setup');
	gui.xmas.el = el;

	  gui.xmas.model = new gui.xmas.Model();
        gui.xmas.controller = new gui.xmas.Controller();
        gui.xmas.observer = new gui.xmas.Observer();

        loadcss(gui.xmas.model.masterRootPath + "css/reset.css");
		//loadcss(gui.xmas.model.masterRootPath + "css/main.css");
		loadcss(gui.xmas.model.masterRootPath + "assets/skins/carousel/skin.css");


        if (!gui.xmas.model.displaySplash) {
        	gui.xmas.view.initView = new gui.xmas.view.InitLoadView();
			gui.xmas.view.mainView = new gui.xmas.view.MainView();
			gui.xmas.view.filterPanel = new gui.xmas.view.FilterPanel();
			gui.xmas.view.wishListBox = new gui.xmas.view.WishListBox();
			gui.xmas.view.productsGridView = new gui.xmas.view.ProductsGridView();
			gui.xmas.view.singularProductView = new gui.xmas.view.SingularProductView();

			gui.xmas.observer.make(loaderState);
			gui.xmas.observer.make(urlVarsState);
			gui.xmas.observer.make(displayState);
			gui.xmas.observer.make(filterState);

			loaderState.addSubscriber(gui.xmas.view.initView.somethingsHappened);
			loaderState.addSubscriber(gui.xmas.controller.loadJSONlistener);
			loaderState.addSubscriber(gui.xmas.controller.thumbnailLoadListener);
			urlVarsState.addSubscriber(gui.xmas.model.urlVarslistener);
			urlVarsState.addSubscriber(gui.xmas.view.initView.somethingsHappened);
			displayState.addSubscriber(gui.xmas.view.mainView.somethingsHappened);
			displayState.addSubscriber(gui.xmas.view.singularProductView.somethingsHappened);
			displayState.addSubscriber(gui.xmas.view.productsGridView.somethingsHappened);
			filterState.addSubscriber(gui.xmas.view.productsGridView.filterListener);

			urlVarsState.getVars();
			loaderState.startLoadingJSON();

			window.onresize = function(event) {
				handleWindowResize();
			};
			handleWindowResize();
        }
    }


	return setup;

}());
