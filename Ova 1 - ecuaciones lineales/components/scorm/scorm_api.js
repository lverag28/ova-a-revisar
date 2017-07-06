dhbgApp.scorm = {};
dhbgApp.scorm.lms = null;
dhbgApp.scorm.visited = [];
dhbgApp.scorm.currentSco = 0;
dhbgApp.scorm.scoList = [];
dhbgApp.scorm.indexPages = [];
dhbgApp.scorm.activities = [];
dhbgApp.scorm.activitiesValues = [];
dhbgApp.scorm.activitiesCurrent = 0;

//=======================================================================
//SCORM Initialization
//=======================================================================
dhbgApp.scorm.initialization = function () {
    dhbgApp.scorm.change_sco = false;

    try {
        doLMSInitialize();
        dhbgApp.scorm.lms = getAPI();
    }
    catch(e) {
        //alert("El contenido no se encuentra en un LMS. Su avance para este intento no ser� registrado");
    }

    if (!dhbgApp.scorm.lms) {
        //dhbgApp.scorm = null;
        return false;
    }

    dhbgApp.scorm.startSessionTimer();
    
    var suspend_data = "";
    try {
        suspend_data = doLMSGetValue('cmi.suspend_data');
    }
    catch (e) {}

    if (suspend_data && suspend_data != '') {
        var data_scorm = suspend_data.split('#');
        if (data_scorm.length > 0) {
            if(!isNaN(data_scorm[0])) {
                dhbgApp.scorm.currentSco = data_scorm[0];
            }
        }
            
        if (data_scorm.length > 1) {
            var scos = data_scorm[1].split('|');
            
            if (scos) {
                for (var i = 0; i < scos.length; i++) {
                    dhbgApp.scorm.visited[scos[i]] = true;
                }
            }
        }
        
        if (data_scorm.length > 2) {
            var activities = data_scorm[2].split('|');
            if (activities) {
                for (var i = 0; i < activities.length; i++) {
                    var parts = activities[i].split(':');
                    if (parts.length == 2 && parts[1] != '') {
                        dhbgApp.scorm.activities[parts[0]] = parts[1].split(',');
                    }
                }
            }
        }

        if (data_scorm.length > 3) {
            var activities_values = data_scorm[3].split('|');
            if (activities_values) {
                for (var i = 0; i < activities_values.length; i++) {
                    var parts = activities_values[i].split(':');
                    if (parts.length == 2) {
                        dhbgApp.scorm.activitiesValues[parts[0]] = parts[1];
                    }
                }
            }
        }
    }
    
    dhbgApp.scorm.activitiesCurrent = doLMSGetValue('cmi.interactions._count');
    var status = doLMSGetValue('cmi.core.lesson_status');

    if (status == 'incomplete') {
        dhbgApp.scorm.change_sco = true;
    }
    else if (status == 'complete') {
        dhbgApp.scorm.lms = null;
    }
    else {
        doLMSSetValue('cmi.core.lesson_status', 'incomplete');
        doLMSCommit();
    }

    var close_function = function() {

        if (!dhbgApp.scorm.closed) {
            dhbgApp.scorm.saveProgress();
            
            dhbgApp.scorm.recordSessionTime();
            doLMSSetValue('cmi.core.exit',  'suspend');
            doLMSCommit();
            doLMSFinish();
            dhbgApp.scorm.closed = true;
        }   

    };
    
    window.onbeforeunload = close_function;
    window.onunload = close_function;


};
//=======================================================================
//END SCORM Initialization
//=======================================================================

dhbgApp.scorm.saveVisit = function(index) {
    
    dhbgApp.scorm.currentSco = index;

    var sco = dhbgApp.scorm.scoList[index];
    if (!sco.visited) {
        sco.visited = true;
    }

    //dhbgApp.scorm.saveProgress();
};

dhbgApp.scorm.saveProgress = function() {

    if (dhbgApp.scorm.lms != null) {
        var scale_sco = 0;
        var progress = '';
        var max_sco_value = 0;
        var max_activities_value = 0;
        var scale_activities = 0;

        var index;
        for(index in dhbgApp.scorm.scoList) {
            if (dhbgApp.scorm.scoList[index]) {
                var sco = dhbgApp.scorm.scoList[index];
                if (sco.visited) {
                    scale_sco += dhbgApp.scorm.scoList[index].value;
                    progress += index + '|';
                }
                max_sco_value += sco.value;
            }
        }
        
        //Build the activity data
        var data_activity = "";
        var activities_length = 0;
        for (var activity_key in dhbgApp.scorm.activities) {
            if (dhbgApp.scorm.activities[activity_key]) {
                if (typeof dhbgApp.scorm.activities[activity_key] == 'string') {
                    data_activity += activity_key + ":" + dhbgApp.scorm.activities[activity_key] + "|";
                }
                else {
                    data_activity += activity_key + ":" + dhbgApp.scorm.activities[activity_key].join(',') + "|";

                    var intents_value = 0;
                    var intent_val = 0;
                    for(activity_intent in dhbgApp.scorm.activities[activity_key]) {
                        if (!isNaN(dhbgApp.scorm.activities[activity_key][activity_intent])) {
                            intent_val = parseFloat(dhbgApp.scorm.activities[activity_key][activity_intent]);
                            if (intent_val > intents_value) {
                                intents_value = intent_val;
                            }
                        }
                    }

                    scale_activities += intents_value;
                    
                    activities_length++;
                }
            }
        }

        var progress_value;
        if (activities_length > 0) {
            progress_value = Math.round((scale_sco / max_sco_value)*40);
            
            //Activities scale is in percentage
            progress_value += Math.round((scale_activities / activities_length)*0.6);
        }
        else {
            progress_value = Math.round((scale_sco / max_sco_value)*100);
        }

        //Build the activity data
        var activities_values = "";
        for (var activity_val_key in dhbgApp.scorm.activitiesValues) {
            if (dhbgApp.scorm.activitiesValues[activity_val_key] && typeof dhbgApp.scorm.activitiesValues[activity_val_key] == 'string') {
                activities_values += activity_val_key + ":" + dhbgApp.scorm.activitiesValues[activity_val_key] + "|";
            }
        }
        
        doLMSSetValue('cmi.suspend_data', dhbgApp.scorm.currentSco + '#' + progress + '#' + data_activity + '#' + activities_values);
        doLMSSetValue('cmi.core.score.raw', progress_value);
        
        if (progress_value >= 100) {
            doLMSSetValue('cmi.core.lesson_status', 'completed');
        }
        else {
            doLMSSetValue('cmi.core.lesson_status', 'incomplete');
        }
    }
};


dhbgApp.scorm.getProgress = function() {

    var scale_sco = 0;
    var max_sco_value = 0;
    var max_activities_value = 0;
    var scale_activities = 0;

    var index;
    for(index in dhbgApp.scorm.scoList) {
        if (dhbgApp.scorm.scoList[index]) {
            var sco = dhbgApp.scorm.scoList[index];
            if (sco.visited) {
                scale_sco += dhbgApp.scorm.scoList[index].value;
            }
            max_sco_value += sco.value;
        }
    }
    
    var activities_length = 0;
    for (var activity_key in dhbgApp.scorm.activities) {
        if (dhbgApp.scorm.activities[activity_key]) {
            if (typeof dhbgApp.scorm.activities[activity_key] == 'string') {
                //Nothing
            }
            else {

                var intents_value = 0;
                var intent_val = 0;
                for(activity_intent in dhbgApp.scorm.activities[activity_key]) {
                    if (!isNaN(dhbgApp.scorm.activities[activity_key][activity_intent])) {
                        intent_val = parseFloat(dhbgApp.scorm.activities[activity_key][activity_intent]);
                        if (intent_val > intents_value) {
                            intents_value = intent_val;
                        }
                    }
                }

                scale_activities += intents_value;
                
                activities_length++;
            }
        }
    }

    var progress_value;

    if (activities_length > 0) {
        progress_value = Math.round((scale_sco / max_sco_value)*40);
        
        //Activities scale is in percentage
        progress_value += Math.round((scale_activities / activities_length)*0.6);
    }
    else {
        progress_value = Math.round((scale_sco / max_sco_value)*100);
    }

    return progress_value;
};

dhbgApp.scorm.startSessionTimer = function(){
    dhbgApp.scorm.startTime = new Date();
};

dhbgApp.scorm.recordSessionTime = function(){
    // read the current time on the computer clock when the page is opened
    var startTime = dhbgApp.scorm.startTime;
    var startHour = startTime.getHours();
    var startMinutes = startTime.getMinutes();
    var startSeconds = startTime.getSeconds();

    // now get the current date and time on the computer clock
    var nowTime = new Date();
    var nowHour = nowTime.getHours();
    var nowMinutes = nowTime.getMinutes();
    var nowSeconds = nowTime.getSeconds();

    // now calculate the total elapsed time
    var elapsedHours = nowHour - startHour;
    
    if (nowMinutes >= startMinutes) {
        var elapsedMinutes = nowMinutes - startMinutes;
    }
    else {
        var elapsedMinutes = (nowMinutes + 60) - startMinutes;
        elapsedHours--;
    }

    if (nowSeconds >= startSeconds) {
        var elapsedSeconds = nowSeconds - startSeconds;
    }
    else {
        var elapsedSeconds = (nowSeconds + 60) - startSeconds;
        elapsedMinutes--;
    }

    if (elapsedHours < 10) { elapsedHours = "0" + elapsedHours };
    if (elapsedMinutes < 10) { elapsedMinutes = "0" + elapsedMinutes };
    if (elapsedSeconds < 10) { elapsedSeconds = "0" + elapsedSeconds };

    // prepare the CMITimespan string
    var timeSpan = elapsedHours + ":" + elapsedMinutes + ":" + elapsedSeconds;
    doLMSSetValue("cmi.core.session_time", timeSpan);
};

dhbgApp.scorm.activityAttempt = function(activity_key, value, index){
    if (!dhbgApp.scorm.activities[activity_key]) {
        dhbgApp.scorm.activities[activity_key] = [];
    }
    
    var position = dhbgApp.scorm.activities[activity_key].length;
    if (index != 'undefined' && index != null) {
        position = index;
    }
    
    var sub_key = 'cmi.interactions.' + dhbgApp.scorm.activitiesCurrent;
    dhbgApp.scorm.activitiesCurrent++;

    dhbgApp.scorm.activities[activity_key][position] = value;
    doLMSSetValue(sub_key + '.result', value);
    
    dhbgApp.scorm.saveProgress();
    doLMSSetValue(sub_key + '.id', activity_key);
    doLMSCommit();
    
};

dhbgApp.scorm.setActivityValue = function(key, value){
    try {
        dhbgApp.scorm.activitiesValues[key] = value;
        dhbgApp.scorm.saveProgress();
        doLMSCommit();
        return true;
    }
    catch (e) {
        return false;
    }
};

dhbgApp.scorm.getActivityValue = function(key){
    if (dhbgApp.scorm.activitiesValues[key]) {
        return dhbgApp.scorm.activitiesValues[key];
    }
    
    return null;
};

dhbgApp.scorm.getReturnUrl = function() {
    var courseurl = '';
    if (parent && parent.window.M) {
        M = parent.window.M;

        //Hack for Moodle
        if (parent.window.scormplayerdata) {
            courseurl = M.cfg.wwwroot + '/course/view.php?id=' + parent.window.scormplayerdata.courseid
        }
    }

    return courseurl;
};

dhbgApp.scorm.close = function(f) {
    dhbgApp.scorm.saveProgress();
    f();
};