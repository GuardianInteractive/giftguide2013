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
			var productTemplate = $('#productTemplate').html();
			var productsHolder = jQ('.productsPanel');

			var productsGridHolder = document.createElement('div');
			productsGridHolder.className = 'productsGridHolder';
			productsHolder.append(productsGridHolder);

			var giftsArr = gui.xmas.model.getAllProducts(), giftsLength = giftsArr.length;

			$('#giftCount').html('Showing <span id="filteredGiftsNum">' + giftsLength + '</span> gift ideas');



			var gridList = document.createElement('ul');
			gridList.id = 'productsList';
			productsGridHolder.appendChild(gridList);

			var paginationHolderTop = document.createElement('div');
			paginationHolderTop.className = 'paginationHolderTop';
			productsGridHolder.appendChild(paginationHolderTop);
			gui.xmas.view.productsGridView.paginationHolderTop = paginationHolderTop;

			for (var a = 0; a < giftsLength; a++) {
				var giftPrice = giftsArr[a].cost;
				// console.log(giftPrice);
				if(typeof giftPrice !== "number"){

					from = giftPrice.indexOf('From');
					if (from > -1) {
						giftPrice =  '&pound;' + giftPrice.slice(from + 5) + "+";
					}
				}else{
					if(giftPrice%1!==0){
						var decimalLength = giftPrice.toString().split('.')[1].length;
						if(decimalLength === 1){
							var newGiftPrice = giftPrice.toString() + "0";
							giftPrice = "&pound;" + newGiftPrice;
						}else{
							giftPrice = "&pound;" + giftPrice;
						}
					}else{
						giftPrice = "&pound;" + giftPrice;
					}
					
				}
				

				var productObject = {
					productId: giftsArr[a].name,
					productImage: gui.xmas.model.imageRootPath + giftsArr[a].thumbnailPicUrl,
					productTitle: giftsArr[a].name,
					productPrice: giftPrice
				}

				var productItem = _.template(productTemplate,productObject);
				
				var gridLi = document.createElement('li');
				gridLi.id = giftsArr[a].name;
				gridLi.innerHTML = productItem;
				gridList.appendChild(gridLi);


				if (gui.xmas.model.urlVarsExist) {
					gridLi.style.display = 'none';
					var b, urlVarListLength = gui.xmas.model.urlVarsArr.length;
					for (b = 0; b < urlVarListLength; b++) {
						if (giftsArr[a].id == gui.xmas.model.urlVarsArr[b]) {
							gridLi.style.display = 'inline-block';
							gui.xmas.model.addItemToWishList(giftsArr[a].name);
							gui.xmas.view.wishListBox.addItemToList(giftsArr[a].name);
							gui.xmas.view.productsGridView.updateProductContainers(giftsArr[a].name);
							// jQ(gridLi).find('#addToWishList').attr("src",gui.xmas.model.masterRootPath + "assets/images/wishMinus.gif");

							// TweenLite.to(jQ(gridLi).find('#addToWishList'), 0, {css:{autoAlpha:1}});
							break;
						}
					}

				}

			}		

			jQ('.addToWishList').click(function(){
				var productId = jQ(this).parent().find('p.productName').html();
				if (!gui.xmas.model.wishListItemsLookup[productId]) {
					gui.xmas.model.addItemToWishList(productId);
					gui.xmas.view.productsGridView.updateProductContainers(productId);
					gui.xmas.view.wishListBox.addItemToList(productId);
				}
				else {
					gui.xmas.model.removeItemFromWishList(productId);
					gui.xmas.view.wishListBox.removeItemFromList(productId);
					gui.xmas.view.productsGridView.updateProductContainers(productId);
				}
			});
			jQ('.productGridItem .productThumbHolder').click(function(){
				var productId = jQ(this).closest('li').find('p.productName').html();
				gui.xmas.model.registerProductClicked(productId);
				displayState.productClicked();
			});

			jQ('.productGridItem .descripAndTitleContainer').click(function(){
				var productId = jQ(this).closest('li').find('p.productName').html();
				gui.xmas.model.registerProductClicked(productId);
				displayState.productClicked();
			});



			if (gui.xmas.model.urlVarsExist) {
				var idea = gui.xmas.model.urlVarsArr.length === 1 ? 'idea' : 'ideas';
				$('#giftCount').html('Showing wishlist with <span id="filteredGiftsNum">' + gui.xmas.model.urlVarsArr.length + '</span> ' + idea);
			}

			var productsHolder = jQ('.productsPanel');
			
			if (!gui.xmas.model.urlVarsExist) {
				gui.xmas.model.clearAllFilters();
			}else {
                gui.xmas.view.productsGridView.maxNumOnPage = 40;
				var numOnPage = gui.xmas.view.productsGridView.maxNumOnPage;
				if (urlVarListLength < numOnPage) {
					numOnPage = urlVarListLength;
				}
			}

			// gui.xmas.view.productsGridView.scrollUpUpdate();

		},

		updateProductContainers:function(productId){
			var iteminGrid = $('#productsList div[data-productId="'+productId+'"]');
			if(gui.xmas.model.wishListItemsLookup[productId]){
				iteminGrid.addClass('itemInWishlist');
			}else{
				iteminGrid.removeClass('itemInWishlist');
			}
			
		},

		scrollUpUpdate: function() {
			//var ulTopPos = jQ('#productsList').offset().top, scrollPos = (document.all ? document.scrollTop : window.pageYOffset), windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var ulTopPos = jQ('#productsList').offset().top 
			scrollPos = gui.xmas.view.productsGridView.getScroll()[1], 
			windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var rightSideWidth = jQ('.rightSideHolder').width();
			var numAcross = (rightSideWidth / (159 / gui.xmas.model.ppi)) | 0, 
			gridHeight = rightSideWidth / numAcross, 
			howManyRowsDown = (scrollPos - ulTopPos) / gridHeight, 
			howManyVisibleInTheWindow = (windowHeight / gridHeight);

			var startLiNum = howManyRowsDown * numAcross;
			var endNum = startLiNum + (howManyVisibleInTheWindow * numAcross);
			var giftsArr = gui.xmas.model.getAllProducts(), giftsLength = giftsArr.length;
			var a, currentItt = startLiNum, filteredLis = [];
			var numInActiveList = 0;
			
			var itemsLength = jQ('#productsList li').filter(function(index) {
				if (jQ(this).css("display") === "none") {
					return 0;
				}
				else {
					filteredLis[filteredLis.length] = jQ(this);
					return 1;
				}
			});
			
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


		thumbailLoaded: function(img) {
			TweenLite.fromTo(img, .5, {css:{autoAlpha:0}}, {css:{autoAlpha:1}});
		},

		filterList: function() {
			gui.xmas.view.productsGridView.maxNumOnPage = 40;
			gui.xmas.view.productsGridView.filteredGiftsTotal = 0;
			var span = document.getElementById('filteredGiftsNum'), 
			ul = document.getElementById('productsList'), 
			items = ul.getElementsByTagName('li'), 
			itemsLength = items.length, a;
			gui.xmas.view.productsGridView.paginationArr = [];
			var numAddedToPage = 0;
			var currentCounter = 0;
			for (a = 0; a < itemsLength; a++) {
				items[a].className = '';
				if (!gui.xmas.model.checkGiftIsInActiveFilters(items[a].id)) {
					items[a].style.display = 'none';
				}
				else {
					numAddedToPage ++;
					items[a].style.display = 'inline-block';


						if (numAddedToPage <= gui.xmas.view.productsGridView.maxNumOnPage) {
							items[a].style.display = 'inline-block';
						}
						else {
							items[a].style.display = 'none';

						}
						gui.xmas.view.productsGridView.paginationArr[gui.xmas.view.productsGridView.paginationArr.length] = items[a];

					gui.xmas.view.productsGridView.filteredGiftsTotal ++;
				}
			}
			if(numAddedToPage === 0){
				if($('.noGifts').length===0){
					var noGifts = $('<p class="noGifts">No gifts found</p>');
					$('.productsGridHolder').prepend(noGifts);
				}
			}else{
				$('.noGifts').remove();
			}
			if (gui.xmas.view.productsGridView.filteredGiftsTotal > gui.xmas.view.productsGridView.maxNumOnPage) {
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
				if (a >= startNum && a < endNum) {
					gui.xmas.view.productsGridView.paginationArr[a].style.display = 'inline-block';
				}
				else {
					gui.xmas.view.productsGridView.paginationArr[a].style.display = 'none';
				}
			}
			gui.xmas.view.productsGridView.scrollUpUpdate();
			var topOflist = jQ('.productsPanel').offset().top;
			jQ(window).scrollTop(topOflist);
		},

		giftAddedToWishList: function(giftName) {
			var a, ul = document.getElementById('productsList'), items = ul.getElementsByTagName('li');
			for (a = 0; a < items.length; a++) {
				if (items[a].id == giftName) {
					jQ(items[a]).find('#addToWishList').html("<strong>Added</strong>");
					TweenLite.to(jQ(items[a]).find('#addToWishList'), .5, {css:{autoAlpha:1}});
					break;
				}
			}
		},

		giftRemovedFromWishList: function(giftName) {
			var a, ul = document.getElementById('productsList'), items = ul.getElementsByTagName('li');
			for (a = 0; a < items.length; a++) {
				if (items[a].id == giftName) {
					jQ(items[a]).find('#addToWishList').html("+ <strong>Add</strong>")
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