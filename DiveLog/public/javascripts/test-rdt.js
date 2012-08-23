YUI({
  filter: 'DEBUG',
  modules: {
    'dive-rdt': {
      fullpath: './javascripts/rdt.js'
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
  rntTestSuite = new Y.Test.Suite('Y.dive Test');

  rntTestSuite.add(timeConversionTest);

  new Y.Test.Console().render();
  Y.Test.Runner.add(rntTestSuite);
  Y.Test.Runner.run();

});
