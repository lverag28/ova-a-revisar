'use strict';
var dhbgApp = {};
dhbgApp.DEBUG_MODE = true;
dhbgApp.MODE = 'standard'; //standard or mobile
dhbgApp.STARTED = false;
dhbgApp.FULL_PAGES = true;
dhbgApp.evaluation = { "approve_limit" : 100 }

/*dhbgApp.DB = {};
dhbgApp.DB.currentPage = -1;
dhbgApp.DB.currentSubPage = -1;
dhbgApp.DB.changePostPageActions = [];
dhbgApp.DB.loadSound = null;
dhbgApp.DB.loadSound = document.createElement('audio');
dhbgApp.DB.loadSound.setAttribute('autoplay', 'autoplay');*/

dhbgApp.DB = {};
dhbgApp.DB.currentPage = -1;
dhbgApp.DB.currentSubPage = -1;
dhbgApp.DB.changePostPageActions = [];
dhbgApp.DB.loadSound = null;
//dhbgApp.DB.loadSound = document.createElement('audio');
//dhbgApp.DB.loadSound.setAttribute('autoplay', 'autoplay');
dhbgApp.DB.currentSoundActive;
dhbgApp.DB.loadedSounds = [];


dhbgApp.actions = {};
dhbgApp.actions.beforeChangePage = [];
dhbgApp.actions.afterChangePage = [];

dhbgApp.defaultValues = {};
dhbgApp.defaultValues.buttonover = function () { $(this).addClass('active'); };
dhbgApp.defaultValues.buttonout = function () { $(this).removeClass('active'); };

dhbgApp.pages = [];

$(function () {

    $( window ).load(function() {
        $('body').addClass('loading');

        var style_path = "css/styles.css";
        var custom_path = "css/custom.css";

        if ($(window).width() <= 512) {
            
            dhbgApp.MODE = 'mobile';

            if (dhbgApp.DEBUG_MODE) {
                style_path = "css/mobile.css";
                custom_path = "css/custommobile.css";
            }
            else {
                style_path = "css/mobile.min.css";
            }
        }
        else {

            if (dhbgApp.DEBUG_MODE) {
                style_path = "css/styles.css";
                custom_path = "css/custom.css";
            }
            else {
                style_path = "css/styles.min.css";
            }
        }
        
        if (dhbgApp.DEBUG_MODE) {
            var styles = document.createElement("link");
            styles.href = style_path;
            styles.rel = "stylesheet";
            styles.type = "text/css";
            document.body.appendChild(styles);
            
            var custom = document.createElement("link");
            custom.href = custom_path;
            custom.rel = "stylesheet";
            custom.type = "text/css";
            document.body.appendChild(custom);

            var start_app = function () {
                if (dhbgApp.MODE == 'mobile') {
                    dhbgApp.mobile.start();
                }
                else {
                    dhbgApp.standard.start();
                }
            };
            
            var styles_loaded = false;
            var custom_loaded = false;

            styles.onload = function () {
                styles_loaded = true;
                
                if (custom_loaded && !dhbgApp.STARTED) {
                    start_app();
                }
            }

            custom.onload = function () {
                custom_loaded = true;
                
                if (styles_loaded && !dhbgApp.STARTED) {
                    start_app();
                }
            }

        }
        else {
            var style_min = document.createElement("link");
            style_min.href = style_path;
            style_min.rel = "stylesheet";
            style_min.type = "text/css";
            document.body.appendChild(style_min);

            style_min.onload = function () {
                if (dhbgApp.MODE == 'mobile') {
                    dhbgApp.mobile.start();
                }
                else {
                    dhbgApp.standard.start();
                }
            }
        }

    });
});