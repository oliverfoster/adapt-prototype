define([
	"coreJS/adapt"
], function(Adapt) {
	
	

	var StartView = Backbone.View.extend({
		initialize: function() {
			var prototypeWindow = window.open("prototype/index.html", "_blank");
			prototypeWindow.Adapt = Adapt;
		}
	});

	var start = new StartView();

});