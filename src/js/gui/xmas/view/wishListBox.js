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
				gui.xmas.view.productsGridView.updateProductContainers(productId);
			});
			gui.xmas.view.wishListBox.updateShareButtons();
			
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

			if(wishlistArray.length === 0){
				$('#emptyWishlist').css('display','block')
			}else{
				$('#emptyWishlist').css('display','none')
			}
			for(var i=0;i<wishlistArray.length;i++){
				var currentGift = _.where(gui.xmas.model.jsonData.gifts,{name:wishlistArray[i]})[0];

				var wishlistItem = document.createElement('li');
				var itemImage = document.createElement('img');
				itemImage.src = gui.xmas.model.imageRootPath + currentGift.thumbnailPicUrl;
				// itemImage.src = "assets/images/imageNotFoundThumbnail.gif";
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
			this.updateShareButtons();
		},
		updateShareButtons:function(){
			if(gui.xmas.model.wishListItemsArr.length === 0){
				$('.shareTwitter').attr('href','https://twitter.com/home?status=Check out this Christmas gift guide I found on @guardian ' + gui.xmas.model.shareRootPath);
				$('.shareFb').attr('href','https://www.facebook.com/sharer/sharer.php?u=' + gui.xmas.model.shareRootPath);
				$('.shareUrl').attr('href',gui.xmas.model.shareRootPath);
			}else{
				$('.shareTwitter').attr('href','https://twitter.com/home?status=Check out my Guardian Christmas Gift Guide wishlist ' + gui.xmas.view.wishListBox.constructURLString());
				$('.shareFb').attr('href','https://www.facebook.com/sharer/sharer.php?u=' + gui.xmas.view.wishListBox.constructURLString());
				$('.shareUrl').attr('href',gui.xmas.view.wishListBox.constructURLString());
			}
		},

		addItemToList: function() {
			this.updateWishlist();
		},

		removeItemFromList: function() {
			this.updateWishlist();
		},

		resizeWishlist:function(){
			var $wishlist = $('#wishlistItems ul');
			var wrapperWidth = $('#wishlistItems').width();
			var wishlistWidth = $wishlist.width();
			var wishlistOffset = parseInt($wishlist.css('margin-left'));
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
			// gui.xmas.view.wishListBox.copyURLArea.value = urlStr;
			return urlStr;
		}

	}

}());