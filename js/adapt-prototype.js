define([
	"coreJS/adapt"
], function(Adapt) {

	var EditView = Backbone.View.extend({
		$currentComponentContainer: null,
		currentComponentID: null,
		events: {
			"click": "onEditClicked"
		},
		initialize: function() {
			$("body").append(this.el);
		},
		onEditClicked: function(event) {
			event.preventDefault();
			this.openEditWindow();
		},
		onResize: function() {
			if (!this.$currentComponentContainer) return;

			var offset = this.$currentComponentContainer.offset();
			var width = this.$currentComponentContainer.width();

			var offsetWidth = this.$el.width();

			editView.$el.css({
				top: offset['top']+"px",
				left: (offset['left']+width-offsetWidth)+"px",
				display: "block"
			}).html("Edit " + this.currentComponentID)
		},
		openEditWindow: function() {
			var prototypeWindow = window.open("prototype/index.html", "_blank");
			prototypeWindow.Adapt = Adapt;
			prototypeWindow.data = {
				view: start.findViewById(this.currentComponentID)
			};
			prototypeWindow.parentWindow = window;
		}
	});
	
	

	var StartView = Backbone.View.extend({
		views: [],
		events: {
			"mouseover .prototype-component": "onComponentFocus",
			"focus .prototype-component": "onComponentFocus"
		},
		initialize: function() {
			this.setupEventListeners();
		},
		setupEventListeners: function() {
			this.listenTo(Adapt, "componentView:preRender", this.onComponentPreRender);
			this.listenTo(Adapt, "remove", this.onRemove);
		},
		onComponentPreRender: function(view) {
			this.views.push(view);
			var id = view.model.get("_id");
			view.$el.addClass("prototype-component").attr("data-prototype-id", id);
		},
		onComponentFocus: function(event) {
			var $componentContainer = $(event.currentTarget);
			var id = $componentContainer.attr("data-prototype-id");
			editView.currentComponentID = id;
			editView.$currentComponentContainer = $componentContainer;
			editView.onResize();
		},
		onRemove: function() {
			this.views = [];
			editView.$el.css("display","");
		},
		findViewById: function(id) {
			for (var i = 0, l = this.views.length; i < l; i++) {
				if (this.views[i].model.get("_id") == id) {
					return this.views[i];
				}
			}
			return undefined;
		}
	});

	var start;
	var editView;

	Adapt.once("app:dataReady", function() {

		start = new StartView({ el: document.getElementsByTagName("body")[0] });
		editView = new EditView({ el: $(Handlebars.templates['prototype-edit']({}))[0] })
	});

});