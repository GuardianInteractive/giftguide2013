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
			var categoriesAndFilters = gui.xmas.model.getCategoryGroupsAndTitles();
			var a;

			gui.xmas.view.filterPanel.activeFilters = {
				whatkindofgift: undefined,
				whoisthegiftfor: undefined,
				whatpricerange: undefined
			};

			for (a = 0; a < categoriesAndFilters.length; a++) {
				var $currentFilter = $('#filterList_' + a);
				var b, filtersLength = categoriesAndFilters[a].filters.length;
				for (b = 0; b < filtersLength; b++) {
					var filterBox = document.createElement('option');
					filterBox.id = categoriesAndFilters[a].filters[b];
					filterBox.value = categoriesAndFilters[a].filters[b];
					filterBox.innerHTML = categoriesAndFilters[a].filters[b]
					$currentFilter.append(filterBox);
				}
				
				jQ($currentFilter).change(function() {
					var value = jQ(this).val();
					var currentSelect = jQ(this).attr('data-filter');
					var listArr = jQ(this).attr("id").split("_");
					var listIndex = Number(listArr[1]);
					// gui.xmas.model.removeSelectiveFilters(listIndex);
					
					// if (value.substring(0, 3) != "Any") {
					// 	if (!gui.xmas.model.isFilterActive(value)) {
					// 		gui.xmas.model.addFilter(value);
					// 	}
					// }
					if (value.substring(0, 3) != "Any") {
						gui.xmas.view.filterPanel.activeFilters[currentSelect] = value;
					}else{
						gui.xmas.view.filterPanel.activeFilters[currentSelect] = undefined;
					}
					console.log(gui.xmas.view.filterPanel.filterGifts());
					gui.xmas.model.addFilter();
					// } else {
					// 	for (var i = 1; i < categoriesAndFilters[listIndex].filters.length; i++) {
					// 		if (!gui.xmas.model.isFilterActive(categoriesAndFilters[listIndex].filters[i])) {
					// 			gui.xmas.model.addFilter(categoriesAndFilters[listIndex].filters[i]);
					// 			jQ(this).css('backgroundColor', '#fb9107');
					// 		}
					// 	}
					// }
					// gui.xmas.view.productsGridView.scrollUpUpdate();
				});	
			}
		},
		filterGifts:function(){
			var activeFilters = gui.xmas.view.filterPanel.activeFilters;
			var filterObject = {};
			var gifts = gui.xmas.model.jsonData.gifts;
			var filteredGifts = [];
			var firstLoop = true;
			for(var key in activeFilters){
				if(activeFilters[key]){
					filteredGifts = _.filter(gifts,function(gift){
						return gift.filters[key].indexOf(activeFilters[key]) > -1
					})
					gifts = filteredGifts;	

				}
			}
			return gifts;
		}
		
	}

}());