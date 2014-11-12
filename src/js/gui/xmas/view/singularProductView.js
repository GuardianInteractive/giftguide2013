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
			var productsHolder = jQ('.productsPanel');
			var singularProductHolder = document.createElement('div');
			singularProductHolder.className = 'singularProductHolder';
			productsHolder.append(singularProductHolder);

			var singularProductTemplate = jQ('#singularProductTemplate').html();
			var singularProductObject = {
				productImage : "",
				productTitle : "",
				productDescription: "",
				productUrl: "",
				inWishlist: "Add to wishlist"
			}
			var singularProductContent = _.template(singularProductTemplate,singularProductObject);
			singularProductHolder.innerHTML = singularProductContent;
		},

		updateProductInfo: function(giftObj) {
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

			var wishlistText;
			if (!gui.xmas.model.wishListItemsLookup[giftObj.name]) {
				wishlistText = '+ <strong>Add to wishlist</strong>';
			}
			else {
				wishlistText = '<strong>Remove from wishlist</strong>';
			}


			var singularProductTemplate = jQ('#singularProductTemplate').html();
			var singularProductObject = {
				productImage : gui.xmas.model.imageRootPath + giftObj.bigPicUrl,
				productTitle : giftObj.name,
				giftPrice: giftPrice,
				productDescription: giftObj.description,
				productUrl: giftObj.buyUrl,
				inWishlist: wishlistText,
			}
			var singularProductContent = _.template(singularProductTemplate,singularProductObject);

			jQ('.singularProductHolder').html(singularProductContent);
			var singularOffset = ((jQ('.mainHolder').width() / 2) - (jQ('.singularContent').get(0).offsetWidth /2 )) + 'px';
			jQ('.singularContent').css('left',singularOffset);
			
			jQ('#detailDescrip #addToWishList').on('click',function(event) {
				var inWishlist = gui.xmas.model.wishListItemsLookup[giftObj.name];
				if (!inWishlist) {
					gui.xmas.model.addItemToWishList(giftObj.name);
					gui.xmas.view.wishListBox.addItemToList(giftObj.name);
					gui.xmas.view.productsGridView.giftAddedToWishList(giftObj.name);
					$(this).html('<strong>Added to wishlist</strong>');
				}else {
					gui.xmas.model.removeItemFromWishList(giftObj.name);
					gui.xmas.view.wishListBox.removeItemFromList(giftObj.name);
					gui.xmas.view.productsGridView.giftRemovedFromWishList(giftObj.name);
					$(this).html('+ <strong>Add to wishlist</strong>');
				}
			});

			jQ('#backToGridBtn').click(function() {
				console.log('hey');
				jQ(gui.xmas.view.singularProductView.addToWishListIcon).off();
				displayState.backToListClicked();
			});
			jQ('.singularBackground').click(function() {
				jQ(gui.xmas.view.singularProductView.addToWishListIcon).off();
				displayState.backToListClicked();
			});

			jQ('#shareIconFb').click(function(event) {
				var urlStr = gui.xmas.model.getWishListIdString();
				window.open('https://www.facebook.com/sharer/sharer.php?u=' + gui.xmas.model.shareRootPath, '_blank');
			});

			jQ('#shareIconTwitter').click(function(event) {
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

			jQ('#shareIconPinterest').click(function(event) {
				event.preventDefault();
				gui.xmas.view.singularProductView.handlePinterestClick();
			});

		},



		setWishListText: function(giftName) {
			if (gui.xmas.view.singularProductView.addToWishListIcon) {
				if (giftName === gui.xmas.view.singularProductView.currentGiftName) {
					if (!giftName) {
						gui.xmas.view.singularProductView.addToWishListIcon.innerHTML = '<strong>Remove from wishlist</strong>';
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