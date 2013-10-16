var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};
var width, height;

(function()
{
    gui.xmas.Boot = function()
    {
        gui.xmas.model = new gui.xmas.Model();
        gui.xmas.controller = new gui.xmas.Controller();
        gui.xmas.observer = new gui.xmas.Observer();

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

		/*
		//gui.analytics.loadGA('UA-25353554-2');
        var templateUrl = "templates/templates.html";
        var jsonUrl = "data/data.json";
        var storyUrl = "templates/story_content.html";
        var patentsJsonUrl = "data/patentsToDisplay.json";
        var spreadsheet = "http://spreadsheets.google.com/tq?key=0AlySAWztZtxcdGRLRjdONVhmdFV5SHZDRTlPRVRjSXc";

        this.loadJob = new gui.data.ParallelJob();
        this.loadJob.jobs.template = new gui.data.AJAXJob(templateUrl);
        this.loadJob.jobs.story = new gui.data.AJAXJob(storyUrl);
        this.loadJob.jobs.data = new gui.data.JSONJob(jsonUrl);
        this.loadJob.jobs.patentsToDisplay = new gui.data.JSONJob(patentsJsonUrl);
        this.loadJob.jobs.patents = new gui.data.GoogleSpreadsheetJob(spreadsheet+"&sheet=patents");
        this.loadJob.jobs.inventors = new gui.data.GoogleSpreadsheetJob(spreadsheet+"&sheet=inventors");
        this.loadJob.jobs.patentCategories = new gui.data.GoogleSpreadsheetJob(spreadsheet+"&sheet=patentCategories");
        this.loadJob.jobs.inventorCategories = new gui.data.GoogleSpreadsheetJob(spreadsheet+"&sheet=inventorCategories");
        this.loadJob.bind('success', this.loaded, this);
        this.loadJob.go();
		*/
    };
	gui.xmas.Boot.prototype = {
        loaded: function(result){
            //$("body").append(result.template[0]);
		}
	}

}());

function handleWindowResize() {
	width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
	var bg = $('.mainHolderBg');
	var rightSideWidth = $('.rightSideHolder').width();
	bg.css('height', height);
	if (width < 940) {
		if (!gui.xmas.model.smallView) {
			gui.xmas.model.smallView = true;
			changeToDifferentView(true);
		}
		rightSideWidth = $('.rightSideHolderSmall').width();
	}
	else {
		if (gui.xmas.model.smallView) {
			gui.xmas.model.smallView = false;
			changeToDifferentView(false);
		}
	}
	if (gui.xmas.view.wishListBox.carouselHolder) {
		gui.xmas.view.wishListBox.carouselHolder.style.width = (rightSideWidth - 40 - $(gui.xmas.view.wishListBox.carouselHolder).height()) + 'px';
	}
	
	var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, percentWidth = (100 / numAcross);
	$('.productsGridHolder  li').css('width', percentWidth + '%');
	if (gui.xmas.model.rightSideState !== 1) {
		gui.xmas.view.singularProductView.setRightSideHeight();
	}

	gui.xmas.view.mainView.budgeRightSideDown();

}

function changeToDifferentView(small) {
	if (small) {
		$('.leftSideHolder')
			.removeClass('leftSideHolder').addClass('leftSideHolderSmall');
		$('.rightSideHolder')
			.removeClass('rightSideHolder').addClass('rightSideHolderSmall');
	}
	else {
		$('.leftSideHolderSmall')
			.removeClass('leftSideHolderSmall').addClass('leftSideHolder');
		$('.rightSideHolderSmall')
			.removeClass('rightSideHolderSmall').addClass('rightSideHolder');
	}
}