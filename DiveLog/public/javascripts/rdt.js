YUI.add('dive-rdt', function(Y){
  "use strict";
  var dive = Y.namespace('dive');
  Y.namespace('dive.table');

  /**
  * NAUI dive table. 
  * eod stands for End of Dive  Letter group: it gives you the residual nitrogen letter group after a dive
  * sit stands for Surface Interval Time: it gives you your new residual nigrogen letter group after resting on the surface
  * rdt stands for Repetitive Dive Timetable: it translate your residual nitrogen in dive time you will add to dive duration of your next dive.
  *
  */
  dive.table.nauiTable = {
    "eod":{
      12:{ 
        5:{letter:'A'},
        15:{letter:'B'},
        25:{letter:'C'},
        30:{letter:'D'},
        40:{letter:'E'},
        50:{letter:'F'},
        70:{letter:'G'},
        80:{letter:'H'},
        100:{letter:'I'},
        110:{letter:'J'},
        130:{letter:'K'},
        150:{letter:'L', decompression: 5}
      },
      15:{ 
        10:{letter:'B'},
        15:{letter:'C'},
        25:{letter:'D'},
        30:{letter:'E'},
        40:{letter:'F'},
        50:{letter:'G'},
        60:{letter:'H'},
        70:{letter:'I'},
        80:{letter:'J'},
        100:{letter:'L', decompression: 5}
      },
      18:{ 
        10:{letter:'B'},
        15:{letter:'C'},
        20:{letter:'D'},
        25:{letter:'E'},
        30:{letter:'G'},
        40:{letter:'G'},
        50:{letter:'H'},
        55:{letter:'I'},
        60:{letter:'J', decompression: 5},
        150:{letter:'L', decompression: 7}
      },
      21:{ 
        5:{letter:'B'},
        10:{letter:'C'},
        15:{letter:'D'},
        20:{letter:'E'},
        30:{letter:'G'},
        35:{letter:'G'},
        40:{letter:'H'},
        45:{letter:'I'},
        50:{letter:'J', decompression: 5},
        60:{letter:'K', decompression: 8},
        70:{letter:'L', decompression: 14}
      },
      24:{ 
        5:{letter:'B'},
        10:{letter:'C'},
        15:{letter:'D'},
        20:{letter:'E'},
        25:{letter:'F'},
        30:{letter:'G'},
        35:{letter:'H'},
        40:{letter:'I', decompression: 5},
        50:{letter:'K', decompression: 10},
        60:{letter:'L', decompression: 17}
      },
      27:{ 
        5:{letter:'B'},
        10:{letter:'C'},
        12:{letter:'D'},
        15:{letter:'E'},
        20:{letter:'F'},
        25:{letter:'G'},
        30:{letter:'H', decompression: 5},
        40:{letter:'J', decompression: 7},
        50:{letter:'L', decompression: 18}
      },
      30:{ 
        5:{letter:'B'},
        7:{letter:'C'},
        10:{letter:'D'},
        15:{letter:'E'},
        20:{letter:'F'},
        22:{letter:'G'},
        25:{letter:'H', decompression: 5},
        40:{letter:'K', decompression: 15}
      }

    },
    "sit":{},
    "rdt":{}
  };

  /**
  * Compute the new residual nitrogen group 
  *
  * @method computeResidualGroup
  *
  * @param {number} depth : the maximal depth in meter reached during the dive
  * @param {number} diveTime : the duration in minutes of the dive 
  * @param {number} restTime : the duriation in minutes of the surface rest after the div 
  * @param {string residualNitrogen : the upper case letter conrresponding to the residual nitrogen Group
  *
  */
  dive.computeResidualGroup = function (depth, diveTime, restTime, residualNitrogen) {

  };

  dive.computeNewGroupAfterSIT = function(oldGroup, restTime) {
    if (dive.isGroupValid(oldGroup)){
      var subTable = dive.table.tableNAUI.sit[oldGroup]; 

    } else {
      Y.error('dive.computeNewGroupAfterSIT requires an residual nitrogen Group', 'Missing argument' );
    }

  };


  /**
   *Concert hh:mm  (or mm) string to minutes
   *
   * @method timeToMinutes
   * @param {string} timeString the hh:mm or mm time 
   * @return {number} number of minutes
   */
  dive.timeToMinutes = function(timeString) {
    var timeRe =  /^\d+(:\d+)?$/;
    if ( timeRe.test(timeString) ) {
    var hourAndMinutes = timeString.split(':'),
    minutes;
    if (hourAndMinutes.length === 1) {
      //minutes only
      minutes =  parseInt(hourAndMinutes[0], 10);
    } else {
      //hour and minutes
      minutes = parseInt(hourAndMinutes[1], 10) + 60 * parseInt(hourAndMinutes[0], 10);
    }
    } else {
    minutes = null;
    Y.error('dive.timeToMinutes accepts only hh:mm or mm time');
    }
    return minutes;
  };



}, '0.0.1', {requires:[]});
