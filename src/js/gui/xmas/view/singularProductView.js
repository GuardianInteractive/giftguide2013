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

			var singularBackground = document.createElement('div');
			singularBackground.className = 'singularBackground';
			singularProductHolder.appendChild(singularBackground);

			var singularContent = document.createElement('div');
			singularContent.className = 'singularContent';
			singularProductHolder.appendChild(singularContent);
			
			var topLeftDiv = document.createElement('div');
			topLeftDiv.className = 'singularProductLeftTop';
			singularContent.appendChild(topLeftDiv);

			//click listener on the back to list div
			

			var backToGridIcon = document.createElement('img');
			backToGridIcon.id = "backToGridBtn";
			backToGridIcon.style.position = "absolute";
			backToGridIcon.src = gui.xmas.model.masterRootPath + 'assets/images/closeSingularViewBtn.png';

			
			topLeftDiv.appendChild(backToGridIcon);

			

			jQ(backToGridIcon).click(function() {
				jQ(gui.xmas.view.singularProductView.addToWishListIcon).off();
				displayState.backToListClicked();
			});
			jQ(singularBackground).click(function() {
				jQ(gui.xmas.view.singularProductView.addToWishListIcon).off();
				displayState.backToListClicked();
			});




				//itemDiv.appendChild(addToWishListIcon);

			



			var productDetailHolder = document.createElement('div');
			productDetailHolder.id = 'productDetailHolder';
			singularContent.appendChild(productDetailHolder);

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

			var productTitleHolder = document.createElement('div');
			productTitleHolder.id = "detailDescrip";
			singularContent.appendChild(productTitleHolder);

			var clearSingularView = document.createElement('div');
			clearSingularView.className = "clearBoth";
			singularContent.appendChild(clearSingularView);

			var productTitle = document.createElement('h1');
			productTitle.style.cssFloat = 'left';
			productTitle.style.marginRight = '10px';
			productTitleHolder.appendChild(productTitle);
			gui.xmas.view.singularProductView.productTitle = productTitle;

			var productPrice = document.createElement('h1');
			productPrice.style.cssFloat = 'left';
			productPrice.style.fontSize = '16px';
			productPrice.style.marginTop = '4px';

			productTitleHolder.appendChild(productPrice);
			gui.xmas.view.singularProductView.productPrice = productPrice;

			var clearProductTitleHolder = document.createElement('div');
			clearProductTitleHolder.className = 'clearBoth';
			productTitleHolder.appendChild(clearProductTitleHolder);

			var productDescription = document.createElement('p');
			productDescription.style.marginBottom = "25px";
			productTitleHolder.appendChild(productDescription);
			gui.xmas.view.singularProductView.productDescription = productDescription;

			var addToWishListIcon = document.createElement('div');
				addToWishListIcon.id = 'addToWishList';
				
				addToWishListIcon.innerHTML = "+ <strong>Add</strong>";
				productTitleHolder.appendChild(addToWishListIcon);
				gui.xmas.view.singularProductView.addToWishListIcon = addToWishListIcon;
			
			var shareListHolder = document.createElement('div');
			shareListHolder.className = 'shareListHolder';
			productTitleHolder.appendChild(shareListHolder);

			var clearShareList = document.createElement('div');
			clearShareList.className = 'clearBoth';
			productTitleHolder.appendChild(clearShareList);
			
			var shareListTitle = document.createElement('h2');
			shareListTitle.innerHTML = 'Share my list';
			shareListTitle.style.cssFloat = 'left';
			shareListHolder.appendChild(shareListTitle);

			var clearShareTitle = document.createElement('div');
			clearShareTitle.className = "clearBoth";
			shareListHolder.appendChild(clearShareTitle);

			
			var fbIcon = document.createElement('img');
			fbIcon.src = gui.xmas.model.masterRootPath + "assets/images/fbIcon.png";
			fbIcon.className = 'shareIcon';
			shareListHolder.appendChild(fbIcon);
			jQ(fbIcon).click(function(event) {
				var urlStr = gui.xmas.model.getWishListIdString();
				window.open('https://www.facebook.com/sharer/sharer.php?u=' + gui.xmas.model.shareRootPath, '_blank');
			});
			
			var twitterIcon = document.createElement('img');
			twitterIcon.src = gui.xmas.model.masterRootPath + "assets/images/tweetIcon.png";
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
			pinIcon.src = gui.xmas.model.masterRootPath + "assets/images/pinItIcon.png";
			pinIcon.className = 'shareIcon';
			pinIcon.style.width = '40px';
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
			gui.xmas.view.singularProductView.productDescription.innerHTML = giftObj.description + '<br/><br/><a href=\'' + giftObj.buyUrl + '\' target=\'_blank\' class=\'linkToShop\'>' + "Go to shop »" + '</a>';
			gui.xmas.view.singularProductView.mainImg.style.visibility = 'hidden';
			gui.xmas.view.singularProductView.mainImg.style.display = 'none';
			gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'block';
			gui.xmas.view.singularProductView.mainImg.src = gui.xmas.model.imageRootPath + giftObj.bigPicUrl;
			gui.xmas.view.singularProductView.mainImg.alt = giftObj.name + " - " + giftObj.description;
			if (gui.xmas.view.singularProductView.mainImg.complete || gui.xmas.view.singularProductView.mainImg.readyState == "complete" || gui.xmas.view.singularProductView.mainImg.readyState == 4) {
				gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'none';
				gui.xmas.view.singularProductView.mainImg.style.display = 'block';
				TweenLite.to(gui.xmas.view.singularProductView.mainImg, 2, {css:{autoAlpha:1}});
				
			}
			
    
			gui.xmas.view.singularProductView.mainImg.onload = function() {
				TweenLite.killTweensOf(gui.xmas.view.singularProductView.mainImg);
				gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'none';
				gui.xmas.view.singularProductView.mainImg.style.display = 'block';
				TweenLite.to(gui.xmas.view.singularProductView.mainImg, 2, {css:{autoAlpha:1}});
				
			};
			gui.xmas.view.singularProductView.mainImg.onerror = function() {
				gui.xmas.view.singularProductView.loadingImageMsg.style.display = 'none';
				gui.xmas.view.singularProductView.mainImg.style.display = 'block';
				gui.xmas.view.singularProductView.mainImg.src = gui.xmas.model.masterRootPath + 'assets/images/imageNotFoundBigPic.gif';				
				TweenLite.to(gui.xmas.view.singularProductView.mainImg, 2, {css:{autoAlpha:1}});
				
			}

			if (!gui.xmas.model.wishListItemsLookup[giftObj.name]) {
				gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '+ <strong>Add to wishlist</strong>';
			}
			else {
				gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '<strong>Added to wishlist</strong>';
			}
			
			jQ(gui.xmas.view.singularProductView.addToWishListIcon).click(function(event) {
				console.log(giftObj.name, gui.xmas.model.wishListItemsLookup[giftObj.name]);
				if (!gui.xmas.model.wishListItemsLookup[giftObj.name]) {	
					gui.xmas.model.addItemToWishList(giftObj.name);
					gui.xmas.view.wishListBox.addItemToList(giftObj.name);
					gui.xmas.view.productsGridView.giftAddedToWishList(giftObj.name);
					gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '<strong>Added to wishlist</strong>';
				}
				else {
					gui.xmas.model.removeItemFromWishList(giftObj.name);
					gui.xmas.view.wishListBox.removeItemFromList(giftObj.name);
					gui.xmas.view.productsGridView.giftRemovedFromWishList(giftObj.name);
					gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '+ <strong>Add to wishlist</strong>';
				}
			});
			
		},

		
		
		setWishListText: function(giftName) {
			if (gui.xmas.view.singularProductView.addToWishListIcon) {
				if (giftName === gui.xmas.view.singularProductView.currentGiftName) {
					if (!giftName) {
						gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '<strong>Added to wishlist</strong>';
					}
					else {
						gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '+ <strong>Add to wishlist</strong>';
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