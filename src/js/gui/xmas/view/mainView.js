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
			var el = gui.xmas.el;
			var headerTemplate = jQ('#headerTemplate').html();

			gui.xmas.view.MainView.holder = document.createElement('div');
			var holderDiv = gui.xmas.view.MainView.holder;
			holderDiv.className = 'mainHolder';
			el.appendChild(holderDiv);

			var leftSideHolder = document.createElement('div');
			leftSideHolder.className = 'leftSideHolderSmall';
			holderDiv.appendChild(leftSideHolder);

			leftSideHolder.innerHTML = headerTemplate;
			gui.xmas.view.mainView.animateChristmasLights();
			gui.xmas.view.filterPanel.init();

			var rightSideHolder = document.createElement('div');
			rightSideHolder.className = 'rightSideHolderSmall';
			holderDiv.appendChild(rightSideHolder);

			gui.xmas.view.wishListBox.init();

			var productsPanel = document.createElement('div');
			productsPanel.className = 'productsPanel';
			rightSideHolder.appendChild(productsPanel);

			gui.xmas.view.productsGridView.init();
			gui.xmas.view.singularProductView.init();

		},
		animateChristmasLights:function(){
			function switchLights(i){
				setTimeout(function(){
					var previous = i === 1 ? 4 : i-1;
					$('#christmasLights img.blink_' + previous).addClass('lightsOff');
					$('#christmasLights img.blink_' + i).removeClass('lightsOff');
					if(i<4){
						i++;
						switchLights(i);
					}else if(i===4){
						i=1;
						switchLights(i);
					}
				},800)
			}	
			switchLights(2);
		},
		

		goToSingularView: function() {
            var target = jQ('.singularProductHolder');
            var pageHeight = document.body.clientHeight;
            jQ(target).css('display', 'block');
			if(window.width < 640){
				// jQ('.productsGridHolder').css("display", "none")
                 XDSocket.postMessage(XDSocket.postMessage(JSON.stringify({ scrollTop: true, target: false })));
			}
		},

		goBackToListView:function() {
			var currentProductID = jQ('.singularProductHolder .singularContent h2')[0].innerHTML;
			var currentProductInGrid = jQ(".productsGridHolder").find("[id='" + currentProductID + "']");
			if (gui.xmas.model.isIe) {
				var target = jQ('.singularProductHolder');
				jQ(target).css('display', 'none');
			}
			else {
				var target = jQ('.singularProductHolder');
				target.css('display', 'none');
			}

			if(window.width < 640){
				jQ('.productsGridHolder').css("display", "block");
                 XDSocket.postMessage(XDSocket.postMessage(JSON.stringify({ scrollTop: true, target: currentProductInGrid.offset().top })));
				jQ(window).scrollTop(currentProductInGrid.offset().top);
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
