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
			if (width < 9400) {
				smallOrNot = 'Small';
			}
			
			var el = gui.xmas.el;

			gui.xmas.view.MainView.holder = document.createElement('div');
			var holderDiv = gui.xmas.view.MainView.holder;
			holderDiv.className = 'mainHolder';
			el.appendChild(holderDiv);
			
			var bg = document.createElement('div');
			bg.className = 'mainHolderBg';
			height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			jQ(bg).css('height', height);
			holderDiv.appendChild(bg);
			//TweenLite.fromTo(bg, 2, {css:{autoAlpha:0}}, {css:{autoAlpha:1}});
			
			var leftSideHolder = document.createElement('div');
			leftSideHolder.className = 'leftSideHolder' + smallOrNot;
			holderDiv.appendChild(leftSideHolder);
			
			var leftSideHeaderImg = document.createElement("img");
			leftSideHeaderImg.src = gui.xmas.model.masterRootPath + "assets/images/headerImage.png";
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

			var rightSideWidth = jQ('.rightSideHolder').width();
			if (width < 9400) {
				rightSideWidth = jQ('.rightSideHolderSmall').width();
			}

			var filteringMsg = document.createElement('div');
			filteringMsg.id = 'filteringWait';
			document.body.appendChild(filteringMsg);
			
			//resizing shenanigans
			gui.xmas.view.wishListBox.carouselHolder.style.width = (rightSideWidth - 40 - jQ(gui.xmas.view.wishListBox.carouselHolder).height()) + 'px';

			if (width >= 9400) {
				var rightSideMarginTop = jQ('.filterPanelLeftSide').offset().top - (jQ('.wishListPanelTop').height() + (width * 0.01));
				if (rightSideMarginTop < 30) {
					rightSideMarginTop = 30;
				}
				jQ('.rightSideHolder').css('margin-top', rightSideMarginTop + 'px');
			}
			else {
				jQ('.rightSideHolder').css('margin-top', '0px');
			}
			//gui.xmas.view.productsGridView.scrollUpUpdate();
			gui.xmas.view.mainView.budgeRightSideDown();
			
		},

		budgeRightSideDown: function() {
			//position the right hand side so that it lines up with the product grid
			if (width >= 9400) {
				if (jQ('.filterPanelLeftSide').offset()) {
					var rightSideMarginTop = jQ('.filterPanelLeftSide').offset().top - (jQ('.wishListPanelTop').height() + (width * 0.01));
					if (rightSideMarginTop < 30) {
						rightSideMarginTop = 30;
					}
					jQ('.rightSideHolder').css('margin-top', rightSideMarginTop + 'px');
				}
			}
			else {
				jQ('.rightSideHolder').css('margin-top', '0px');
			}
		},

		goToSingularView: function() {
			if (gui.xmas.model.isIe) {
				var target = jQ('.singularProductHolder');
				jQ(target).css('display', 'block');
				//TweenLite.to(target, .5, {css:{left:'0%'}});
				//target = jQ('.productsGridHolder');
				//TweenLite.to(target, .5, {css:{left:'-100%'}});	
			}
			else {
				var target = jQ('.singularProductHolder');
				jQ(target).css('display', 'block');
				// target.css('left', '0%');
				// target = jQ('.productsGridHolder');
				//target.css('left', '-100%');
			}
		},

		goBackToListView:function() {
			if (gui.xmas.model.isIe) {
				var target = jQ('.singularProductHolder');
				jQ(target).css('display', 'none');
				// TweenLite.to(target, .5, {css:{left:'100%'}});
				// target = jQ('.productsGridHolder');
				// TweenLite.to(target, .5, {css:{left:'0%'}});
			}
			else {
				var target = jQ('.singularProductHolder');
				target.css('display', 'none');
				// target.css('left', '100%');
				// target = jQ('.productsGridHolder');
				// target.css('left', '0%');
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