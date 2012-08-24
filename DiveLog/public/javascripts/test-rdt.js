YUI({
  filter: 'DEBUG',
  modules: {
    'dive-rdt': {
      fullpath: './javascripts/rdt.js',
      requires: ['array-extras']
    }
  }
}).use('test-console', 'dive-rdt', function (Y) {
  "use strict";

  var timeConversionTest =  new Y.Test.Case({
    name: 'timeToMinutes test',
    'an hh:mm should become mm (2:12 -> 132)': function(){
      var inputTime = '2:12',
      expectedResult = 132,
      result = Y.dive.timeToMinutes(inputTime);

      Y.Assert.areEqual(expectedResult, result);

    },

    'an mm should stay mm (122 -> 122': function(){
      var inputTime = '122',
      result = Y.dive.timeToMinutes(inputTime);

      Y.Assert.areEqual(inputTime, result);
    },

    'an incorrect time hh:mm:ss should fail': function() {

      var inputTime = '12:22:22';
      //result = Y.dive.timeToMinutes(inputTime);

      Y.Assert.throwsError( 'dive.timeToMinutes accepts only hh:mm or mm time',  
        function() {
          Y.dive.timeToMinutes(inputTime);
        }
      );

    }
  }),
  getEndOfDiveGroup = new Y.Test.Case({
    name: 'getEndOfDiveGroup test',
    '25m during 17min should give back F': function(){
    var duration = 17,
    depth = 25,
    expectedGroup = 'F',
    eodGroup;

    eodGroup = Y.dive.getEndOfDiveGroup(depth, duration);

    Y.Assert.areEqual(expectedGroup, eodGroup);
    },
    '12m during 151min is not allowed': function(){
    
    var duration = 151,
    depth = 12,
    expectedGroup = Y.dive.DIVE_NOT_RECOMMANDED,
    eodGroup;

    eodGroup = Y.dive.getEndOfDiveGroup(depth, duration);

    Y.Assert.areEqual(expectedGroup, eodGroup);
    }
  }),
  rntTestSuite = new Y.Test.Suite('Y.dive Test');

  rntTestSuite.add(timeConversionTest);
  rntTestSuite.add(getEndOfDiveGroup);

  new Y.Test.Console().render();
  Y.Test.Runner.add(rntTestSuite);
  Y.Test.Runner.run();

});
