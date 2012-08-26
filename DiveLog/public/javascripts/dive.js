YUI({
  modules: {
    'dive-rdt': {
      fullpath: './javascripts/rdt.js',
      requires: ['array-extras']
    }
  }
}).use('event-focus', 'json', 'model', 'model-list', 'view', 'dive-rdt', function(Y){
  "use strict";
  var DiveAppView, DiveView, DiveModel, DiveList;


  DiveModel = Y.DiveModel = Y.Base.create('diveModel' , Y.Model, [], {
    //This tell the Model to use a localeStorage sync provider to save and load information about a dive
    sync: localStorageSync('dive')
  },
  {
    ATTRS: {
      depth: {value: 0},
      duration: {value: 0},
      rest: {value: 0},
      previousGroup: {value: Y.dive.FIRST_DIVE }, 
      group: {value: 0 }, 
      tempGroup: {value: Y.dive.FIRST_DIVE}, //group after dive, before SIT
      newGroup: {value: Y.dive.FIRST_DIVE }, //group after dive and SIT
      safetyStop: {value: false}
    }
  }
  );

  DiveList = Y.DiveList = Y.Base.create('diveList', Y.ModelList, [], {
    model: DiveModel,

    //This tell the Model to use a localeStorage sync provider to save and load information about a dive
    sync: localStorageSync('dive'),

    //This function will iterate on all dive and calculate residual nitrogen, and if safety step is necessary
    calculateGroups: function calculateGroups(){
      this.each(function(dive, index, diveList){
        var depth = dive.get('depth'),
        restTime = Y.dive.timeToMinutes(dive.get('rest')),
        group, duration, tempGroup, newGroup;

        if (index === 0) {
          group = Y.dive.FIRST_DIVE;
        } else {
          group = this.item(index - 1 ).get('newGroup');
        }

        duration = Y.dive.timeToMinutes(dive.get('duration')) + Y.dive.getResidualDivingTime(group, depth );
        tempGroup = Y.dive.getEndOfDiveGroup(depth, duration);
        newGroup = Y.dive.getAfterSITGroup(tempGroup, restTime);
        dive.set('group', group); 
        dive.set('tempGroup', tempGroup); 
        dive.set('newGroup', newGroup); 
        dive.save();
      }, this);
    }

  });

  DiveAppView = Y.DiveAppView = Y.Base.create('diveAppView', Y.View, [], {

    // This is where we attach DOM events for the view. The `events` object is a
    // mapping of selectors to an object containing one or more events to attach
    // to the node(s) matching each selector.
    events: {
      // Handle click on the new dive button.
      '#add-dive': {click: 'createDive'}
    },

    // The `template` property is a convenience property for holding a
    // template for this view. In this case, we'll use it to store the
    // contents of the #dive-stats-template element, which will serve as the
    // template for the statistics displayed at the bottom of the list.
    template: Y.one('#dive-stats-template').getHTML(),

    // The initializer runs when a DiveAppView instance is created, and gives
    // us an opportunity to set up the view.
    initializer: function () {
      // Create a new TodoList instance to hold the Dive items.
      var list = this.diveList = new DiveList();

      // Update the display when a new item is added to the list, or when the
      // entire list is reset.
      list.after('add', this.add, this);
      list.after('remove', this.removeDive, this);
      list.after('reset', this.reset, this);

      // Re-render the stats in the footer whenever an item is added, removed
      // or changed, or when the entire list is reset.
      list.after(['add', 'reset', 'remove'],
      this.render, this);

      // Load saved items from localStorage, if available.
      list.load();
    },

    // The render function is called whenever a dive item is added, removed, or
    // changed, thanks to the list event handler we attached in the initializer
    // above.
    render: function () {
      var diveList = this.diveList,
      numDives = 0,
      stats    = this.get('container').one('#dive-stats');

      // If there are no todo items, then clear the stats.
      if (diveList.isEmpty()) {
        stats.empty();
        return this;
      }

      // Figure out how many there is.
      numDives = diveList.size();

      // Update the statistics.
      stats.setHTML(Y.Lang.sub(this.template, {
        numDives: numDives
      }));

      return this;
    },

    // -- Event Handlers -------------------------------------------------------

    // Creates a new DiveView instance and renders it into the list whenever a
    // dive item is added to the list.
    add: function (e) {
      this.diveList.calculateGroups();
      var view = new DiveView({model: e.model});

      this.get('container').one('#dive-list').append(
        view.render().get('container')
      );
    },

    //remove the dive caclculte groups
    removeDive: function(e) {
      this.diveList.calculateGroups();
    },


    // Creates a new Dive item when the new dive button is clicked in the new dive
    // input field.
    createDive: function (e) {
      var depthNode, durationNode, restNode, depth, duration, rest;

      depthNode =  this.get('container').one('#new-depth');
      durationNode =  this.get('container').one('#new-duration');
      restNode =  this.get('container').one('#new-rest');

      depth = depthNode.get('value');
      duration = durationNode.get('value');
      rest = restNode.get('value');

      if (!depth || !duration ||!rest) { return; }

      // This tells the list to create a new DiveModel instance with the
      // specified depth, duration and rest and automatically save it to localStorage in a
      // single step.
      this.diveList.create({
        depth: depth,
        duration: duration,
        rest: rest
      });

      depthNode.set('value', '');
      durationNode.set('value', '');
      restNode.set('value', '');
    },

    // Creates and renders views for every dive item in the list when the entire
    // list is reset.
    reset: function (e) {
      var fragment = Y.one(Y.config.doc.createDocumentFragment());

      this.diveList.calculateGroups();

      Y.Array.each(e.models, function (model) {
        var view = new DiveView({model: model});
        fragment.append(view.render().get('container'));
      });

      this.get('container').one('#dive-list').setHTML(fragment);
    }
  }, {
    ATTRS: {
      // The container node is the wrapper for this view. All the view's
      // events will be delegated from the container. In this case, the
      // #dive-app node already exists on the page, so we don't need to create
      // it.
      container: {
        valueFn: function () {
          return '#divelog-app';
        }
      },

      // This is a custom attribute that we'll use to hold a reference to the
      // "new dive" button.
      inputNode: {
        valueFn: function () {
          return Y.one('#add-dive');
        }
      }
    }
  });


  DiveView = Y.DiveView = Y.Base.create('diveView', Y.View, [], {
    // This customizes the HTML used for this view's container node.
    containerTemplate: '<li class="dive-item"/>',

    // Delegated DOM events to handle this view's interactions.
    events: {

      // When the text of this todo item is clicked or focused, switch to edit
      // mode to allow editing.
      '.dive-content': {
        click: 'edit',
        focus: 'edit'
      },

      // On the edit field, when enter is pressed or the field loses focus,
      // save the current value and switch out of edit mode.
      '.dive-input'   : {
        blur    : 'save',
        keypress: 'enter'
      },

      // When the remove icon is clicked, delete this todo item.
      '.dive-remove': {click: 'remove'}
    },

    // The template property holds the contents of the #todo-item-template
    // element, which will be used as the HTML template for each todo item.
    template: Y.one('#dive-item-template').getContent(),

    initializer: function () {
      // The model property is set to a TodoModel instance by TodoAppView when
      // it instantiates this DiveView.
      var model = this.get('model');

      // Re-render this view when the model changes, and destroy this view
      // when the model is destroyed.
      model.after('change', this.render, this);

      model.after('destroy', function () {
        this.destroy({remove: true});
      }, this);
    },

    render: function () {
      var container = this.get('container'),
      model     = this.get('model'),
      group     = model.get('group'),
      tempGroup  = model.get('tempGroup'),
      newGroup  = model.get('newGroup'),
      done      = model.get('done');

      container.setContent(Y.Lang.sub(this.template, {
        depth   : model.getAsHTML('depth'),
        duration   : model.getAsHTML('duration'),
        rest   : model.getAsHTML('rest'),
        group   : model.getAsHTML('group'),
        tempGroup   : model.getAsHTML('tempGroup'),
        newGroup   : model.getAsHTML('newGroup')
      }));

      if (group === Y.dive.DIVE_NOT_RECOMMANDED || 
        tempGroup === Y.dive.DIVE_NOT_RECOMMANDED ||
      newGroup === Y.dive.DIVE_NOT_RECOMMANDED) {
        container.addClass('danger');
      } else {
        container.removeClass('danger');
      }

      this.set('inputNode', container.one('.dive-input'));

      return this;
    },

    // -- Event Handlers -------------------------------------------------------

    // Toggles this item into edit mode.
    edit: function () {
      this.get('container').addClass('editing');
      this.get('inputNode').focus();
    },

    // When the enter key is pressed, focus the new todo input field. This
    // causes a blur event on the current edit field, which calls the save()
    // handler below.
    enter: function (e) {
      if (e.keyCode === 13) { // enter key
        Y.one('#new-dive').focus();
      }
    },

    // Removes this item from the list.
    remove: function (e) {
      e.preventDefault();

      this.constructor.superclass.remove.call(this);
      this.get('model').destroy({'delete': true});
    },

    // Toggles this item out of edit mode and saves it.
    save: function () {
      //TODO
    }

  });

  function localStorageSync(key) {
    var localStorage,
    data;

    if (!key) {
      Y.error('No storage key specified.');
    }

    if (Y.config.win.localStorage) {
      localStorage = Y.config.win.localStorage;
    }

    // Try to retrieve existing data from localStorage, if there is any.
    // Otherwise, initialize `data` to an empty object.
    data  = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    // Delete a model with the specified id.
    function destroy(id) {
      var modelHash;

      if ((modelHash = data[id])) {
        delete data[id];
        save();
      }

      return modelHash;
    }

    // Generate a unique id to assign to a newly-created model.
    function generateId() {
      var id = '',
      i  = 4;

      while (i--) {
        id += (((1 + Math.random()) * 0x10000) | 0)
        .toString(16).substring(1);
      }

      return id;
    }

    // Loads a model with the specified id. This method is a little tricky,
    // since it handles loading for both individual models and for an entire
    // model list.
    //
    // If an id is specified, then it loads a single model. If no id is
    // specified then it loads an array of all models. This allows the same sync
    // layer to be used for both the TodoModel and TodoList classes.
    function get(id) {
      return id ? data[id] : Y.Object.values(data);
    }

    // Saves the entire `data` object to localStorage.
    function save() {
      localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
    }

    // Sets the id attribute of the specified model (generating a new id if
// necessary), then saves it to localStorage.
      function set(model) {
        var hash        = model.toJSON(),
        idAttribute = model.idAttribute;

        if (!Y.Lang.isValue(hash[idAttribute])) {
          hash[idAttribute] = generateId();
        }

        data[hash[idAttribute]] = hash;
        save();

        return hash;
      }

      // Returns a `sync()` function that can be used with either a Model or a
      // ModelList instance.
      return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached.
        var isModel = Y.Model && this instanceof Y.Model;

        switch (action) {
          case 'create': // intentional fallthru
          case 'update':
            callback(null, set(this));
            return;

          case 'read':
            callback(null, get(isModel && this.get('id')));
            return;

          case 'delete':
            callback(null, destroy(isModel && this.get('id')));
            return;
        }
      };
  }

  new DiveAppView();
});
