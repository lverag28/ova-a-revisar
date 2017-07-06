'use strict';

jpit.resources.movi.movies = {
    "example_move": {
        "type": "move",
        "options" :  { "left": "400px" },
        "duration" : 2000,
        "effect": "linear",
        "events": { }
    }
};

jpit.resources.movi.movies.actions = {
    "auto_hide": function(movi) {
        movi.element.hide();
    },
    "click_cycle_init": function(movi) {
       movi.element.data('repetitions', 0);
    }
};
