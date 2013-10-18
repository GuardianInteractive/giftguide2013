var gui = gui || {};
gui.xmas = gui.xmas || {};
gui.xmas.view = gui.xmas.view || {};

var filterLookup = {};

(function()
{
    gui.xmas.view.FilterPanel = function()
    {
		this.filterDivsArr = [];
	};
	gui.xmas.view.FilterPanel.prototype = {
		init: function(){			
			
			var smallOrNot = '';
			if (width < 940) {
				smallOrNot = 'Small';
			}
			var leftSideHolder = $('.leftSideHolder' + smallOrNot);
			
			var leftsideFilterPanel = document.createElement('div');
			leftsideFilterPanel.className = 'filterPanelLeftSide';
			leftSideHolder.append(leftsideFilterPanel);
			
			var title = document.createElement('h1');
			title.innerHTML = 'Filter your search';
			title.style.cssFloat = 'left';
			leftsideFilterPanel.appendChild(title);
			
			var refreshIcon = document.createElement("img");
			refreshIcon.src = "assets/images/refreshIcon.png";
			refreshIcon.className = 'refreshIcon';
			leftsideFilterPanel.appendChild(refreshIcon);

			if (gui.xmas.model.screenVersion === 'iFrame') {
				$(refreshIcon).mouseover(function() {
					this.src = "assets/images/refreshYellowIcon.png";
					TweenLite.killTweensOf(this);
					TweenLite.fromTo(this, .5, {css:{autoAlpha:.5}}, {css:{autoAlpha:1}});
				});
				$(refreshIcon).mouseout(function() {
					this.src = "assets/images/refreshIcon.png";
				});
			}

			$(refreshIcon).click(function() {
				var a, filterDivsArrLength = gui.xmas.view.filterPanel.filterDivsArr.length;
				for (a = 0; a < filterDivsArrLength; a++) {
					gui.xmas.view.filterPanel.filterDivsArr[a].style.backgroundColor = '#e7d7c0';
				}

				gui.xmas.model.clearAllFilters();
				gui.xmas.view.productsGridView.scrollUpUpdate();
			});
			
			var bodyText = document.createElement('p');
			bodyText.innerHTML = 'Select categories using the filters below to find your perfect gifts.<br/><br/>Create a wishlist by clicking the top right of an image. You can share your list with a friend, or bookmark and return later.';
			leftsideFilterPanel.appendChild(bodyText);
			
			var seperator = document.createElement('div');
			seperator.className = 'filterPanelSeperator';
			leftsideFilterPanel.appendChild(seperator);
			
			var categoriesAndFilters = gui.xmas.model.getCategoryGroupsAndTitles();
			
				var categoryHolder = document.createElement('div');
				categoryHolder.className = 'filterPanelCategoryHolder';
				leftsideFilterPanel.appendChild(categoryHolder);
				
				categoryHolder.style.cssFloat = 'left';
				
			var a;
			for (a = 0; a < categoriesAndFilters.length; a++) {
				
			
				
				var categoryTitle = document.createElement('h2');
				categoryTitle.innerHTML = categoriesAndFilters[a].title;
				categoryHolder.appendChild(categoryTitle);
				
				var categoryClear = document.createElement('div');
				categoryClear.className = 'clearBoth';
				leftsideFilterPanel.appendChild(categoryClear);
				/*
				var filterList = document.createElement('ul');
				leftsideFilterPanel.appendChild(filterList);
				
				var b, filtersLength = categoriesAndFilters[a].filters.length;
				for (b = 0; b < filtersLength; b++) {
					
					var gridLi = document.createElement('li');
					filterList.appendChild(gridLi);
					
					var filterBox = document.createElement('div');
					filterBox.className = 'filterPanalFilterBox';
					filterBox.id = categoriesAndFilters[a].filters[b];
					gridLi.appendChild(filterBox);
					gui.xmas.view.filterPanel.filterDivsArr[gui.xmas.view.filterPanel.filterDivsArr.length] = filterBox;
					
					if (gui.xmas.model.screenVersion === 'iFrame') {
						$(filterBox).mouseover(function() {
							if (!gui.xmas.model.isFilterActive(this.id)) {
								TweenLite.killTweensOf($(this));
								$(this).css('backgroundColor', '#7d4430');
								TweenLite.to($(this), 1, {css:{backgroundColor:"#fb9107"}, ease:Power2.easeOut});
							}
						});

						$(filterBox).mouseout(function() {
							if (!gui.xmas.model.isFilterActive(this.id)) {
								TweenLite.killTweensOf($(this));
								TweenLite.to($(this), 1, {css:{backgroundColor:"#e7d7c0"}, ease:Power2.easeOut});
							}
						});
					}
					
					$(filterBox).click(function() {
						var filterWaiting = $('#filteringWait');
						filterWaiting.css('display', 'block');
						if (!gui.xmas.model.isFilterActive(this.id)) {
							gui.xmas.model.addFilter(this.id);

							$(this).css('backgroundColor', '#fb9107');
						}
						else {
							$(this).css('backgroundColor', '#e7d7c0');
							gui.xmas.model.removeFilter(this.id);
						}
						gui.xmas.view.productsGridView.scrollUpUpdate();
						filterWaiting.css('display', 'none');
					});
					
					var title = document.createElement('h1');
					title.innerHTML = categoriesAndFilters[a].filters[b];
					filterBox.appendChild(title);
					
				}
				*/
				
				var filterList = document.createElement('select');
				categoryHolder.appendChild(filterList);
				filterList.id = "filterList_" + a;
				
				var b, filtersLength = categoriesAndFilters[a].filters.length;
				for (b = 0; b < filtersLength; b++) {
					
					//var gridLi = document.createElement('li');
					//filterList.appendChild(gridLi);
					
					var filterBox = document.createElement('option');
					filterBox.className = 'filterPanalFilterBox';
					filterBox.id = categoriesAndFilters[a].filters[b];
					filterList.appendChild(filterBox);
					gui.xmas.view.filterPanel.filterDivsArr[gui.xmas.view.filterPanel.filterDivsArr.length] = filterBox;
					
					if (gui.xmas.model.screenVersion === 'iFrame') {
						$(filterBox).mouseover(function() {
							if (!gui.xmas.model.isFilterActive(this.id)) {
								//TweenLite.killTweensOf($(this));
								//$(this).css('backgroundColor', '#7d4430');
								//TweenLite.to($(this), 1, {css:{backgroundColor:"#fb9107"}, ease:Power2.easeOut});
							}
						});

						$(filterBox).mouseout(function() {
							if (!gui.xmas.model.isFilterActive(this.id)) {
								//TweenLite.killTweensOf($(this));
								//TweenLite.to($(this), 1, {css:{backgroundColor:"#e7d7c0"}, ease:Power2.easeOut});
							}
						});
					}
					
					$(filterBox).click(function() {
						
						//gui.xmas.model.removeSelectiveFilters(this.id);
						
						var listArr = $(this).parent().attr("id").split("_");
						var listIndex = Number(listArr[1]);
						
						var filterWaiting = $('#filteringWait');
						filterWaiting.css('display', 'block');
						
						gui.xmas.model.removeSelectiveFilters(listIndex);
						
						if (this.id != "Show me all") {
							
							
						
						if (!gui.xmas.model.isFilterActive(this.id)) {
							
							gui.xmas.model.addFilter(this.id);
							//$(this).css('backgroundColor', '#fb9107');
						}
						
						} else {
							
							//for (var i = 1; i < categoriesAndFilters[listIndex].filters.length; i++) {
								
								//if (!gui.xmas.model.isFilterActive(categoriesAndFilters[listIndex].filters[i])) {
							//gui.xmas.model.addFilter(categoriesAndFilters[listIndex].filters[i]);
							//$(this).css('backgroundColor', '#fb9107');
								//}
								
							//}
							
							
						}
						
						console.log(gui.xmas.model.activeFiltersArr);
						//else {
							//$(this).css('backgroundColor', '#e7d7c0');
							//gui.xmas.model.removeFilter(this.id);
						//}
						gui.xmas.view.productsGridView.scrollUpUpdate();
						filterWaiting.css('display', 'none');
					});
					
					var title = document.createElement('h1');
					title.innerHTML = categoriesAndFilters[a].filters[b];
					filterBox.appendChild(title);
					
				}
				
				
				
				
				
				
			}
			/*
			var moreFilters = document.createElement('div');
			moreFilters.className = 'moreFiltersBox';
			leftsideFilterPanel.appendChild(moreFilters);
			
			var moreFiltersTitle = document.createElement('h1');
			moreFiltersTitle.innerHTML = 'More filters';
			moreFilters.appendChild(moreFiltersTitle);
			*/
			
			var clearDiv = document.createElement('div');
			clearDiv.className = 'clearBoth';
			leftsideFilterPanel.appendChild(clearDiv);
			
		}
		
	}

}());