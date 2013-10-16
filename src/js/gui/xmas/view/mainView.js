var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};

(function()
{
    gui.xmas.view.MainView = function()
    {
		
	};
	gui.xmas.view.MainView.prototype = {
		init: function(){
			
			var smallOrNot = '';
			if (width < 940) {
				smallOrNot = 'Small';
			}

			gui.xmas.view.MainView.holder = document.createElement('div');
			var holderDiv = gui.xmas.view.MainView.holder;
			holderDiv.className = 'mainHolder';
			document.body.appendChild(holderDiv);
			
			var bg = document.createElement('div');
			bg.className = 'mainHolderBg';
			height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			$(bg).css('height', height);
			holderDiv.appendChild(bg);
			//TweenLite.fromTo(bg, 2, {css:{autoAlpha:0}}, {css:{autoAlpha:1}});
			
			var leftSideHolder = document.createElement('div');
			leftSideHolder.className = 'leftSideHolder' + smallOrNot;
			holderDiv.appendChild(leftSideHolder);
			
			var leftSideHeaderImg = document.createElement("img");
			leftSideHeaderImg.src = "assets/images/headerImage.png";
			leftSideHeaderImg.className = 'leftSideHeaderImage';
			leftSideHolder.appendChild(leftSideHeaderImg);
			
			gui.xmas.view.filterPanel.init();
			
			var rightSideHolder = document.createElement('div');
			rightSideHolder.className = 'rightSideHolder' + smallOrNot;
			holderDiv.appendChild(rightSideHolder);
			
			gui.xmas.view.wishListBox.init();
			
			var productsPanel = document.createElement('div');
			productsPanel.className = 'productsPanel';
			rightSideHolder.appendChild(productsPanel);
			
			gui.xmas.view.productsGridView.init();
			gui.xmas.view.singularProductView.init();
			
			var clearDiv = document.createElement('div');
			clearDiv.className = 'clearBoth';
			holderDiv.appendChild(clearDiv);

			var rightSideWidth = $('.rightSideHolder').width();
			if (width < 940) {
				rightSideWidth = $('.rightSideHolderSmall').width();
			}

			var filteringMsg = document.createElement('div');
			filteringMsg.id = 'filteringWait';
			document.body.appendChild(filteringMsg);
			
			//resizing shenanigans
			gui.xmas.view.wishListBox.carouselHolder.style.width = (rightSideWidth - 40 - $(gui.xmas.view.wishListBox.carouselHolder).height()) + 'px';

			if (width >= 940) {
				var rightSideMarginTop = $('.filterPanelLeftSide').offset().top - ($('.wishListPanelTop').height() + (width * 0.01));
				if (rightSideMarginTop < 30) {
					rightSideMarginTop = 30;
				}
				$('.rightSideHolder').css('margin-top', rightSideMarginTop + 'px');
			}
			else {
				$('.rightSideHolder').css('margin-top', '0px');
			}
			//gui.xmas.view.productsGridView.scrollUpUpdate();
			gui.xmas.view.mainView.budgeRightSideDown();
			
		},

		budgeRightSideDown: function() {
			//position the right hand side so that it lines up with the product grid
			if (width >= 940) {
				if ($('.filterPanelLeftSide').offset()) {
					var rightSideMarginTop = $('.filterPanelLeftSide').offset().top - ($('.wishListPanelTop').height() + (width * 0.01));
					if (rightSideMarginTop < 30) {
						rightSideMarginTop = 30;
					}
					$('.rightSideHolder').css('margin-top', rightSideMarginTop + 'px');
				}
			}
			else {
				$('.rightSideHolder').css('margin-top', '0px');
			}
		},

		goToSingularView: function() {
			if (gui.xmas.model.isIe) {
				var target = $('.singularProductHolder');
				TweenLite.to(target, .5, {css:{left:'0%'}});
				target = $('.productsGridHolder');
				TweenLite.to(target, .5, {css:{left:'-100%'}});	
			}
			else {
				var target = $('.singularProductHolder');
				target.css('left', '0%');
				target = $('.productsGridHolder');
				target.css('left', '-100%');
			}
		},

		goBackToListView:function() {
			if (gui.xmas.model.isIe) {
				var target = $('.singularProductHolder');
				TweenLite.to(target, .5, {css:{left:'100%'}});
				target = $('.productsGridHolder');
				TweenLite.to(target, .5, {css:{left:'0%'}});
			}
			else {
				var target = $('.singularProductHolder');
				target.css('left', '100%');
				target = $('.productsGridHolder');
				target.css('left', '0%');
			}
		},

		somethingsHappened: function(what){
			switch(what)
			{
				case gui.xmas.stateStrings.DISPLAY_FILTER_START:
					gui.xmas.view.mainView.init();
				break;
				case gui.xmas.stateStrings.PRODUCT_CLICKED:
					gui.xmas.view.mainView.goToSingularView();
				break;
				case gui.xmas.stateStrings.BACK_TO_LIST_CLICKED:
					gui.xmas.view.mainView.goBackToListView();
				break;
			}
		}
		
	}

}());