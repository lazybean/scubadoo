YUI.add('dive-rdt', function(Y){
  /**
  * Module containing funtion to calculate residual nitrogen
  *
  * @module dive-rdt
  * @namespace dive
  *
  *
  */

  "use strict";
  var dive = Y.namespace('dive');
  Y.namespace('dive.table');

  dive.DIVE_NOT_RECOMMANDED = 'Avoid diving';
  dive.FIRST_DIVE = 'First dive';  
  dive.TOO_MUCH_RDT = 1440;  
  dive.RDT_FIRST_DIVE = 0; 
  dive.ONE_DAY = 1440; 

  /**
  * NAUI dive table. 
  * eod stands for End of Dive  Letter group: it gives you the residual nitrogen letter group after a dive
  * sit stands for Surface Interval Time: it gives you your new residual nigrogen letter group after resting on the surface
  * rdt stands for Repetitive Dive Timetable: it translate your residual nitrogen in dive time you will add to dive duration of your next dive.
  * @public
  * @property nauiTable
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
      },

      33:{ 
        5:{letter:'C'},
        10:{letter:'D'},
        13:{letter:'E'},
        15:{letter:'F'},
        20:{letter:'G', decompression: 5},
        30:{letter:'J', decompression: 7}
      },

      36:{ 
        5:{letter:'C'},
        10:{letter:'D'},
        12:{letter:'E'},
        15:{letter:'F', decompression: 5},
        25:{letter:'H', decompression: 6},
        40:{letter:'K', decompression: 14}
      },
      40:{ 
        5:{letter:'C'},
        8:{letter:'D'},
        10:{letter:'E', decompression: 5},
        40:{letter:'J', decompression: 10}
      }
    },
    "sit":{
      A: {
        '1441': Y.dive.FIRST_DIVE,
        '10': 'A',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      B: {
        '1441': Y.dive.FIRST_DIVE,
        '201': 'A',
        '10': 'B',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      C: {
        '1441': Y.dive.FIRST_DIVE,
        '290': 'A',
        '100': 'B',
        '10': 'C',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },
      D: {
        '1441': Y.dive.FIRST_DIVE,
        '349': 'A',
        '159': 'B',
        '70': 'C',
        '10': 'D',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },
      E: {
        '1441': Y.dive.FIRST_DIVE,
        '395': 'A',
        '205': 'B',
        '118': 'C',
        '55': 'D',
        '10': 'E',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },
      F: {
        '1441': Y.dive.FIRST_DIVE,
        '426': 'A',
        '138': 'B',
        '149': 'C',
        '90': 'D',
        '46': 'E',
        '10': 'F',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },
      G: {
        '1441': Y.dive.FIRST_DIVE,
        '456': 'A',
        '256': 'B',
        '179': 'C',
        '120': 'D',
        '76': 'E',
        '41': 'F',
        '10': 'G',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      H:{
        '1441': Y.dive.FIRST_DIVE,
        '560': 'A',
        '290': 'B',
        '201': 'C',
        '144': 'D',
        '102': 'E',
        '67': 'F',
        '37': 'G',
        '10': 'H',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      I:{
        '1441': Y.dive.FIRST_DIVE,
        '582': 'A',
        '313': 'B',
        '224': 'C',
        '165': 'D',
        '123': 'E',
        '90': 'F',
        '60': 'G',
        '34': 'H',
        '10': 'I',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      J:{
        '1441': Y.dive.FIRST_DIVE,
        '531': 'A',
        '341': 'B',
        '243': 'C',
        '185': 'D',
        '141': 'E',
        '108': 'F',
        '80': 'G',
        '55': 'H',
        '32': 'I',
        '10': 'J',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      K:{
        '1441': Y.dive.FIRST_DIVE,
        '539': 'A',
        '349': 'B',
        '260': 'C',
        '202': 'D',
        '159': 'E',
        '124': 'F',
        '96': 'G',
        '72': 'H',
        '50': 'I',
        '29': 'J',
        '10': 'K',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      },

      L:{
        '1441': Y.dive.FIRST_DIVE,
        '553': 'A',
        '363': 'B',
        '276': 'C',
        '217': 'D',
        '294': 'E',
        '240': 'F',
        '140': 'G',
        '86': 'H',
        '65': 'I',
        '46': 'J',
        '27': 'K',
        '10': 'L',
        '00': Y.dive.DIVE_NOT_RECOMMANDED
      }

    },
    "rdt":{
      A:{
        "12": 7,
        "15": 6,
        "18": 5,
        "21": 4,
        "24": 4,
        "27": 3,
        "30": 3,
        "33": 3,
        "36": 3,
        "40": 3
      },
      B:{
        "12": 17,
        "15": 13,
        "18": 11,
        "21": 9,
        "24": 8,
        "27": 7,
        "30": 7,
        "33": 6,
        "36": 6,
        "40": 6
      },
      C:{
        "12": 25,
        "15": 21,
        "18": 17,
        "21": 15,
        "24": 13,
        "27": 11,
        "30": 10,
        "33": 10,
        "36": 9,
        "40": 8
      },
      D:{
        "12": 37,
        "15": 29,
        "18": 24,
        "21": 20,
        "24": 18,
        "27": 16,
        "30": 14,
        "33": 13,
        "36": 12,
        "40": 11
      },
      E:{
        "12": 49,
        "15": 38,
        "18": 30,
        "21": 26,
        "24": 23,
        "27": 20,
        "30": 18,
        "33": 16,
        "36": 15,
        "40": 13
      },
      F:{
        "12": 61,
        "15": 47,
        "18": 36,
        "21": 31,
        "24": 28,
        "27": 24,
        "30": 22,
        "33": 20,
        "36": 18,
        "40": 16
      },
      G:{
        "12": 73,
        "15": 56,
        "18": 44,
        "21": 37,
        "24": 32,
        "27": 29,
        "30": 26,
        "33": 24,
        "36": 21,
        "40": 19
      },
      H:{
        "12": 87,
        "15": 66,
        "18": 52,
        "21": 43,
        "24": 38,
        "27": 33,
        "30": 30,
        "33": 27,
        "36": 25,
        "40": 22
      },
      I:{
        "12": 101,
        "15": 76,
        "18": 61,
        "21": 50,
        "24": 43,
        "27": 38,
        "30": 34,
        "33": 31,
        "36": 28,
        "40": 25
      },
      J:{
        "12": 116,
        "15": 87,
        "18": 70,
        "21": 57,
        "24": 48,
        "27": 43,
        "30": 38
      },
      K:{
        "12": 138,
        "15": 99,
        "18": 79,
        "21": 64,
        "24": 54,
        "27": 47
      },
      L:{
        "12": 161,
        "15": 111,
        "18": 88,
        "21": 72,
        "24": 61,
        "27": 53
      }

    }
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
      var subTable = dive.table.nauiTable.sit[oldGroup]; 

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
    var timeRe =  /^\d+(:\d+){0,2}?$/,
    minutes, hourAndMinutes;
    if ( timeRe.test(timeString) ) {
      hourAndMinutes = timeString.split(':');

      if (hourAndMinutes.length === 1) {
        //minutes only
        minutes =  parseInt(hourAndMinutes[0], 10);
      } else {
        //hour and minutes
        minutes = parseInt(hourAndMinutes[1], 10) + 60 * parseInt(hourAndMinutes[0], 10);

        //if we have secondes, we rounded it to one more minute (safety)
        if (hourAndMinutes.length === 3) {
          minutes += 1 ;
        }
      }
    } else {
      minutes = null;
      Y.error('dive.timeToMinutes accepts only hh:mm:ss, hh:mm or mm time');
    }
    return minutes;
  };

  /**
  * Return the new Group after a dive.
  *
  * @method getEndOfDiveGroup
  * @param {number} depth the maximum depth reached during the dive
  * @param {number} the duration of the dive in minutes 
  */
  dive.getEndOfDiveGroup = function (depth, duration) {
    var table = dive.table.nauiTable.eod,
    depthKey, durationKey, newGroup;
    //get depth data
    depthKey = dive.getClosestLesserKey(depth, table);
    if (Y.Lang.isNull(depthKey)){
      newGroup = Y.dive.DIVE_NOT_RECOMMANDED;
    } else { 
      durationKey = dive.getClosestLesserKey(duration, table[depthKey]);
      if (Y.Lang.isNull(durationKey)){
        newGroup = Y.dive.DIVE_NOT_RECOMMANDED;
      } else {
        newGroup = table[depthKey][durationKey].letter;
      }
    }
    return newGroup;
  };



  /**
  * Return the new Group after a rest at surface SIT.
  *
  * @method getAfterSITGroup
  * @param {String} group after the dive
  * @param {number} the duration of the rest in  minutes 
  */
  dive.getAfterSITGroup = function (group, duration) {
    var table = dive.table.nauiTable.sit,
    durationKey, newGroup;
    //get depth data
    if (group === Y.dive.FIRST_DIVE) {
      newGroup = Y.dive.FIRST_DIVE;
    } else if (group === Y.dive.DIVE_NOT_RECOMMANDED){
      newGroup = Y.dive.DIVE_NOT_RECOMMANDED;
      if( duration > Y.dive.ONE_DAY) {
        newGroup = Y.dive.FIRST_DIVE;
      }  
    } else {
      durationKey = dive.getClosestGreaterKey(duration, table[group]);
      if (Y.Lang.isNull(durationKey)){
        newGroup = Y.dive.DIVE_NOT_RECOMMANDED;
      } else {
        newGroup = table[group][durationKey];
      }
    }
    return newGroup;
  };

  /**
  * Return the residual diving time according to the current Group and expected depth
  *
  * @method getResidualDivingTime
  * @param {String} group
  * @param {number} depth
  * @return {number} rdt the residual diving time, to add to the next dive duration
  */
  dive.getResidualDivingTime = function (group, depth) {

    var table = dive.table.nauiTable.rdt,
    depthKey,  rdt;
    //get depth data
    if (group === Y.dive.DIVE_NOT_RECOMMANDED){
      rdt = Y.dive.RDT_TOO_MUCH;
    } else  if (group === Y.dive.FIRST_DIVE) {
      rdt = Y.dive.RDT_FIRST_DIVE;
    } else { 
      depthKey = dive.getClosestLesserKey(depth, table[group]);
      if (Y.Lang.isNull(depthKey)){
        rdt = Y.dive.RDT_TOO_MUCH;
      } else {
        rdt  = table[group][depthKey];
      }
    }
    return rdt;
  };

  /**
  * Return the corresponding key 
  * The corresponding key is the key with the value that is greaterthan but the closest
  * 
  * @method getClosestGreaterKey
  * @param {String} searchedkey
  * @param {Object} the object in wich we are looking for the key
  * @return {String} the closest existing key
  *
  */
  dive.getClosestGreaterKey = function (searchedKey, obj) {
    //we may want to avoid sorting and even finding every time
    var keys = Y.Object.keys(obj).sort(Y.Array.numericSort).reverse();
    return Y.Array.find(keys, function (k, i, keys) {
      var result = false;
      if (searchedKey >= parseInt(k, 10)) {
        result = true;
      } 
      return result;
    });
  };

  /**
  * Return the corresponding key 
  * The corresponding key is the key with the value that is less than but the closest
  * 
  * @method getClosestLesserKey
  * @param {String} searchedkey
  * @param {Object} the object in wich we are looking for the key
  * @return {String} the closest existing key
  *
  */
  dive.getClosestLesserKey = function (searchedKey, obj) {
    //we may want to avoid sorting and even finding every time
    var keys = Y.Object.keys(obj).sort(Y.Array.numericSort);
    return Y.Array.find(keys, function (k, i, keys) {
      var result = false;
      if (searchedKey <= parseInt(k, 10)) {
        result = true;
      } 
      return result;
    });
  };


}, '0.0.1', {requires:['array-extras']});
