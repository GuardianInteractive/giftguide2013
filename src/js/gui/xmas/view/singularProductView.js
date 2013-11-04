var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};

(function()
{
    gui.xmas.view.SingularProductView = function()
    {
		
	};
	gui.xmas.view.SingularProductView.prototype = {
		init: function(){
			/*
			var prevArrow = document.createElement('img');
			prevArrow.src = 'assets/images/leftArrowActive.png';
			prevArrow.style.position = 'absolute';
			prevArrow.style.top = '100px';
			prevArrow.style.zIndex = '2';
			mainImgHolder.appendChild(prevArrow);	
			*/
			var productsHolder = jQ('.productsPanel');
			
			var singularProductHolder = document.createElement('div');
			singularProductHolder.className = 'singularProductHolder';
			productsHolder.append(singularProductHolder);
			
			var topLeftDiv = document.createElement('div');
			topLeftDiv.className = 'singularProductLeftTop';
			singularProductHolder.appendChild(topLeftDiv);

			//click listener on the back to list div
			jQ(topLeftDiv).click(function() {
				jQ(gui.xmas.view.singularProductView.topRightDiv).off();
				displayState.backToListClicked();
			});

			var backToGridIcon = document.createElement('img');
			backToGridIcon.src = gui.xmas.model.masterRootPath + 'assets/images/backToGridIcon.gif';
			backToGridIcon.style.cssFloat = 'left';
			backToGridIcon.style.margin = '0 10px 0 10px';
			topLeftDiv.appendChild(backToGridIcon);

			var backToGridTitle = document.createElement('p');
			backToGridTitle.innerHTML = 'Back to list view';
			backToGridTitle.style.cssFloat = 'left';
			topLeftDiv.appendChild(backToGridTitle);

			var topRightDiv = document.createElement('div');
			topRightDiv.className = 'singularProductRightTop';
			singularProductHolder.appendChild(topRightDiv);
			gui.xmas.view.singularProductView.topRightDiv = topRightDiv;

			var addToWishListIcon = document.createElement('div');
				addToWishListIcon.id = 'addToWishList';
				addToWishListIcon.style.position = 'absolute';
				addToWishListIcon.style.top = '0px';
				addToWishListIcon.style.right = '0px';
				addToWishListIcon.innerHTML = "+ <strong>Add</strong>";
				topRightDiv.appendChild(addToWishListIcon);


				//itemDiv.appendChild(addToWishListIcon);

			var addToWishListTitle = document.createElement('p');
			addToWishListTitle.innerHTML = 'Add item to wish list';
			addToWishListTitle.style.cssFloat = 'right';
			topRightDiv.appendChild(addToWishListTitle);
			gui.xmas.view.singularProductView.addToWishListTitle = addToWishListTitle;
			
			var clearTopHalfDiv = document.createElement('div');
			clearTopHalfDiv.className = 'clearBoth';
			singularProductHolder.appendChild(clearTopHalfDiv);

			var topSeperator = document.createElement('div');
			topSeperator.style.width = '100%';
			topSeperator.style.height = '1px';
			topSeperator.style.backgroundColor = '#dfdfdf';
			topSeperator.style.cssFloat = 'left';
			topSeperator.style.margin = '10px 0 10px 0';
			singularProductHolder.appendChild(topSeperator);

			var productDetailHolder = document.createElement('div');
			productDetailHolder.id = 'productDetailHolder';
			productDetailHolder.style.cssFloat = 'left';
			productDetailHolder.style.width = '100%';
			productDetailHolder.style.position = 'relative';
			singularProductHolder.appendChild(productDetailHolder);

			var loadingImageMsg = document.createElement('div');
			loadingImageMsg.className = 'loadingLargeImageMsg';
			productDetailHolder.appendChild(loadingImageMsg);
			gui.xmas.view.singularProductView.loadingImageMsg = loadingImageMsg;

			var loadingTitle = document.createElement('h1');
			loadingTitle.innerHTML = 'Loading...';
			loadingTitle.style.textAlign = 'center';
			loadingImageMsg.appendChild(loadingTitle);

			var mainImg = document.createElement('img');
			mainImg.style.width = '100%';
			mainImg.style.height = 'auto';
			productDetailHolder.appendChild(mainImg);
			gui.xmas.view.singularProductView.mainImg = mainImg;

			var bottomSeperator = document.createElement('div');
			bottomSeperator.style.width = '100%';
			bottomSeperator.style.height = '1px';
			bottomSeperator.style.backgroundColor = '#dfdfdf';
			bottomSeperator.style.cssFloat = 'left';
			bottomSeperator.style.margin = '10px 0 10px 0';
			singularProductHolder.appendChild(bottomSeperator);

			var productTitleHolder = document.createElement('div');
			productTitleHolder.style.width = '100%';
			singularProductHolder.appendChild(productTitleHolder);

			var productTitle = document.createElement('h1');
			productTitle.style.cssFloat = 'left';
			productTitle.style.margin = '0 20px 0 20px'
			productTitleHolder.appendChild(productTitle);
			gui.xmas.view.singularProductView.productTitle = productTitle;

			var productPrice = document.createElement('h1');
			productPrice.style.marginRight = '20px';
			productPrice.style.cssFloat = 'right';
			productTitleHolder.appendChild(productPrice);
			gui.xmas.view.singularProductView.productPrice = productPrice;

			var clearProductTitleHolder = document.createElement('div');
			clearProductTitleHolder.className = 'clearBoth';
			productTitleHolder.appendChild(clearProductTitleHolder);

			var productDescription = document.createElement('p');
			productDescription.style.margin = '10px 20px 20px 20px';
			singularProductHolder.appendChild(productDescription);
			gui.xmas.view.singularProductView.productDescription = productDescription;
			
			var shareListHolder = document.createElement('div');
			shareListHolder.className = 'shareListHolder';
			shareListHolder.style.marginBottom = '15px';
			singularProductHolder.appendChild(shareListHolder);
			
			var shareListTitle = document.createElement('h2');
			shareListTitle.innerHTML = 'Share my list';
			shareListTitle.style.cssFloat = 'left';
			shareListTitle.style.marginTop = '6px';
			shareListHolder.appendChild(shareListTitle);
			
			var fbIcon = document.createElement('img');
			fbIcon.src = gui.xmas.model.masterRootPath + "assets/images/FB.gif";
			fbIcon.className = 'shareIcon';
			shareListHolder.appendChild(fbIcon);
			jQ(fbIcon).click(function(event) {
				var urlStr = gui.xmas.model.getWishListIdString();
				window.open('https://www.facebook.com/sharer/sharer.php?u=' + gui.xmas.model.shareRootPath, '_blank');
			});
			
			var twitterIcon = document.createElement('img');
			twitterIcon.src = gui.xmas.model.masterRootPath + "assets/images/twitter.gif";
			twitterIcon.className = 'shareIcon';
			shareListHolder.appendChild(twitterIcon);
			jQ(twitterIcon).click(function(event) {
			//jQ(shareListHolder).click(function(event) {
				//to get included somewhere
				var shareOnTwitter = {		
					twitterUrl: 'https://twitter.com/intent/tweet',
					params: {
						url: gui.xmas.model.shareRootPath,
						related: 'guardian',
						text: 'Check out this Christmas gift guide I found on @guardian'
					},
					constructUrl: function(params) {
					window.open(this.twitterUrl + '?' + [ 'url=' + encodeURIComponent( this.params.url ), 'text=' + this.params.text, 'related=' + this.params.related ].join( '&' ));
					}
				}
				var urlStr = gui.xmas.model.getWishListIdString();
				if (urlStr.length > 0) {
					shareOnTwitter.params.text = 'Check out this Christmas wish list I made on @guardian'
					shareOnTwitter.params.url += urlStr;
				}

				//to get called on click
				shareOnTwitter.constructUrl();
			});
			
			var pinIcon = document.createElement('img');
			pinIcon.src = gui.xmas.model.masterRootPath + "assets/images/pinterest.gif";
			pinIcon.className = 'shareIcon';
			shareListHolder.appendChild(pinIcon);
			jQ(pinIcon).click(function(event) {
				event.preventDefault();
				gui.xmas.view.singularProductView.handlePinterestClick();
			});

		},

		updateProductInfo: function(giftObj) {
			gui.xmas.view.singularProductView.currentGiftName = giftObj.name;

			gui.xmas.view.singularProductView.productTitle.innerHTML = giftObj.name;
			var giftPrice = giftObj.cost;
			var from = giftPrice.indexOf('From');
			if (from > -1) {
				giftPrice = (giftPrice.slice(0,(from + 5))) + '&pound;' + giftPrice.slice(from + 5);
			}
			else {
				giftPrice = '&pound;' + giftPrice;
			}
			var dot = giftPrice.indexOf('.');
			if (dot > -1 && dot >= giftPrice.length - 2) {
				giftPrice += '0';
			}
			var imgSrc = gui.xmas.model.imageRootPath + giftObj.bigPicUrl;
			
			
			gui.xmas.view.singularProductView.productPrice.innerHTML = giftPrice;
			gui.xmas.view.singularProductView.productDescription.innerHTML = giftObj.description + '<br/><br/><a href=\'' + giftObj.buyUrl + '\' target=\'_blank\'>' + "Go to shop" + '</a>';
			gui.xmas.view.singularProductView.mainImg.style.visibility = 'hidden';
			gui.xmas.view.singularProductView.mainImg.style.display = 'none';
			gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'block';
			gui.xmas.view.singularProductView.mainImg.src = gui.xmas.model.imageRootPath + giftObj.bigPicUrl;
			gui.xmas.view.singularProductView.mainImg.alt = giftObj.name + " - " + giftObj.description;
			if (gui.xmas.view.singularProductView.mainImg.complete || gui.xmas.view.singularProductView.mainImg.readyState == "complete" || gui.xmas.view.singularProductView.mainImg.readyState == 4) {
				gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'none';
				gui.xmas.view.singularProductView.mainImg.style.display = 'block';
				TweenLite.to(gui.xmas.view.singularProductView.mainImg, 2, {css:{autoAlpha:1}});
				gui.xmas.view.singularProductView.setRightSideHeight();
			}
			
    
			gui.xmas.view.singularProductView.mainImg.onload = function() {
				TweenLite.killTweensOf(gui.xmas.view.singularProductView.mainImg);
				gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'none';
				gui.xmas.view.singularProductView.mainImg.style.display = 'block';
				TweenLite.to(gui.xmas.view.singularProductView.mainImg, 2, {css:{autoAlpha:1}});
				gui.xmas.view.singularProductView.setRightSideHeight();
			};
			gui.xmas.view.singularProductView.mainImg.onerror = function() {
				gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'none';
				gui.xmas.view.singularProductView.mainImg.style.display = 'block';
				gui.xmas.view.singularProductView.mainImg.src = gui.xmas.model.masterRootPath + 'assets/images/imageNotFoundBigPic.gif';				
				TweenLite.to(gui.xmas.view.singularProductView.mainImg, 2, {css:{autoAlpha:1}});
				gui.xmas.view.singularProductView.setRightSideHeight();
			}

			if (!gui.xmas.model.wishListItemsLookup[giftObj.name]) {
				gui.xmas.view.singularProductView.addToWishListTitle.innerHTML = 'Add item to wishlist';
			}
			else {
				gui.xmas.view.singularProductView.addToWishListTitle.innerHTML = 'Remove item from wishlist';
			}
			
			jQ(gui.xmas.view.singularProductView.topRightDiv).click(function(event) {
				if (!gui.xmas.model.wishListItemsLookup[giftObj.name]) {
					gui.xmas.model.addItemToWishList(giftObj.name);
					gui.xmas.view.wishListBox.addItemToList(giftObj.name);
					gui.xmas.view.productsGridView.giftAddedToWishList(giftObj.name);
					gui.xmas.view.singularProductView.addToWishListTitle.innerHTML = 'Remove item from wishlist';
				}
				else {
					gui.xmas.model.removeItemFromWishList(giftObj.name);
					gui.xmas.view.wishListBox.removeItemFromList(giftObj.name);
					gui.xmas.view.productsGridView.giftRemovedFromWishList(giftObj.name);
					gui.xmas.view.singularProductView.addToWishListTitle.innerHTML = 'Add item to wishlist';
				}
			});
			
		},

		setRightSideHeight: function() {
			jQ('.productsPanel').css('height', jQ('.singularProductHolder').height() + 'px');
		},
		
		setWishListText: function(giftName) {
			if (gui.xmas.view.singularProductView.addToWishListTitle) {
				if (giftName === gui.xmas.view.singularProductView.currentGiftName) {
					if (!giftName) {
						gui.xmas.view.singularProductView.addToWishListTitle.innerHTML = 'Remove item from wishlist';
					}
					else {
						gui.xmas.view.singularProductView.addToWishListTitle.innerHTML = 'Add item to wishlist';
					}	
				}
			}
		},

		somethingsHappened: function(what){
			switch(what)
			{
				case gui.xmas.stateStrings.PRODUCT_CLICKED:
					gui.xmas.view.singularProductView.updateProductInfo(gui.xmas.model.getCurrentGift());
				break;
			}
		},
		
		buildPinterestURL: function() {
			var jQcurrentImage   = jQ(gui.xmas.view.singularProductView.mainImg);
	  var bookmarkletURL  = 'http://pinterest.com/pin/create/button/',
	      mediaURL        = "" + jQcurrentImage.attr('src'),
	      mediaURLenc     = encodeURIComponent(mediaURL),
	      shareURL        = window.location,
	      shareURLenc     = encodeURIComponent(shareURL),
	      description     = jQcurrentImage.attr('alt') + "",
	      descriptionenc  = encodeURIComponent(description),
	      pinterestURL    = bookmarkletURL + '?media=' + mediaURLenc + '&url=' + shareURLenc + '&description=' + descriptionenc;
	      
	  return pinterestURL;
		},
		
		handlePinterestClick: function() {
			
			  
	
	  var pinterestURL = gui.xmas.view.singularProductView.buildPinterestURL();
	  window.open(pinterestURL,'_blank','width=200,height=350,toolbar=0,location=0,directories=0,status=0');
	  return false;

		}
		
	}

}());