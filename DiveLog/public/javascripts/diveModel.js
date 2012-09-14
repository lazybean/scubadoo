YUI.add('dive-model', function (Y) {
  "use strict";
  var dive = Y.namespace('dive');
  dive.DiveModel = Y.Base.create('diveModel' , Y.Model, [], {
    //This tell the Model to use a localeStorage sync provider to save and load information about a dive
    sync: Y.dive.utils.localStorageSync('dive')
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

  /**
  * The list of the dives done
  * @class DiveList 
  *
  */
  dive.DiveList = Y.Base.create('diveList', Y.ModelList, [], {
    model: Y.dive.DiveModel,

    //This tell the Model to use a localeStorage sync provider to save and load information about a dive
    sync: Y.dive.utils.localStorageSync('dive'),

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

}, '0.0.1', {requires:['dive-utils', 'model', 'model-list', 'dive-rdt']} );
