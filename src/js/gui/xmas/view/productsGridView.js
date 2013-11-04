var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};

(function()
{
    gui.xmas.view.ProductsGridView = function()
    {
		
	};
	gui.xmas.view.ProductsGridView.prototype = {
		init: function(){		
			
			var productsHolder = jQ('.productsPanel');
			
			var productsGridHolder = document.createElement('div');
			productsGridHolder.className = 'productsGridHolder';
			productsHolder.append(productsGridHolder);
			
			var giftsArr = gui.xmas.model.getAllProducts(), giftsLength = giftsArr.length;
			
			var title = document.createElement('h1');
			title.innerHTML = 'Showing <span id="filteredGiftsNum">' + giftsLength + '</span> gift ideas';
			productsGridHolder.appendChild(title);

			

			var gridList = document.createElement('ul');
			gridList.id = 'productsList';
			productsGridHolder.appendChild(gridList);

			var paginationHolderTop = document.createElement('div');
			paginationHolderTop.className = 'paginationHolderTop';
			productsGridHolder.appendChild(paginationHolderTop);
			gui.xmas.view.productsGridView.paginationHolderTop = paginationHolderTop;

			var a;
			for (a = 0; a < giftsLength; a++) {
				var gridLi = document.createElement('li');
				gridLi.id = giftsArr[a].name;
				gridLi.style.margin = 0;
				gridLi.style.padding = 0;
				gridList.appendChild(gridLi);
				
				var itemDiv = document.createElement('div');
				itemDiv.className = 'productGridItem';
				itemDiv.style.position = 'relative';
				itemDiv.style.margin = 0;
				itemDiv.style.padding = 0;
				gridLi.appendChild(itemDiv);
				
				var itemImg = new Image();
				itemImg.id = 'productThumb';
				itemImg.src = gui.xmas.model.masterRootPath + "assets/images/productWaiting.gif";
				itemDiv.appendChild(itemImg);
				gui.xmas.model.imgTagLookup[giftsArr[a].name] = {'img':itemImg, 'thumbPath':gui.xmas.model.imageRootPath + giftsArr[a].thumbnailPicUrl, 'isLoaded':false};
				//gui.xmas.model.registerProductImageForLoading({'img':itemImg, 'imgSrc':giftsArr[a].thumbnailPicUrl});
				
				var descripHolder = document.createElement('div');
				descripHolder.id = 'productTitle';
				descripHolder.style.width = '90%';
				descripHolder.style.height = '20%';
				descripHolder.style.overflow = 'hidden';
				descripHolder.style.position = 'absolute';
				descripHolder.style.zIndex = '2';
				itemDiv.appendChild(descripHolder);
				
				var descrip = document.createElement('textarea');
				descrip.unselectable = 'on';
				descrip.innerHTML = giftsArr[a].name;
				descripHolder.appendChild(descrip);
				
				var addToWishListIcon = document.createElement('div');
				addToWishListIcon.id = 'addToWishList';
				addToWishListIcon.style.position = 'absolute';
				addToWishListIcon.style.top = '0px';
				addToWishListIcon.style.right = '0px';
				addToWishListIcon.innerHTML = "+ <strong>Add</strong>";
				addToWishListIcon.style.visibility = 'hidden';
				itemDiv.appendChild(addToWishListIcon);

				if (gui.xmas.model.urlVarsExist) {
					gridLi.style.display = 'none';
					var b, urlVarListLength = gui.xmas.model.urlVarsArr.length;
					for (b = 0; b < urlVarListLength; b++) {
						if (giftsArr[a].id == gui.xmas.model.urlVarsArr[b]) {
							gridLi.style.display = 'inline-block';
							gui.xmas.model.addItemToWishList(giftsArr[a].name);
							gui.xmas.view.wishListBox.addItemToList(giftsArr[a].name);
							jQ(gridLi).find('#addToWishList').attr("src",gui.xmas.model.masterRootPath + "assets/images/wishMinus.gif");
							TweenLite.to(jQ(gridLi).find('#addToWishList'), 0, {css:{autoAlpha:1}});
							break;
						}
					}

				}
				
				if (gui.xmas.model.screenVersion === 'iFrame') {
					jQ(gridLi).mouseover(function() {
						TweenLite.to(jQ(this).find('#addToWishList'), .5, {css:{autoAlpha:1}});
					});
					
					jQ(gridLi).mouseout(function() {
						var productId = jQ(this).find('textarea').val();
						if (!gui.xmas.model.wishListItemsLookup[productId]) {
							TweenLite.to(jQ(this).find('#addToWishList'), .5, {css:{autoAlpha:0}});
						}
					});
				}

				jQ(addToWishListIcon).click(function(){
					var productId = jQ(this).parent().find('textarea').val();
					if (!gui.xmas.model.wishListItemsLookup[productId]) {
						gui.xmas.model.addItemToWishList(productId);
						gui.xmas.view.wishListBox.addItemToList(productId);
						jQ(this).html("<strong>Added</strong>")
					}
					else {
						gui.xmas.model.removeItemFromWishList(productId);
						gui.xmas.view.wishListBox.removeItemFromList(productId);
						jQ(this).html("+ <strong>Add</strong>")
					}
				});

				jQ(itemImg).click(function(){
					var productId = jQ(this).parent().find('textarea').val();
					gui.xmas.model.registerProductClicked(productId);
						displayState.productClicked();
						if (gui.xmas.model.smallView) {
							jQ('.productsPanel').ScrollTo({
								duration: 0
							});
						}
						else {
							window.scrollTo(0, 0);
						}
				});
				
				
			}

			if (gui.xmas.model.urlVarsExist) {
				title.innerHTML = 'Showing <span id="filteredGiftsNum">' + gui.xmas.model.urlVarsArr.length + '</span> wishlist gift ideas';
			}
			
			loaderState.startLoadingThumbs();
			
			var productsHolder = jQ('.productsPanel'), rightSideWidth = productsHolder.parent().width();
			var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, percentWidth = (100 / numAcross);
			jQ('.productsGridHolder  li').css('width', percentWidth + '%');

			var timer;
			jQ(window).bind('scroll',function () {
				clearTimeout(timer);
				timer = setTimeout(gui.xmas.view.productsGridView.scrollUpUpdate, 400);
			});

			if (!gui.xmas.model.urlVarsExist) {
				gui.xmas.model.clearAllFilters();
			}
			else {
				//resize the right hand side to the amount of items in uyour wish list!
				///////////////////////////////////////////////////////
				var rightSideWidth = jQ('.rightSideHolder').width();
				if (width < 9400) {
					rightSideWidth = jQ('.rightSideHolderSmall').width();
				}
				var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, liSize = rightSideWidth / numAcross, urlVarListLength = gui.xmas.model.urlVarsArr.length;
				gui.xmas.view.productsGridView.maxNumOnPage = Math.floor((jQ('.filterPanelLeftSide').height() - jQ('#productsList').position().top) / liSize) * numAcross;
				var numOnPage = gui.xmas.view.productsGridView.maxNumOnPage;
				if (urlVarListLength < numOnPage) {
					numOnPage = urlVarListLength;
					if (numOnPage < numAcross) {
						numOnPage = numAcross;
					}
				}
				var gridHeight = jQ('#productsList').position().top + (Math.ceil(numOnPage / numAcross) * (liSize + 4.7));
				gui.xmas.view.productsGridView.setRightSideHeight(gridHeight);
				///////////////////////////////////////////////////////
			}
			gui.xmas.view.productsGridView.scrollUpUpdate();

		},

		scrollUpUpdate: function() {

			//var ulTopPos = jQ('#productsList').offset().top, scrollPos = (document.all ? document.scrollTop : window.pageYOffset), windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var ulTopPos = jQ('#productsList').offset().top, scrollPos = gui.xmas.view.productsGridView.getScroll()[1], windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var rightSideWidth = jQ('.rightSideHolder').width();
			if (width < 9400) {
				rightSideWidth = jQ('.rightSideHolderSmall').width();
			}
			var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, gridHeight = rightSideWidth / numAcross, howManyRowsDown = (scrollPos - ulTopPos) / gridHeight, howManyVisibleInTheWindow = (windowHeight / gridHeight);
			if (howManyRowsDown < 0) {
				howManyVisibleInTheWindow - Math.abs(howManyRowsDown);
				howManyRowsDown = 0;
			}
			else {
				howManyRowsDown = Math.floor(howManyRowsDown);
			}
			howManyVisibleInTheWindow = Math.ceil(howManyVisibleInTheWindow);
			var startLiNum = howManyRowsDown * numAcross;
			var endNum = startLiNum + (howManyVisibleInTheWindow * numAcross);
			var giftsArr = gui.xmas.model.getAllProducts(), giftsLength = giftsArr.length;
			var a, currentItt = startLiNum, filteredLis = [];
			var numInActiveList = 0;
			/*
			for (a = 0; a < giftsLength; a++) {
				var liItem = jQ('#productsList li:eq(' + a + ')');
				if (liItem.css('display') == 'inline-block') {
					filteredLis[filteredLis.length] = liItem;
				}
			}
			*/
			var itemsLength = jQ('#productsList li').filter(function(index) {
				if (jQ(this).css("display") === "none") {
					return 0;
				}
				else {
					filteredLis[filteredLis.length] = jQ(this);
					return 1;
				}
			});
			for (a = startLiNum; a < endNum; a++) {
				var liItem = filteredLis[a];
				//if (liItem.attr('id')) {
				if (liItem) {
					//load all the images here based on the id strings
					//giftData.thumbnailPicUrl
					var imgObj = gui.xmas.model.imgTagLookup[liItem.attr('id')];
					if (!imgObj.isLoaded) {
						imgObj.img.src = imgObj.thumbPath;
						imgObj.isLoaded = true;
					}
				}
			}
		},

		getScroll: function() {
			if(window.pageYOffset!= undefined){
				return [pageXOffset, pageYOffset];
			}
			else{
				var sx, sy, d= document, r= d.documentElement, b= d.body;
				sx= r.scrollLeft || b.scrollLeft || 0;
				sy= r.scrollTop || b.scrollTop || 0;
				return [sx, sy];
			}
		},

		// setRightSideHeight: function(passedHeight) {
		// 	if (passedHeight) {
		// 		jQ('.productsPanel').css('height', passedHeight);
		// 		jQ('.productsGridHolder').css('height', passedHeight);
		// 	}
		// 	else {
		// 		var rightSideWidth = jQ('.rightSideHolder').width();
		// 		if (width < 9400) {
		// 			rightSideWidth = jQ('.rightSideHolderSmall').width();
		// 		}

		// 		var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, liSize = rightSideWidth / numAcross, ul = document.getElementById('productsList');
		// 		var itemsLength = jQ('#productsList li').filter(function(index) {
		// 			if (jQ(this).css("display") === "none") {
		// 				return 0;
		// 			}
		// 			else {
		// 				return 1;
		// 			}
		// 		}).length;
		// 		var numOnPage = (gui.xmas.model.screenVersion === 'iFrame') ? gui.xmas.view.productsGridView.maxNumOnPage : itemsLength;
		// 		if (gui.xmas.model.screenVersion !== 'iFrame' || itemsLength < numOnPage) {
		// 			numOnPage = itemsLength;
		// 			if (numOnPage < numAcross) {
		// 				numOnPage = numAcross;
		// 			}
		// 		}
		// 		var gridHeight = jQ('#productsList').position().top + (Math.ceil(numOnPage / numAcross) * (liSize + 4.7));
		// 		jQ('.productsPanel').css('height', gridHeight);
		// 		jQ('.productsGridHolder').css('height', gridHeight);
		// 	}
		// },
		
		thumbailLoaded: function(img) {
			TweenLite.fromTo(img, .5, {css:{autoAlpha:0}}, {css:{autoAlpha:1}});
		},
		
		filterList: function() {
			var rightSideWidth = jQ('.rightSideHolder').width();
			if (width < 9400) {
				rightSideWidth = jQ('.rightSideHolderSmall').width();
			}
			//gui.xmas.model.screenVersion === 'iFrame'
			var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, liSize = rightSideWidth / numAcross;
			gui.xmas.view.productsGridView.maxNumOnPage = Math.floor(((jQ('.filterPanelLeftSide').height() * 10) - jQ('#productsList').position().top) / liSize) * numAcross;
			gui.xmas.view.productsGridView.filteredGiftsTotal = 0;
			var span = document.getElementById('filteredGiftsNum'), ul = document.getElementById('productsList'), items = ul.getElementsByTagName('li'), itemsLength = items.length, a;
			gui.xmas.view.productsGridView.paginationArr = [];
			var numAddedToPage = 0;
			for (a = 0; a < itemsLength; a++) {
				if (!gui.xmas.model.checkGiftIsInActiveFilters(items[a].id)) {
					items[a].style.display = 'none';
				}
				else {
					numAddedToPage ++;
					items[a].style.display = 'inline-block';
					if (gui.xmas.model.screenVersion === 'iFrame') {
						if (numAddedToPage <= gui.xmas.view.productsGridView.maxNumOnPage) {
							items[a].style.display = 'inline-block';
						}
						else {
							items[a].style.display = 'none';
						}
						gui.xmas.view.productsGridView.paginationArr[gui.xmas.view.productsGridView.paginationArr.length] = items[a];
					}
					gui.xmas.view.productsGridView.filteredGiftsTotal ++;
				}
			}
			if (gui.xmas.view.productsGridView.filteredGiftsTotal > gui.xmas.view.productsGridView.maxNumOnPage && gui.xmas.model.screenVersion === 'iFrame') {
				gui.xmas.view.productsGridView.paginationHolderTop.style.display = 'block';
				var numOfPages = Math.ceil(gui.xmas.view.productsGridView.filteredGiftsTotal / gui.xmas.view.productsGridView.maxNumOnPage), paginationHTML = '<p>Page:';
				for (a = 0; a < numOfPages; a ++) {
					if (a === 0) {
						paginationHTML += '<span>' + (a + 1) + '</span>';
					}
					else {
						paginationHTML += '<a onclick="javaScript:gui.xmas.view.productsGridView.handlePaginationClick(' + (a + 1) + ')">' + (a + 1) + '</a>';
					}
				}
				gui.xmas.view.productsGridView.paginationHolderTop.innerHTML = paginationHTML;

			}
			else {
				gui.xmas.view.productsGridView.paginationHolderTop.style.display = 'none';
			}
			span.innerHTML = gui.xmas.view.productsGridView.filteredGiftsTotal;
			
			//gui.xmas.view.productsGridView.setRightSideHeight();
		},

		handlePaginationClick: function(pageNum) {
			var numOfPages = Math.ceil(gui.xmas.view.productsGridView.filteredGiftsTotal / gui.xmas.view.productsGridView.maxNumOnPage), paginationHTML = '<p>Page:', a;
			for (a = 0; a < numOfPages; a++) {
				if (a === parseInt(pageNum - 1)) {
					paginationHTML += ('<span>' + (a + 1) + '</span>');
				}
				else {
					paginationHTML += '<a onclick="javaScript:gui.xmas.view.productsGridView.handlePaginationClick(' + (a + 1) + ')">' + (a + 1) + '</a>';
				}
			}
			paginationHTML += '</p>';
			gui.xmas.view.productsGridView.paginationHolderTop.innerHTML = paginationHTML;
			var paginationarrLength = gui.xmas.view.productsGridView.paginationArr.length, startNum = (pageNum - 1) * gui.xmas.view.productsGridView.maxNumOnPage;
			var endNum = startNum + gui.xmas.view.productsGridView.maxNumOnPage;
			for (a = 0; a < paginationarrLength; a++) {
				if (a >= startNum && a <= endNum) {
					gui.xmas.view.productsGridView.paginationArr[a].style.display = 'inline-block';
				}
				else {
					gui.xmas.view.productsGridView.paginationArr[a].style.display = 'none';
				}
			}
			gui.xmas.view.productsGridView.scrollUpUpdate();

		},

		giftAddedToWishList: function(giftName) {
			var a, ul = document.getElementById('productsList'), items = ul.getElementsByTagName('li');
			for (a = 0; a < items.length; a++) {
				if (items[a].id == giftName) {
					jQ(items[a]).find('#addToWishList').attr("src", gui.xmas.model.masterRootPath + "assets/images/wishMinus.gif");
					TweenLite.to(jQ(items[a]).find('#addToWishList'), .5, {css:{autoAlpha:1}});
					break;
				}
			}
		},
		
		giftRemovedFromWishList: function(giftName) {
			var a, ul = document.getElementById('productsList'), items = ul.getElementsByTagName('li');
			for (a = 0; a < items.length; a++) {
				if (items[a].id == giftName) {
					jQ(items[a]).find('#addToWishList').attr("src", gui.xmas.model.masterRootPath + "assets/images/wishPlus.gif");
					TweenLite.to(jQ(items[a]).find('#addToWishList'), .5, {css:{autoAlpha:0}});
					break;
				}
			}
		},

		somethingsHappened: function(what){
			switch(what) {
				case gui.xmas.stateStrings.BACK_TO_LIST_CLICKED:
					//gui.xmas.view.productsGridView.setRightSideHeight();
				break;
			}
		},

		filterListener: function(e) {
			switch(e) {
				case gui.xmas.stateStrings.FILTER_ADDED:
				case gui.xmas.stateStrings.FILTER_REMOVED:
					gui.xmas.view.productsGridView.filterList();
				break;
			}
		}
		
	}

}());