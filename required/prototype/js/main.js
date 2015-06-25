$(function(){ 
  // This is the starting value for the editor
      // We will use this to seed the initial editor 
      // and to provide a "Restore to Default" button.
      var starting_value = data.view.model.toJSON();

      var componentName =  data.view.model.get("_component");
      var componentId =  data.view.model.get("_id");
      var schemaName = "text";

      if (schemas[componentName]) schemaName = componentName;
      
      // Initialize the editor
      var editor = new JSONEditor(document.getElementById('editor_holder'),{
        // Enable fetching schemas via ajax
        ajax: true,
        
        // The schema for the editor
        schema: {
          "$ref": "schemas/" + schemaName + ".json"
        },
        
        // Seed the form with a starting value
        startval: starting_value,

        // Disable additional properties
        no_additional_properties: true,
        
        // Require all properties by default
        required_by_default: true
      });
      
      // Hook up the submit button to log to the console
      document.getElementById('update').addEventListener('click',function() {
        // Get the value from the editor
        
        var updated = editor.getValue();

        for (var k in updated) {
          data.view.model.set(k, updated[k]);
        }

        parentWindow.Backbone.history.navigate(parentWindow.location.hash, {trigger: true, replace: true});
        Adapt.once("pageView:ready", function(){
          Adapt.scrollTo("."+componentId);

          parentWindow.$("."+componentId).velocity("stop", true).css({
            "background-color": "#ffff00"
          }).velocity({
            "backgroundColor": "#ffffff"
          }, {duration: 2000 });
        });

        

        window.close();

      });
      
      // Hook up the validation indicator to update its 
      // status whenever the editor changes
      editor.on('change',function() {
        // Get an array of errors from the validator
        var errors = editor.validate();
        
        var indicator = document.getElementById('valid_indicator');
        
        // Not valid
        if(errors.length) {
          indicator.className = 'label alert';
          indicator.textContent = 'not valid';
        }
        // Valid
        else {
          indicator.className = 'label success';
          indicator.textContent = 'valid';
        }
      });
});
