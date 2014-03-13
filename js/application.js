knitApp = new Backbone.Marionette.Application();

knitApp.addRegions({
  grid: "#grid",
  form: "#form",
  palette: "#palette",
});

var EventBus = _.clone(Backbone.Events)

// single stitch
Stitch = Backbone.Model.extend({
    defaults: {
        type: "",
    }
});
// collection of stitches
Stitches = Backbone.Collection.extend({
  model: Stitch
});

Views = {};
// single stitch view
Views.GridItem = Backbone.Marionette.ItemView.extend({
    template: "#item-template",
    tagName: 'div',
    className: 'span2',
    events: {'click span2': 'updateStitchType'},

    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
    },

    updateStitchType: function(ev) {
        var $target = $(ev.currentTarget);
        var newType = $newType
        this.model.set('type', newType);
        this.model.save();
    }
});
// grid row view
Views.GridRow = Backbone.Marionette.CompositeView.extend({
    template: "#row-template",
    itemView: Views.GridItem,
    itemViewContainer: "div.row-fluid",
    initialize: function() {
        this.collection = new Backbone.Collection(_.toArray(this.model.attributes));
    }
});
// whole grid view
Views.Grid = Backbone.Marionette.CompositeView.extend({
    template: "#grid-template",
    itemView: Views.GridRow,
    itemViewContainer: "section",
    numberOfStitches: 24,
    events: {
        'click button': 'updateGrid',
    },
    initialize: function() {
        var number = this.numberOfStitches;
        var grid = this.collection.groupBy(function(list, iterator) {
            return Math.floor(iterator / number); // 4 == number of columns
        });
        this.collection = new Backbone.Collection(_.toArray(grid));
    },

    updateGrid: function(ev) {
        ev.preventDefault(); 
        var $numberOfStitchesInput = $('#number');
        this.gridView.numberOfStitches = ($numberOfStitchesInput.val());
        $numberOfStitchesInput.val("");
    }
});
// view for palette
Views.PaletteView = Backbone.Marionette.ItemView.extend({
    template: "#palette-template",
    className: 'palette',
    events: {'click li': 'saveValue'},

    saveValue: function(ev) {
        ev.preventDefault();
        var $target = $(ev.currentTarget);
        var $newType = $target.html();
        console.log("test save " + $newType);
    }
});

// trigger an event on grid view that updates numberOfStitches
// function: set number of stitches

Views.FormView = Backbone.Marionette.ItemView.extend({
    template: "#grid-template",
    className: 'form'
});

knitApp.addInitializer(function(options){
    var paletteView = new Views.PaletteView({});
    var formView = new Views.FormView({});
    var gridView = new Views.Grid({ 
        collection: options.stitches
    });
    knitApp.palette.show(paletteView);
    knitApp.form.show(formView);
    knitApp.grid.show(gridView);
});

// I can add a method to gridview that updates the numberOfStitches (set gridView first) / flashView

$(document).ready(function(){
      var stitches = new Stitches([
        {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, 
        {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}
      ]);
 
  knitApp.start({stitches: stitches});
});














