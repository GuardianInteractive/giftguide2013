var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};

(function()
{
    gui.xmas.view.WishListBox = function()
    {
		this.wishListIndexLookup = {};
	};
	gui.xmas.view.WishListBox.prototype = {
		init: function(){

			var smallOrNot = '';
			if (width < 9400) {
				smallOrNot = 'Small';
			}

			//var rightSideHolder = jQ('.rightSideHolder' + smallOrNot);
			var rightSideHolder = jQ('.leftSideHolder' + smallOrNot);

			var wishListBox = document.createElement('div');
			wishListBox.className = 'wishListPanelTop'; 
			rightSideHolder.append(wishListBox);

			var titleHolder = document.createElement('div');
			titleHolder.style.cssFloat = 'left';
			titleHolder.style.margin = '10px 0 0 0';
			wishListBox.appendChild(titleHolder);

			var title = document.createElement('h1');
			title.innerHTML = 'My TV guide: <span id="wishListNum">0</span> movies';
			title.style.width = '100%';
			gui.xmas.view.wishListBox.containsText = title;
			titleHolder.appendChild(title);

			var titleWidth = jQ(titleHolder).width();
			gui.xmas.model.wishListInitWidth = rightSideHolder.width();
			gui.xmas.model.carouselInitWidth = (gui.xmas.model.wishListInitWidth - (titleWidth + 120))

			var clearTitle = document.createElement('div');
			clearTitle.className = 'clearBoth';
			wishListBox.appendChild(clearTitle);

			gui.xmas.view.wishListBox.carouselHolder = document.createElement('div');
			var carouselHolder = gui.xmas.view.wishListBox.carouselHolder;
			carouselHolder.className = 'carouselHolder';
			wishListBox.appendChild(carouselHolder);

			var testDiv = document.createElement('ul');
			testDiv.className = 'jcarousel-skin-tango';
			testDiv.id = 'wishlistCarousel';
			carouselHolder.appendChild(testDiv);

			jQ(testDiv).jcarousel({
				size: 1,
				itemLoadCallback: {onBeforeAnimation: gui.xmas.view.wishListBox.handleCarouselItemLoadComplete},
				itemFallbackDimension: width
			});

			var clearDiv = document.createElement('div');
			clearDiv.className = 'clearBoth';
			wishListBox.appendChild(clearDiv);


			var copyURLHolder = document.createElement('div');
			copyURLHolder.className = 'copyURLHolder';
			wishListBox.appendChild(copyURLHolder);

			var copyURLTitle = document.createElement('h2');
			copyURLTitle.innerHTML = 'Copy URL';
			copyURLTitle.style.cssFloat = 'left';
			copyURLTitle.style.marginTop = '6px';
			copyURLTitle.style.marginBottom = '12px';
			copyURLHolder.appendChild(copyURLTitle);

			var copyURLArea = document.createElement('input');
			copyURLArea.className = 'copyURLP';
			copyURLArea.id = 'copyURLP';
			copyURLHolder.appendChild(copyURLArea);
			gui.xmas.view.wishListBox.copyURLArea = copyURLArea;

			jQ(copyURLArea).click(function(event) {
				this.select();
				// var para = document.getElementById('copyURLP'), range;
				// if (window.getSelection && document.createRange) {
				// 	range = document.createRange();
				// 	var sel = window.getSelection();
				// 	range.selectNodeContents(para);
				// 	sel.removeAllRanges();
				// 	sel.addRange(range);
				// } else if (document.body && document.body.createTextRange) {
				// 	range = document.body.createTextRange();
				// 	range.moveToElementText(para);
				// 	range.select();
				// }
			});

			var clearCopyURLDiv = document.createElement('div');
			clearCopyURLDiv.className = 'clearBoth';
			copyURLHolder.appendChild(clearCopyURLDiv);

			var shareListHolder = document.createElement('div');
			shareListHolder.className = 'shareListHolder';
			wishListBox.appendChild(shareListHolder);

			var shareListTitle = document.createElement('h2');
			shareListTitle.innerHTML = 'Share my list';
			shareListTitle.style.cssFloat = 'left';
			shareListTitle.style.marginTop = '6px';
			shareListHolder.appendChild(shareListTitle);

			var fbIcon = document.createElement('img');
			fbIcon.src = gui.xmas.model.masterRootPath + "assets/images/fbIcon.png";
			fbIcon.className = 'shareIcon';
			shareListHolder.appendChild(fbIcon);
			jQ(fbIcon).click(function(event) {
				var urlStr = gui.xmas.model.getWishListIdString();
                var fbURL = 'https://www.facebook.com/sharer/sharer.php?u=' + gui.xmas.model.shareRootPath;
                if (urlStr) {
                    fbURL += encodeURIComponent( urlStr );
                }

				window.open(fbURL, '_blank');
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
						text: 'Make your own personalised Christmas TV viewing list @guardian ' + gui.xmas.model.shareRootPath
					},
					constructUrl: function(params) {
					window.open(this.twitterUrl + '?' + [ 'text=' + this.params.text, 'related=' + this.params.related ].join( '&' ));
					}
				}
				var urlStr = gui.xmas.model.getWishListIdString();
				if (urlStr.length > 0) {
					shareOnTwitter.params.text = "Here's my list of Christmas TV. "+ shareOnTwitter.params.url + urlStr + " What's on yours? " ;
					shareOnTwitter.params.url += urlStr;
				}

				//to get called on click
				shareOnTwitter.constructUrl();
			});

			var clearBottomHalfDiv = document.createElement('div');
			clearBottomHalfDiv.className = 'clearBoth';
			wishListBox.appendChild(clearBottomHalfDiv);

		},

		handleCarouselItemLoadComplete: function(carousel, state) {
			gui.xmas.view.wishListBox.carousel = carousel;
		},

		constructCarouselImage: function(item) {
			return '<div style=\'border-left: 1px solid #dfdfdf; position: relative\'>' + '<img src="' + item.url + '" width="65" height="97" alt="' + item.url + '" style=\'position: absolute\' />' + '<div class=\'removeFromListBtn\'>x</div>' + '</div>';
		},

		addItemToList: function(id) {

			var listLength = gui.xmas.model.getWishListLength();
			var s = (listLength == 1) ? '' : 's';
			gui.xmas.view.wishListBox.containsText.innerHTML = 'My wishlist: <span id="wishListNum">' + listLength + '</span> item' + s;

			jQ("#wishlist-button-counter").html(listLength);


			gui.xmas.model.giftLookup[id].bigPicUrl


			gui.xmas.view.wishListBox.wishListIndexLookup[id] = listLength;

			gui.xmas.view.wishListBox.carousel.add(listLength, gui.xmas.view.wishListBox.constructCarouselImage({url: gui.xmas.model.giftLookup[id].bigPicUrl, title: gui.xmas.model.giftLookup[id].name}));
			gui.xmas.view.wishListBox.carousel.size(listLength);
			gui.xmas.view.wishListBox.carousel.scroll(listLength, true);

			var newItem = gui.xmas.view.wishListBox.carousel.get(listLength);
			var removeItemIcn = newItem.find('.removeFromListBtn');

			newItem.attr('id', 'wishlistItem' + id);
			removeItemIcn.css('cursor', 'pointer');
			jQ(removeItemIcn).click(function(event) {
				
				var productId = newItem[0].id.split('wishlistItem').join('');
				gui.xmas.model.removeItemFromWishList(productId);
				gui.xmas.view.wishListBox.removeItemFromList(productId);
				gui.xmas.view.productsGridView.giftRemovedFromWishList(productId);
				gui.xmas.view.singularProductView.setWishListText(productId);
			});

			gui.xmas.view.wishListBox.constructURLString();
		},

		removeItemFromList: function(id) {
			var listLength = gui.xmas.model.getWishListLength();
			var s = (listLength == 1) ? '' : 's';
			gui.xmas.view.wishListBox.containsText.innerHTML = 'My wishlist: <span id="wishListNum">' + listLength + '</span> item' + s;

			jQ("#wishlist-button-counter").html(listLength);

			gui.xmas.view.wishListBox.carousel.reset();
			var a;
			for (a = 0; a < listLength; a++) {
				gui.xmas.view.wishListBox.carousel.add(a + 1, gui.xmas.view.wishListBox.constructCarouselImage({url: gui.xmas.model.giftLookup[gui.xmas.model.wishListItemsArr[a]].bigPicUrl, title: gui.xmas.model.giftLookup[gui.xmas.model.wishListItemsArr[a]].name}));
				gui.xmas.view.wishListBox.carousel.size(a + 1);
				//
				var newItem = gui.xmas.view.wishListBox.carousel.get(a + 1);
				newItem.attr('id', 'wishlistItem' + gui.xmas.model.wishListItemsArr[a]);
				newItem.css('cursor', 'pointer');
				jQ(newItem).click(function(event) {
					var productId = this.id.split('wishlistItem').join('');
					gui.xmas.model.removeItemFromWishList(productId);
					gui.xmas.view.wishListBox.removeItemFromList(productId);
					gui.xmas.view.productsGridView.giftRemovedFromWishList(productId);
				});
			}

			gui.xmas.view.wishListBox.constructURLString();
		},

		constructURLString: function() {
			var urlStr = gui.xmas.model.getWishListIdString();
			if (urlStr.length === 0) {
				urlStr = '';
			}
			else {
				urlStr = gui.xmas.model.shareRootPath + urlStr;
			}
			//gui.xmas.view.wishListBox.copyURLArea.value = urlStr;
			gui.xmas.view.wishListBox.copyURLArea.value = urlStr;
		}

	}

}());