'use strict';

/*if (window.top.opener && window.top.opener != window.top) {
    window.location = 'index.html';
}
else {*/

    var M = null;
    var courseurl = null;
    if (parent && parent.window.M) {
        M = parent.window.M;
        
        if (parent.window.scormplayerdata) {
            courseurl = M.cfg.wwwroot + '/course/view.php?id=' + parent.window.scormplayerdata.courseid
        }
    }

    var num = 1000 * Math.random();
    var unique_id = 'window_scorm_' + Math.round(num);
    var w_options = 'width=970, height=630, location=0, menubar=0, resizable=1, scrollbars=1, status=0, titlebar=0, toolbar=0';

    $(function () {

        var autoload = $('body').attr('data-autoload') ? $('body').attr('data-autoload') : false;

        if (autoload && autoload != 'false') {
            if (autoload == 'modal') {
                var $scorm_frame = $('body', window.parent.document);
                $scorm_frame.addClass('scorm_full_page');
                location.href = 'index.html';
            }
            else {
                $( window ).load(function() {
                    var window_scorm = window.open('index.html', unique_id, w_options);
                    scormredirect(window_scorm);
                });
            }
        }
        else {
            add_load_button (unique_id, w_options);
        }
    });

    var scormredirect = function (window_scorm) {
        $(window_scorm).on('load', function() {
            // Display a message to the user if the window is closed.
            if (courseurl) {
                $('#play_scorm').html('<a href="' + courseurl + '" target="_top">Este documento de estudio ha sido abierto en una ventana emergente, si ya ha finalizado de interactuar con el recurso, de clic acá para regresar a la pagina principal del curso.</a>');
            }
            else {
                $('#play_scorm').html('<p>Este documento de estudio ha sido abierto en una ventana emergente.</p>');
            }
        });

        $(window_scorm).on('unload', function() {
            // Onunload is called multiple times in the SCORM window - we only want to handle when it is actually closed.
            setTimeout(function() {
                if (window_scorm.closed) {
                    // Redirect the parent window to the course homepage.
                    if (courseurl) {
                        parent.window.location = courseurl;
                    }
                }
            }, 800)
        });
        // Check to make sure pop-up has been launched - if not display a warning,
        // this shouldn't happen as the pop-up here is launched on user action but good to make sure.
        setTimeout(function() {
            if (!window_scorm) {
                $('#play_scorm').html('<p>Parece que las ventanas emergentes están bloqueadas, deteniendo la ejecución de este documento de estudio.</p>');
                add_load_button (unique_id, w_options);
            }
        }, 800);
    }
//}

function add_load_button (unique_id, w_options) {
    var $button = $('<button>Haga clic acá para abrir el documento de estudio</button>');

    var $scorm_frame = $('body', window.parent.document);

    if ($scorm_frame) {
        $button.on('click', function() {
            $scorm_frame.addClass('scorm_full_page');
            location.href = 'index.html';
        });
    }
    else {
        $button.on('click', function() {
            var new_window_scorm = window.open('index.html', unique_id, w_options);
            scormredirect(new_window_scorm);
        });
    }

    $('#play_scorm').append($button);

}