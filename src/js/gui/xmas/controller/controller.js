var gui = gui || {};
gui.xmas = gui.xmas || {};

(function()
{
    gui.xmas.Controller = function()
    {
    };
	gui.xmas.Controller.prototype = {
		editData: function(data){

			var giftData = {};
			var filteredData = data.sheets["Form responses 1"];
			giftData.filterContainers = gui.xmas.controller.createFilters(filteredData);
			giftData.gifts = _.map(filteredData,function(d){
				return {
					bigPicUrl: d.whatisthemainpicturefilecalled,
					buyUrl: d.wherecanpeoplebuythegift,
					cost: d.whatdoesthegiftcost,
					description: d.describethegift,
					filters: 0,
					id: d.rowNumber,
					name: d.whatisthenameofthegift,
					thumbnailPicUrl: d.whatisthethumbnailimagecalled,
					filters: {
						whatkindofgift: d.whatkindofgiftisit.split(', '),
						whoisthegiftfor: d.whoisthegiftfor.split(', '),
						whatpricerange: d.whatpricerangedoesthegiftfallinto.split(', ')
					}
						
				}
			})
			loaderState.finishedLoadingJSON();
			giftData.gifts = _.sortBy(giftData.gifts,function(i){
				return i.description;
			})
			gui.xmas.model.parseJSONData(giftData);

		},

		createFilters:function(data){
			var filterObject = [];
			var filterQuestions = ["whoisthegiftfor","whatpricerangedoesthegiftfallinto","whatkindofgiftisit"];
			for(var i=0;i<filterQuestions.length;i++){
				var filterOptions = _.map(data,function(d){
					return d[filterQuestions[i]].split(', ')
				})
				filterOptions = _.uniq(_.flatten(filterOptions));
				filterObject[i] = {
					filters: filterOptions,
					title: filterQuestions[i]
				}
			}
			return filterObject;
		},

		handleResponse: function(data) {
			// loaderState.finishedLoadingJSON();
			console.log(data);
			// gui.xmas.model.parseJSONData(data);
		},
	
		loadJSONlistener: function(event) {
			switch(event)
			{
				case gui.xmas.stateStrings.START_LOADING_JSON:
					gui.xmas.view.initView.changeLoadingText(" Loading gifts");
					// jQ.ajax({
					// 	dataType: 'json',
					// 	url: 'http://interactive.guim.co.uk/spreadsheetdata/1fbUH49dHj5mA45TWa71SSP-plEe_Z6hZzfLAV-wl-v4.json',
					// 	success: gui.xmas.controller.editData
					// });
					jQ.ajax({
						dataType: 'json',
						url: 'data/newgifts.json',
						success: gui.xmas.controller.editData
					})
					
				break;
				case gui.xmas.stateStrings.LOADER_REMOVED:
					displayState.displayFilterStart();
					loaderState.removeSubscriber(gui.xmas.controller.loadJSONlistener);
				break;
			}
		},
		
		thumbnailLoadListener: function(event) {
			switch(event) {
				case gui.xmas.stateStrings.START_THUMBNAIL_IMAGE_LOAD:
					//gui.xmas.controller.loadThumbnail(0);
				break;
			}
		}
			
	}
	
}());