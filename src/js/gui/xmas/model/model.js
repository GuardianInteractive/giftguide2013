var gui = gui || {};
gui.xmas = gui.xmas || {};

/*
*********************************************Variables
*/
var layer = 1;

(function()
{

    gui.xmas.Model = function()
    {
		//set init vars
		width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
		this.ppi = window.devicePixelRatio || 1;
		this.smallView = true;
		if (width < (940 * this.ppi)) {
			this.smallView = true;
		}
		this.urlVarsExist = false;
		this.urlVarsArr = [];
		this.wishListItemsLookup = {};
		this.wishListItemsArr = [];
		this.activeFiltersArr = [];
		this.filterLookup = {};
		this.filterProductLookup = {};
		this.productNameFilterLookup = {};
		this.initFilterAll = true;
		this.giftLookup = {};
		this.currentGift = {};
		this.imgTagLookup = {};
		this.rightSideState = 1;
		this.productLiLookup = {};
		this.pricefilterLookup = {};
		this.displaySplash = false;
		this.screenVersion = 'iFrame';
		this.masterRootPath = 'http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/christmas-gift-guide-2013-presents-ideas-interactive/';
		this.imageRootPath = 'http://interactive.guim.co.uk/next-gen/lifeandstyle/ng-interactive/2013/christmas-gift-guide-2013-presents-ideas-interactive/assets/gift-images/';
		this.shareRootPath = 'http://gu.com/p/3kmqf';
		this.isIe = (function(){
			var undef,
			v = 3,
			div = document.createElement('div'),
			all = div.getElementsByTagName('i');

			while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
			);
				//v = version number
			return v > 4 ? true : false;
		}());
    };
	gui.xmas.Model.prototype = {

        getURLVars: function(){
			var urlParams = {};
			var match,
				pl     = /\+/g,  // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
				query  = window.location.search.substring(1);
			while (match = search.exec(query))
				if (decode(match[1]) == 'gifts') {
					urlParams[decode(match[1])] = decode(match[2]).split(",");
				}
				else {
					urlParams[decode(match[1])] = decode(match[2]);
				}
			if (urlParams['gifts']) {
				gui.xmas.model.urlVarsExist = true;
				gui.xmas.model.urlVarsArr = urlParams.gifts;
				return true;
			}
			else {
				return false;
			}
		},

		parseJSONData: function(data){
			gui.xmas.model.jsonData = data;

			var a, giftsLength = gui.xmas.model.jsonData.gifts.length;
			for (a = 0; a < gui.xmas.model.jsonData.filterContainers.length; a++) {
				var filterContainerFilters = gui.xmas.model.jsonData.filterContainers[a].filters, filterLength = filterContainerFilters.length, b;
				for (b = 0; b < filterLength; b++) {
					gui.xmas.model.activeFiltersArr[gui.xmas.model.activeFiltersArr.length] = filterContainerFilters[b];
					if (data.filterContainers[a].title.toLowerCase().indexOf("price") > -1) {
						gui.xmas.model.pricefilterLookup[filterContainerFilters[b]] = true;
					}
				}
			}
			for (a = 0; a < giftsLength; a++) {
				var gift = gui.xmas.model.jsonData.gifts[a], giftFilterLength = gift.filters.length, c;
				for (c = 0; c < giftFilterLength; c++) {
					var filterTitle = gui.xmas.model.jsonData.filterLookUp[gift.filters[c]];
					gui.xmas.model.filterProductLookup[filterTitle] = gui.xmas.model.filterProductLookup[filterTitle] || [];
					gui.xmas.model.filterProductLookup[filterTitle][gui.xmas.model.filterProductLookup[filterTitle].length] = gift;
					gui.xmas.model.productNameFilterLookup[gift.name] = gui.xmas.model.productNameFilterLookup[gift.name] || {};
					gui.xmas.model.productNameFilterLookup[gift.name][filterTitle] = true;
					gui.xmas.model.giftLookup[gift.name] = gift;
				}
			}
		},

		getAllProducts: function() {
			return gui.xmas.model.jsonData.gifts;
		},

		getCategoryGroupsAndTitles: function() {
			return gui.xmas.model.jsonData.filterContainers;
		},

		urlVarslistener: function(event) {
			switch(event)
			{
				case gui.xmas.stateStrings.GET_URL_VARS:
					gui.xmas.model.getURLVars();
				break;
			}
		},

		registerProductImageForLoading: function(data) {
			//data.img
			data.imgSrc = gui.xmas.model.imageRootPath + data.imgSrc;
			gui.xmas.model.thumbNailLoadArr = gui.xmas.model.thumbNailLoadArr || [];
			gui.xmas.model.thumbNailLoadArr[gui.xmas.model.thumbNailLoadArr.length] = data;
		},

		addItemToWishList: function(productId) {
			gui.xmas.model.wishListItemsLookup[productId] = true;
			gui.xmas.model.wishListItemsArr[gui.xmas.model.wishListItemsArr.length] = productId;

		},

		getWishListLength: function() {
			return gui.xmas.model.wishListItemsArr.length;
		},

		removeItemFromWishList: function(productId) {
			gui.xmas.model.wishListItemsLookup[productId] = false;
			var a, arrLength = gui.xmas.model.wishListItemsArr.length;
			for (a = 0; a < arrLength; a++) {
				if (gui.xmas.model.wishListItemsArr[a] == productId) {
					gui.xmas.model.wishListItemsArr.splice(a, 1);
					break;
				}
			}
		},

		checkItemIsInWishList: function(productId) {
			return gui.xmas.model.wishListItemsLookup[productId];
		},

		getWishListIdString: function() {
			if (gui.xmas.model.wishListItemsArr.length > 0) {
				var returnedStr = '?gifts=', wishListLength = gui.xmas.model.wishListItemsArr.length, a;
				for (a = 0; a < wishListLength; a++) {
					var idNum = gui.xmas.model.giftLookup[gui.xmas.model.wishListItemsArr[a]].id || 42;
					returnedStr += idNum;
					if (a < wishListLength - 1) {
						returnedStr += ',';
					}
				}
				return returnedStr;
			}
			else {
				return '';
			}
		},

		addFilter: function(filterName) {
			if (gui.xmas.model.initFilterAll) {
				gui.xmas.model.activeFiltersArr.length = 0;
				gui.xmas.model.initFilterAll = false;
			}
			gui.xmas.model.filterLookup[filterName] = true;
			gui.xmas.model.activeFiltersArr[gui.xmas.model.activeFiltersArr.length] = filterName;
			filterState.addFilter();
		},

		addAllFilters: function() {
			var a;
			gui.xmas.model.filterLookup = {};
			for (a = 0; a < gui.xmas.model.jsonData.filterContainers.length; a++) {
				var filterContainerFilters = gui.xmas.model.jsonData.filterContainers[a].filters, filterLength = filterContainerFilters.length, b;
				for (b = 0; b < filterLength; b++) {
					gui.xmas.model.activeFiltersArr[gui.xmas.model.activeFiltersArr.length] = filterContainerFilters[b];
					gui.xmas.model.filterLookup[filterContainerFilters[b]] = false;
				}
			}
			filterState.addFilter();
			gui.xmas.model.initFilterAll = true;
		},

		removeFilter: function(filterName) {
			var a, arrLength = gui.xmas.model.activeFiltersArr.length;
			for (a = 0; a < arrLength; a++) {
				if (gui.xmas.model.activeFiltersArr[a] == filterName) {
					gui.xmas.model.activeFiltersArr.splice(a, 1);
					gui.xmas.model.filterLookup[filterName] = false;
					break;
				}
			}
			filterState.removeFilter();
		},

		clearAllFilters: function() {
			gui.xmas.model.filterLookup = {};
			gui.xmas.model.activeFiltersArr.length = 0;
			filterState.removeFilter();
		},

		isFilterActive: function(filterName) {
			return gui.xmas.model.filterLookup[filterName];
		},

		removeSelectiveFilters: function(listIndex) {

			var categoriesAndFilters = gui.xmas.model.getCategoryGroupsAndTitles();

    		var b, filtersToRemove = categoriesAndFilters[listIndex].filters;

    		for (b = 0; b < filtersToRemove.length; b++) {

				gui.xmas.model.removeFilter(filtersToRemove[b]);
			}


		},

		getActiveProductsList: function() {
			var a, arrLength = gui.xmas.model.activeFiltersArr.length, returnedArr = [], productExistsObj = {};
			for (a = 0; a < arrLength; a++) {
				var b, subArrLength = gui.xmas.model.filterProductLookup[gui.xmas.model.activeFiltersArr[a]].length;
				for (b = 0; b < subArrLength; b++) {
					if (!productExistsObj[gui.xmas.model.filterProductLookup[gui.xmas.model.activeFiltersArr[a]][b].name]) {
						returnedArr[returnedArr.length] = gui.xmas.model.filterProductLookup[gui.xmas.model.activeFiltersArr[a]][b];
					}
					productExistsObj[gui.xmas.model.filterProductLookup[gui.xmas.model.activeFiltersArr[a]][b].name] = true;
				}
			}
			return returnedArr;
		},

		checkGiftIsInActiveFilters: function(productName) {
			var a, arrLength = gui.xmas.model.activeFiltersArr.length, isProductInfilters = true;
			//check if the filter is a price filter, if so perform an OR filter on that instead of an AND
			//make a price filter check lookup!
			var priceFilters = [];

			for (a = 0; a < arrLength; a++) {
				if (gui.xmas.model.pricefilterLookup[gui.xmas.model.activeFiltersArr[a]]) {
					priceFilters[priceFilters.length] = gui.xmas.model.activeFiltersArr[a];
					continue;
				}
				if (!gui.xmas.model.productNameFilterLookup[productName][gui.xmas.model.activeFiltersArr[a]]) {
					isProductInfilters = false;
					break;
				}
			}
			if (priceFilters.length > 0 && isProductInfilters) {
				var pricePass = false;
				arrLength = priceFilters.length;
				for (a = 0; a < arrLength; a++) {
					if (gui.xmas.model.productNameFilterLookup[productName][priceFilters[a]]) {
						pricePass = true;
						break;
					}
				}
				if (!pricePass) {
					isProductInfilters = false;
				}
			}
			return isProductInfilters;
		},

		registerProductClicked: function(productName) {
			gui.xmas.model.currentGift = gui.xmas.model.giftLookup[productName];
		},

		getCurrentGift: function() {
			return gui.xmas.model.currentGift;
		},

		isMobile: {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i);
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i);
		    },
		    any: function() {
		        return (gui.xmas.model.isMobile.Android() || gui.xmas.model.isMobile.BlackBerry() || gui.xmas.model.isMobile.iOS() || gui.xmas.model.isMobile.Opera() || gui.xmas.model.isMobile.Windows());
		    }
		}
	}

}());

/*
*********************************************STATE STRINGS
*/
gui.xmas.stateStrings = gui.xmas.stateStrings || {};
gui.xmas.stateStrings.GET_URL_VARS = "getUrlVars";
gui.xmas.stateStrings.START_LOADING_JSON = "startLoadingJSON";
gui.xmas.stateStrings.FINISHED_LOADING_JSON = "finishedLoadingJSON";
gui.xmas.stateStrings.LOADER_REMOVED = "loaderRemoved";
gui.xmas.stateStrings.DISPLAY_FILTER_START = "displayFilterStart";
gui.xmas.stateStrings.START_THUMBNAIL_IMAGE_LOAD = "startThumbnailImageLoad";
gui.xmas.stateStrings.FINISHED_THUMBNAIL_IMAGE_LOAD = "finishedThumbnailImageLoad";
gui.xmas.stateStrings.FILTER_ADDED = "filterAdded";
gui.xmas.stateStrings.FILTER_REMOVED = "filterRemoved";
gui.xmas.stateStrings.PRODUCT_CLICKED = "productClicked";
gui.xmas.stateStrings.BACK_TO_LIST_CLICKED = "backToListCLicked";

/*
*********************************************STATES
*/

var urlVarsState = {
	getVars:function () {
		var content = gui.xmas.stateStrings.GET_URL_VARS;
		this.publish(content);
	}
}

var loaderState = {
	startLoadingJSON:function () {
		var content = gui.xmas.stateStrings.START_LOADING_JSON;
		this.publish(content);
	},
	finishedLoadingJSON:function () {
		var content = gui.xmas.stateStrings.FINISHED_LOADING_JSON;
		this.publish(content);
	},
	loaderRemoved:function () {
		var content = gui.xmas.stateStrings.LOADER_REMOVED;
		this.publish(content);
	},
	startLoadingThumbs:function () {
		var content = gui.xmas.stateStrings.START_THUMBNAIL_IMAGE_LOAD;
		this.publish(content);
	},
	finishedLoadingThumbs:function () {
		var content = gui.xmas.stateStrings.FINISHED_THUMBNAIL_IMAGE_LOAD;
		this.publish(content);
	}
};

var displayState = {
	displayFilterStart:function () {
		var content = gui.xmas.stateStrings.DISPLAY_FILTER_START;
		this.publish(content);
	},
	productClicked:function () {
		gui.xmas.model.rightSideState = 2;
		var content = gui.xmas.stateStrings.PRODUCT_CLICKED;
		this.publish(content);
	},
	backToListClicked:function () {
		gui.xmas.model.rightSideState = 1;
		var content = gui.xmas.stateStrings.BACK_TO_LIST_CLICKED;
		this.publish(content);
	}
};

var filterState = {
	addFilter:function () {
		var content = gui.xmas.stateStrings.FILTER_ADDED;
		this.publish(content);
	},
	removeFilter:function () {
		var content = gui.xmas.stateStrings.FILTER_REMOVED;
		this.publish(content);
	}
}

/*
*********************************************Functions
*/