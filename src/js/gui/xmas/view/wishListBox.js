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
			var rightSideHolder = jQ('.leftSideHolder');
			containerOffset = 0;

			this.addNavigationButtons();
			var lazyResizeWishlist = _.debounce(this.resizeWishlist, 300);
			$(window).resize(lazyResizeWishlist);

			$('#wishlistItems').on('click', '.removeFromListBtn', function(e){
				var productId = e.currentTarget.getAttribute('data-product');
				gui.xmas.model.removeItemFromWishList(productId);
				gui.xmas.view.productsGridView.giftRemovedFromWishList(productId);
				gui.xmas.view.singularProductView.setWishListText(productId);
				gui.xmas.view.wishListBox.removeItemFromList(productId);
				
			});
			
		},

		handleCarouselItemLoadComplete: function(carousel, state) {
			gui.xmas.view.wishListBox.carousel = carousel;
		},

		constructCarouselImage: function(item) {
			return '<div style=\'border-left: 1px solid #dfdfdf; position: relative\'>' + '<img src="' + item.url + '" width="65" height="65" alt="' + item.url + '" style=\'position: absolute\' />' + '<div class=\'removeFromListBtn\'><span>+</span></div>' + '</div>';
		},

		addNavigationButtons:function(){
			var step = 160;
			var $wishlist = $('#wishlistItems ul');

			$('#wishlistItems').on('click', '.wishlistNavigate.active', function(e){
				var wrapperWidth = $('#wishlistItems').width();
				var wishlistArray = gui.xmas.model.wishListItemsArr;
				var containerWidth = wishlistArray.length * 80;
				if(e.currentTarget.id === 'wishlistNavNext'){
					containerOffset -= step;
				}else if(e.currentTarget.id === 'wishlistNavBack'){
					containerOffset += step;
				}
				$wishlist.css('margin-left',containerOffset);

				if(containerOffset < 0){
					$('#wishlistNavBack').addClass('active');
				}else{
					$('#wishlistNavBack').removeClass('active');
				}
				if(containerWidth + containerOffset < wrapperWidth){
					$('#wishlistNavNext').removeClass('active');
				}else{
					$('#wishlistNavNext').addClass('active');
				}
			})
		},
		updateWishlist:function(){
			var wishlistArray = gui.xmas.model.wishListItemsArr;
			var $wishlist = document.querySelector('#wishlistItems ul');
			var containerWidth = wishlistArray.length * 80;
			$wishlist.innerHTML = "";
			
			for(var i=0;i<wishlistArray.length;i++){
				var currentGift = gui.xmas.model.giftLookup[wishlistArray[i]];

				var wishlistItem = document.createElement('li');
				var itemImage = document.createElement('img');
				itemImage.src = gui.xmas.model.imageRootPath + currentGift.thumbnailPicUrl;
				itemImage.alt = currentGift.name;
				
				var removeBtn = document.createElement('div');
				removeBtn.className = "removeFromListBtn";
				removeBtn.setAttribute('data-product', currentGift.name)

				wishlistItem.appendChild(itemImage);
				wishlistItem.appendChild(removeBtn);
				$wishlist.appendChild(wishlistItem);
				$wishlist.style.width = containerWidth + 'px';
			}
			var wrapperWidth = $('#wishlistItems').width();

			var wishlistOffset = parseInt($wishlist.style.marginLeft);
			if(containerWidth + wishlistOffset > wrapperWidth){
				$('#wishlistNavNext').addClass('active');
			}else{
				$('#wishlistNavNext').removeClass('active');
			}
		},

		addItemToList: function() {
			this.updateWishlist();
		},

		removeItemFromList: function() {
			console.log(gui.xmas.model.wishListItemsArr);
			this.updateWishlist();
		},

		resizeWishlist:function(){
			var $wishlist = $('#wishlistItems ul');
			var wrapperWidth = $('#wishlistItems').width();
			var wishlistWidth = $wishlist.width();
			var wishlistOffset = parseInt($wishlist.css('margin-left'));
			console.log(wishlistWidth,wishlistOffset,wrapperWidth);
			if(wishlistWidth + wishlistOffset < wrapperWidth){
				$('#wishlistNavNext').removeClass('active');
			}else{
				$('#wishlistNavNext').addClass('active');
			}
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