'use strict';

dhbgApp.standard = {};

dhbgApp.standard.start = function() {
        dhbgApp.transition = 'fade';
        dhbgApp.transitionDuration = 400;
        dhbgApp.transitionOptions = {};

        $('#main .page').hide();
        $('#main #middle').show();
        $('body').removeClass('loading');

        var $header = $('header');
        var $footer = $('footer');
        var $main_menu = $('#main_menu');
        
        //header title
        var $h_title = $('<div id="header_title"></div>');
        var $h_subtitle = $('<div id="header_subtitle"></div>');
        $main_menu.before($h_title);
        $main_menu.before($h_subtitle);
        $h_title.html($header.attr('maintitle'));
        $h_subtitle.html($header.attr('subtitle'));
        
        if (dhbgApp.scorm) {
            dhbgApp.scorm.initialization();
        }
        else {
            $('globals [data-id="results"]').remove();
        }
        
        //main menu construction
        var $menu_items = $('<ul id="menu" class="regular_content"></ul>');
        $('menu >item').each(function() {
            var $this = $(this);
            
            var $litem = $('<li class="principal button" page="' + $this.attr('data-page') + '">' + $this.attr('title') + '</li>');
            
            var $subitems = $this.children();
            if($subitems.length > 0) {
                
                $litem.removeAttr('page');
                $litem.addClass('float_menu');
                var $ul_subitems = $('<ul class="children" style="display: none;"></ul>');
                $subitems.each(function() {
                    var $this = $(this);
                    if($this.attr('data-label')){
                        console.log("true");
                        var $subitem = $('<div class="button middle-child second-level-menu"></div>');
                        var $subitem_title = $('<span>' + $this.attr('title') + '</span>');
                        var $new_ul_subitems = $('<ul class="second-level-ul"></ul>');
                        
                        $subitem.append($subitem_title);
                        $subitem.append($new_ul_subitems);
                        
                        var $new_subitems = $this.children();
                        $new_subitems.each(function() {
                            var $new_item = $(this);
                            var $new_subitem = $('<li class="button middle-child" page="' + $new_item.attr('data-page') + '">' + $new_item.attr('title') + '</li>');
                            $new_ul_subitems.append($new_subitem);
                        });
                        
                    }
                    else{
                        var $subitem = $('<li class="button middle-child" page="' + $this.attr('data-page') + '">' + $this.attr('title') + '</li>');
                        
                    }
                    $ul_subitems.append($subitem);
                });
                
                $ul_subitems.find('li').first().removeClass('middle-child');
                $ul_subitems.find('li').first().addClass('first-child');
                $ul_subitems.find('li:last-child').first().removeClass('middle-child');
                $ul_subitems.find('li:last-child').first().addClass('last-child');
                
                $litem.append($ul_subitems);
            }
            
            $menu_items.append($litem);
        });

        $menu_items.find('li.principal:last-child').first().addClass('last-child');
        
        var $globals = $('globals item');
        var $box_globals = $('<div id="globals"></div>');
        
        $main_menu.empty();
        $main_menu.append($menu_items);
        
        
        $header.append($box_globals);
        
        $globals.each(function() {
            var $this = $(this);

            var $item = $this.children();
            $item.attr('id', $this.attr('data-id'));
            $item.addClass('button');
            $item.addClass('tooltip');
            $item.attr('data-position-at', 'bottom');
            $item.attr('title', $this.attr('title'));
            /*if($this.attr('data-home')){
                var $item = $('<div id="home" class="button regular_content"></div>');
            }
            else{
                var $item = $('<div id="' + $this.attr('data-id') + '" class="button regular_content">' + $this.attr('title') + '</div>');
            }*/
            
            $box_globals.append($item);
        });
        
        //Images preload
        var imgs = [];
        $('img').each(function() {
            var img_src = $(this).attr('src');
            if (!imgs[img_src]) {
                var img = new Image();
                
                img.onload = function(){
                    // image  has been loaded
                };
                
                img.src = img_src;
                
                imgs[img_src] = true;
            }
        });

        //buttons
        $('.button').on('mouseover', dhbgApp.defaultValues.buttonover);

        $('.button').on('mouseout', dhbgApp.defaultValues.buttonout);

        //Tabs menu
        $('#main_menu li.principal').on('click', function () {
        
            var $this = $(this);
            if ($this.attr('page')) {
                dhbgApp.loadPageN($this.attr('page'));
            }
        });
        
        $('.open_page').on('click', function () {
            
            var $this = $(this);
            if ($this.attr('page')) {
                //dhbgApp.changeSco(dhbgApp.pagesNames[$this.attr('page')]);
                dhbgApp.loadPageN($this.attr('page'));
            }
        });

        //float menu
        $('.float_menu').on('mouseover', function () {
            $(this).find('ul.children').show();
        });

        $('.float_menu').on('mouseout', function () {
            $(this).find('ul.children').hide();
        });

        $('#main_menu .float_menu li').on('click', function () {
            var $this = $(this);
            if ($this.attr('page')) {
                dhbgApp.loadPageN($this.attr('page'));
            }
            
            $('#main_menu .float_menu ul.children').hide();
        });
        
        //Animations
        $('img.animation').on('click', function () {
            var $this = $(this);
            var img_src = $this.attr('src');
            $this.attr('src', '');
            $this.attr('src', img_src + '?' + (new Date().getTime()));
        });

        $('img.animation').each(function () {
            var $this = $(this);
            var $label = $('<div class="label instruction">Clic para repetir la animación</div>');
            $this.wrapAll('<div class="animation_image"></div>');
            $this.parent().append($label);
            
            $label.on('click', function () {
                var img_src = $this.attr('src');
                $this.attr('src', '');
                $this.attr('src', img_src + '?' + (new Date().getTime()));
            });
        });

        $('img.play-animation').each(function () {
            var $this = $(this);
            $this.wrapAll('<div class="animation_image play_animation"></div>');
            var $label = $('<div class="label instruction">Clic para reproducir la animación</div>');
            
            $this.parent().append($label);
            
            $this.wrapAll('<div class="animation_container"></div>');
            var $parent = $this.parent();
            
            var $procesed = false;
            $label.on('click', function() {
                if (!$procesed) {
                    $parent.css('min-height', $this.height() + 'px');
                    $parent.css('min-width', $this.width() + 'px');
                    $procesed = true;
                }
                $parent.empty();
                $parent.addClass('animation_loading');
                
                var $img = $('<img src="' + $this.attr('data-animation') + '?' + (new Date().getTime()) +'" class="played_animation" />');

                $img.on('load', function(){
                    $parent.removeClass('animation_loading');                    
                });

                $parent.append($img);
            });
        });

        //css animation
        var index_animation = 0;
        $(".css-animation").each(function() {
            var $old_animation = $(this);
            
            var  id_old_animation;
            if(!$old_animation.attr('id')){
                $old_animation.attr('id', 'css_animation_' + index_animation);
                index_animation++;
            }
            id_old_animation = $old_animation.attr('id');
            
            $('#' + id_old_animation).on('click', function() {
                var $this = $(this);
                var $new_animaton = $this.clone(true);
                $new_animaton.attr("id", 'css_animation_' + index_animation);
                index_animation++;
                $this.before($new_animaton);
                $("#" + $this.attr("id")).remove();

            });
        });

        //Home control
        $('#home').on('click', function () {
            dhbgApp.loadPageN('home');
        });

        //Return control
        if (window.parent.document != window.document) {
            var $scorm_frame = $('body', window.parent.document);
            $('#return').on('click', function () {
                var $this = $(this);
                if ($this.hasClass('rotate')) {
                    $scorm_frame.addClass('scorm_full_page');
                    $('#return').removeClass('rotate');
                }
                else {
                    $scorm_frame.removeClass('scorm_full_page');
                    $('#return').addClass('rotate');
                }
            });

            $('#close_all').on('click', function () {
                if (dhbgApp.scorm) {
                    dhbgApp.scorm.close(function() {
                        window.parent.document.location.href = dhbgApp.scorm.getReturnUrl();
                    });
                }
            });
        }
        else {
            $('#return').hide();
            $('#close_all').hide();
        }

        //Slide topics buttons
        $('#nav .btn_right').on('click', function () {
            var next = dhbgApp.DB.currentSubPage + 1;

            if (!dhbgApp.FULL_PAGES && dhbgApp.pages[dhbgApp.DB.currentPage].subpages > next) {
               dhbgApp.loadSubPage(dhbgApp.DB.currentPage, next);
            }
            else {
               dhbgApp.loadPage(dhbgApp.DB.currentPage + 1);
            }
        });

        $('#nav .btn_left').on('click', function () {
            var next = dhbgApp.DB.currentSubPage - 1;

            if (!dhbgApp.FULL_PAGES && next >= 0) {
               dhbgApp.loadSubPage(dhbgApp.DB.currentPage, next);
            }
            else {
                dhbgApp.loadPage(dhbgApp.DB.currentPage - 1, dhbgApp.pages[dhbgApp.DB.currentPage - 1].subpages - 1);
            }
        });

        //Credits control
        $('#credits').on('click', function () {
            dhbgApp.loadPageN('credits');
        });
        
        //Bibliography control
        $('#bibliography').on('click', function () {
            dhbgApp.loadPageN('bibliography');
        });

        //Results control
        $('#results').on('click', function () {
            
            var $visited = $('#results_page_visited');
            $visited.empty();
            
            var index, $current_page;
            var position = 1;
            for(index in dhbgApp.scorm.scoList) {
                if (dhbgApp.scorm.scoList[index]) {
                    var sco = dhbgApp.scorm.scoList[index];
                    $current_page = $('<div class="result_sco">' + (position) + '</div>');
                    if (sco.visited) {
                        $current_page.addClass('visited');
                    }
                    $visited.append($current_page);
                    position++;
                }
            }
            
            var $activities = $('#results_page_activities ul.data_list');
            $activities.empty();
            
            for (var activity_key in dhbgApp.scorm.activities) {
                if (dhbgApp.scorm.activities[activity_key]) {
                    
                    var $data_act = $('[data-act-id="' + activity_key + '"]');
                    var title = $data_act.attr('data-act-title') ? $data_act.attr('data-act-title') : activity_key;
                    
                    var $act = $('<li class="result_activity"><strong>' + title + '</strong>: </li>');

                    if (typeof dhbgApp.scorm.activities[activity_key] == 'string') {
                        $act.append(dhbgApp.scorm.activities[activity_key] + '%');
                    }
                    else if (typeof dhbgApp.scorm.activities[activity_key] == 'object' && dhbgApp.scorm.activities[activity_key].length > 0) {
                        var list_intents = [];
                        for(var intent = 0; intent < dhbgApp.scorm.activities[activity_key].length; intent++) {
                            if (dhbgApp.scorm.activities[activity_key][intent]) {
                                list_intents[list_intents.length] = dhbgApp.scorm.activities[activity_key][intent] + '%';
                            }
                            else {
                                list_intents[list_intents.length] = '0%';
                            }
                        }
                        $act.append(list_intents.join(', '));
                    }
                    else {
                        $act.append('no tiene intentos');
                    }
                    $activities.append($act);
                }
            }
        });

        //Special controls
        $('.accordion').accordion({ autoHeight: false, heightStyle: "content"});

        $('.view-first').each(function () {
            var $this = $(this);

            var view_first_w = $this.attr('data-width');
            var view_first_h = $this.attr('data-height');
            $this.css('width', view_first_w);
            $this.css('height', view_first_h);

            $this.removeAttr('data-width');
            $this.removeAttr('data-height');

            var $mask = $('<div class="mask"></div>');
            $mask.width(view_first_w);
            $mask.height(view_first_h);

            $mask.append($this.find('.view-content'));

            $this.append($mask);
        });

        //Special activity, mouse over
        $('.act_mouse_over').on('mouseover', function() {
            var selector = $(this).attr('data-ref');
            $(selector).show();
        });
        
        $('.act_mouse_over').on('mouseout', function() {
            var selector = $(this).attr('data-ref');
            $(selector).hide();
        });
        
        //Map object
        $('.show_map').on('click', function () {
            var $this = $(this);
            var w = $this.attr('data-property-width') ? $this.attr('data-property-width') : 920;
            
            $this.find('.element').dialog({ width: w, modal: true, dialogClass: 'map_dialog',
                close: function( event, ui ) {
                    $(this).dialog( "destroy" );
                }
            });
        });

        //Special activity, mouse over with one visible
        $('.act_mouse_over_one').each(function(){
            var $this = $(this);
            
            $this.find('[data-ref]').on('mouseover', function() {
                $this.find('[data-ref]').each(function() {
                    $($(this).attr('data-ref')).hide();
                });
                
                $this.parent().find('.button').removeClass('current');

                var selector = $(this).attr('data-ref');
                $(selector).show();
                $(this).addClass('current');
            });
        });

        //Print page go back
        $('#printent_back').on('click', function(){
            $('#printent_content').hide();
            $('body').removeClass('print_mode');
            $('#printent_content div.content').empty();
        });

        //special contents
        $('.box_connection').each(function(){            
            var $this = $(this);
            var $children = $this.children();
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
                 
            $box_body.append($object);
            $this.html($box_body);
        });
        
        $('.box_stressed').each(function(){
            var $this = $(this);
            var $children = $this.children();
            var $box_body_highlighted = $('<div class="box_body_highlighted"></div>');
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
            
            $box_body.append($object);
            $box_body_highlighted.append($box_body);
            $this.html($box_body_highlighted);
        });
        
        $('.box_required_link').each(function(){
            var $this = $(this);
            var $children = $this.children();
            var $box_body_highlighted = $('<div class="box_body_highlighted"></div>');
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
            
            $box_body.append($object);
            $box_body_highlighted.append($box_body);
            $this.html($box_body_highlighted);
        });
        
        $('.box_examples').each(function(){
            var $this = $(this);
            var $children = $this.children();
            var $box_body_highlighted = $('<div class="box_body_highlighted"></div>');
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
            
            $box_body.append($object);
            $box_body_highlighted.append($box_body);
            $this.html($box_body_highlighted);
        });
        
        $('.box_note').each(function(){
            var $this = $(this);
            var $children = $this.children();
            var $box_body_highlighted = $('<div class="box_body_highlighted"></div>');
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
            
            $box_body.append($object);
            $box_body_highlighted.append($box_body);
            $this.html($box_body_highlighted);
        });

        $('.box_podcast').each(function(){
            var $this = $(this);
            var $children = $this.children();
            var $box_body_highlighted = $('<div class="box_body_highlighted"></div>');
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
            
            $box_body.append($object);
            $box_body_highlighted.append($box_body);
            $this.html($box_body_highlighted);
        });

        $('.box_video').each(function(){
            var $this = $(this);
            var $children = $this.children();
            var $box_body_highlighted = $('<div class="box_body_highlighted"></div>');
            var $box_body = $('<div class="box_body"></div>');
            
            var $object = ($children.length > 0) ? $children : $this.html();
            
            $box_body.append($object);
            $box_body_highlighted.append($box_body);
            $this.html($box_body_highlighted);
        });
        
        //Some actions
        
        //horizontal menu
        $('.horizontal-menu').each(function(){
            
            var $this = $(this);
            var $chalkboard_items = $('<div class="chalkboard_items board"></div>');
            var $chalkboard_content = $('<div class="chalkboard_content elements"></div>');
            $this.find('>dl').each(function() {
                var $dl = $(this);
                var $dd= $('<div class="element rule_1 tab_content"></div>');
                $dd.append($dl.find('>dd').children());
                var $dt = $('<div class="chalkboard_item button">' + $dl.find('dt').html() + '</div>').on('click', function(){
                     
                    var $item_dt = $(this);
                    
                    if (dhbgApp.DB.loadSound) {
                        dhbgApp.DB.loadSound.pause();
                        $chalkboard_content.find('audio').each(function(){
                            this.pause();
                        });
                    }

                    $chalkboard_content.find('.element').hide();
                    
                    $chalkboard_items.find('.current').removeClass('current');
                    $item_dt.addClass('current');
                    $dd.show();
                });
                
                $dt.on('mouseover', dhbgApp.defaultValues.buttonover);

                $dt.on('mouseout', dhbgApp.defaultValues.buttonout);
                
                $chalkboard_items.append($dt);
                
                $chalkboard_content.append($dd);
            });
            
            $chalkboard_content.find('.element').hide();
            $chalkboard_items.find(':first-child').addClass('current');
            $chalkboard_items.find(':last-child').addClass('last-item');
            $chalkboard_content.find('.element:first-child').show();
            $this.empty();
            
            $this.append($chalkboard_items);
            $this.append('<div class="clear"></div>');
            $this.append($chalkboard_content);
            $this.append('<div class="clear"></div>');
            
        });
        
        //vertical menu
        $('.vertical-menu').each(function(){
            
            var $this = $(this);
            var $chalkboard_items = $('<div class="chalkboard_vertical_items board"></div>');
            var $chalkboard_content = $('<div class="chalkboard_vertical_content elements"></div>');
            
            $this.find('dl').each(function() {
                var $dl = $(this);
                
                var $dd= $('<div class="chalkboard_vertical_element rule_1 tab_content"></div>');
                $dd.append($dl.find('>dd').children());
                var $dt = $('<div class="chalkboard_vertical_item button">' + $dl.find('dt').html() + '</div>').on('click', function(){
                     
                     var $item_dt = $(this);
                    
                    $chalkboard_content.find('.chalkboard_vertical_element').hide();
                    
                    $chalkboard_items.find('.current').removeClass('current');
                    $item_dt.addClass('current');
                    $dd.show();
                });
                
                $dt.on('mouseover', dhbgApp.defaultValues.buttonover);

                $dt.on('mouseout', dhbgApp.defaultValues.buttonout);
                
                $chalkboard_items.append($dt);
                
                $chalkboard_content.append($dd);
            });
            
            $chalkboard_content.find('.chalkboard_vertical_element').hide();
            $chalkboard_items.find(':first-child').addClass('current');
            $chalkboard_items.find(':last-child').addClass('last-item');
            $chalkboard_content.find('.chalkboard_vertical_element:first-child').show();
            $this.empty();
            
            $this.append($chalkboard_items);
            $this.append($chalkboard_content);
            $this.append('<div class="clear"></div>');
            
        });
        
        //vertical menu
        $('.vertical-menu-both-sides').each(function(){
            
            var $this = $(this);
            var $chalkboard_items_left = $('<div class="chalkboard_both_items_left board"></div>');
            var $chalkboard_items_right = $('<div class="chalkboard_both_items_right board"></div>');
            var $chalkboard_content = $('<div class="chalkboard_both_content elements"></div>');
            
            $this.find('left').each(function(){
                var $left = $(this);
                $left.find('dl').each(function() {
                    var $dl = $(this);
                    
                    var $dd= $('<div class="chalkboard_both_element rule_1 tab_content"></div>');
                    $dd.append($dl.find('dd').children());
                    
                    var $dt = $('<div class="chalkboard_both_item button">' + $dl.find('dt').html() + '</div>').on('click', function(){
                    
                         var $item_dt = $(this);
                        
                        $chalkboard_content.find('.chalkboard_both_element').hide();
                        
                        $this.find('.chalkboard_both_current').removeClass('chalkboard_both_current');
                        $item_dt.addClass('chalkboard_both_current');
                        $dd.show();
                    });
                    
                    $dt.on('mouseover', dhbgApp.defaultValues.buttonover);

                    $dt.on('mouseout', dhbgApp.defaultValues.buttonout);
                    
                    $chalkboard_items_left.append($dt);
                    
                    $chalkboard_content.append($dd);
                });
            });
            
            $this.find('right').each(function(){
            
                var $right = $(this);
                $right.find('dl').each(function() {
                    var $dl = $(this);
                    
                    var $dd= $('<div class="chalkboard_both_element rule_1 tab_content"> ' + $dl.find('dd').html() + ' </div>');
                    
                    var $dt = $('<div class="chalkboard_both_item button">' + $dl.find('dt').html() + '</div>').on('click', function(){
                        var $item_dt = $(this);
                        
                        $chalkboard_content.find('.chalkboard_both_element').hide();
                        
                        $this.find('.chalkboard_both_current').removeClass('chalkboard_both_current');
                        $item_dt.addClass('chalkboard_both_current');
                        $dd.show();
                    });
                    
                    $dt.on('mouseover', dhbgApp.defaultValues.buttonover);

                    $dt.on('mouseout', dhbgApp.defaultValues.buttonout);
                    
                    $chalkboard_content.append($dd);
                    $chalkboard_items_right.append($dt);
                });
            });
            
            $chalkboard_content.find('.chalkboard_both_element').hide();
            $chalkboard_items_left.find(':first-child').addClass('chalkboard_both_current');
            $chalkboard_items_left.find(':last-child').addClass('last-item');
            $chalkboard_items_right.find(':last-child').addClass('last-item');
            $chalkboard_content.find(':first-child').show();
            $this.empty();
            
            $this.append($chalkboard_items_left);
            $this.append($chalkboard_content);
            $this.append($chalkboard_items_right);
            $this.append('<div class="clear"></div>');
            
        });
        
        //Special contents windows
        $('.w_content').each(function() {
            var $this = $(this);
            var properties = {modal: true, autoOpen: false};
            
            if ($this.attr('data-property-width')) {
                properties.width = $this.attr('data-property-width');
            }
            
            if ($this.attr('data-property-height')) {
                properties.height = $this.attr('data-property-height');
            }
            
            if ($this.attr('data-cssclass')) {
                properties.dialogClass = $this.attr('data-cssclass');
            }

            $this.dialog(properties);
        });
        
        $('.w_content_controler').on('click', function(){
            var $this = $(this);
            var w = $this.attr('data-property-width');
            var h = $this.attr('data-property-height');
            
            if (w) {
                $($this.attr('data-content')).dialog('option', 'width', w);
            }
            
            if (h) {
                $($this.attr('data-content')).dialog('option', 'height', h);
            }

            $($this.attr('data-content')).dialog('open');
        });

        //Special content: pagination
        $('.ctrl_pagination').each(function() {
            var $this = $(this);
            var $items = $this.find('>li');
            var $list = $('<ul class="layers"></ul>');
            
            if ($this.attr('data-layer-height')) {
                $list.height($this.attr('data-layer-height'));
            }

            var numeric_pagination = false;
            if ($this.attr('data-numeric-pagination')) {
                $this.addClass('data-numeric-pagination');
                numeric_pagination = true;
            }

            //var buttons = [];
            var $ul_pagination = $('<div class="ul-pagination ' + (numeric_pagination ? 'numeric' : 'arrows') + '"></div>');
            var $list_buttons = $('<ul class="pagination ' + (numeric_pagination ? 'numeric' : 'arrows') + '"></ul>');
            $ul_pagination.append($list_buttons);
            var i = 1;

            $items.each(function(){
                var $item = $(this);
                $item.addClass('layer');
                $list.append($item);
                
                var label = i;
                if ($this.attr('data-type') == 'a') {
                    label = String.fromCharCode(96 + i);
                }
                else if ($this.attr('data-type') == 'A') {
                    label = String.fromCharCode(96 + i).toUpperCase(); ;
                }
                
                $item.append('<div class="label_current">' + label + '</div>');
                 
                if (numeric_pagination) {
                    var $new_button = $('<li class="button"><div class="number_container"><div class="number">' + label + '</div></div></li>');
                    $new_button.on('mouseover', dhbgApp.defaultValues.buttonover);
                    $new_button.on('mouseout', dhbgApp.defaultValues.buttonout);
                    
                    $new_button.on('click', function() { 
                        $items.hide(); 
                        $item.show(); 
                        $list_buttons.find('.current').removeClass('current');
                        $(this).addClass('current');
                    });

                    $list_buttons.append($new_button);

                    if (i == 1) {
                        $new_button.addClass('current');
                    }
                }

                if (i > 1) {
                    $item.hide();
                }
                
                i++;
            });
            
            if (!numeric_pagination) {
                $items.data('current', 0);

                //Back button
                var $back_button = $('<li><div class="button previous"></div></li>');
                $back_button.on('mouseover', dhbgApp.defaultValues.buttonover);
                $back_button.on('mouseout', dhbgApp.defaultValues.buttonout);
                
                $back_button.on('click', function() {
                    
                    if (dhbgApp.DB.loadSound) {
                        dhbgApp.DB.loadSound.pause();
                        dhbgApp.DB.loadSound.currentTime = 0;
                    }
                    var new_item_index = $items.data('current') - 1;
                    
                    if (new_item_index < 0) {
                        return;
                    }
                    
                    $items.hide();
                    $($items.get(new_item_index)).show();
                    $items.data('current', new_item_index);
                    $list_buttons.find('.position').text((new_item_index + 1) + '/' + $items.length);
                });

                $list_buttons.append($back_button);
                //End Back button

                $list_buttons.append('<li class="position">1/' + $items.length + '</li>');

                //Next button
                var $next_button = $('<li><div class="button next"></div></li>');
                $next_button.on('mouseover', dhbgApp.defaultValues.buttonover);
                $next_button.on('mouseout', dhbgApp.defaultValues.buttonout);
                
                $next_button.on('click', function() {
                    if (dhbgApp.DB.loadSound) {
                        dhbgApp.DB.loadSound.pause();
                        dhbgApp.DB.loadSound.currentTime = 0;
                    }
                    var new_item_index = $items.data('current') + 1;
                    
                    if (new_item_index >= $items.length) {
                        return;
                    }
                    
                    $items.hide();
                    $($items.get(new_item_index)).show();
                    $items.data('current', new_item_index);
                    $list_buttons.find('.position').text((new_item_index + 1) + '/' + $items.length);
                });

                $list_buttons.append($next_button);
                //End Next button

            }

            $this.append($list);
            $this.append($ul_pagination);
            $this.append('<div class="clear"></div>');
        });
        
        
        if (jpit.resources && jpit.resources.movi) {
            var index_movi = 1;
            $('.movi').each(function(){
                var $this = $(this);
                
                if (!$this.attr('data-name')) {
                    $this.attr('data-name', 'movi_' + index_movi);
                }

                var index_layer = 1;
                $this.find('[data-movi-type]').each(function() {
                    var $layer = $(this);
                    $layer.addClass('movi-layer');

                    if (!$layer.attr('data-name')) {
                        $layer.attr('data-name', 'movi_' + index_movi + '_' + index_layer);
                    }
                    
                    jpit.resources.movi.processMoviLayer($layer);
                    index_layer++;
                });
                
                index_movi++;
                
            });

            $('[data-movi-play]').each(function(){
                var $this = $(this);
                var event_name = $this.attr('data-movi-event') ? $this.attr('data-movi-event') : 'click';
                
                $this.on(event_name, function(){
                    var movi;
                    
                    if(movi = jpit.resources.movi.movies[$this.attr('data-movi-play')]) {
                    
                        if (!movi.tail) {
                            movi.tail = [];
                        }
                        
                        movi.element = $(movi.selector);

                        if (!movi.main_movi) {
                            movi.main_movi = movi.element;
                        }

                        jpit.resources.movi.processMovi(movi);
                    }
                });
            });
            
            $('[data-event-action]').each(function(){
                var $this = $(this);
                var event_name = $this.attr('data-event-name') ? $this.attr('data-event-name') : 'click';
                
                $this.on(event_name, function(){
                    
                    switch($this.attr('data-event-action')) {
                        case 'play_movi':
                            jpit.resources.movi.readMoviSequence($($this.attr('data-event-action-selector')), null);
                            break;
                        case 'auto_hide':
                            $this.hide();
                            break;
                        default:
                            if (jpit.resources.movi.movies.actions[$this.attr('data-event-action')]) {
                                var f = jpit.resources.movi.movies.actions[$this.attr('data-event-action')];
                                f();
                            }
                    }
                });
            });

            dhbgApp.actions.beforeChangePage[dhbgApp.actions.beforeChangePage.length] = function($current_subpage) {
                
                jpit.resources.movi.currentMovi = null;
                $current_subpage.find('[data-movi-type]').each(function(){
                    $(this).stop(true, false);
                });
            };

            dhbgApp.actions.afterChangePage[dhbgApp.actions.afterChangePage.length] = function($current_subpage) {
                
                $current_subpage.find('.movi').each(function(){
                    var $this = $(this);
                    jpit.resources.movi.readMoviSequence($this, null);
                });
            };
        }

        //Activities

        dhbgApp.standard.load_operations();

        $('.pit-activities-memory').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityMemory($this);
        });

        $('.pit-activities-quiz').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityQuiz($this);
        });
        
        $('.pit-activities-wordpuzzle').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityWordpuzzle($this);
        });

        $('.pit-activities-droppable').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityDroppable($this);
        });

        $('.pit-activities-multidroppable').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityMultidroppable($this);
        });

        $('.pit-activities-mark').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityMark($this);
        });

        $('.pit-activities-crossword').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityCrossword($this);
        });
        
        $('.pit-activities-cloze').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityCloze($this);
        });

        $('.pit-activities-guessing').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityGuessing($this);
        });

        $('.pit-activities-sortable').each(function(){
            var $this = $(this);
            dhbgApp.actions.activitySortable($this);
        });

        $('.pit-resources-zoom').each(function(){
            var $this = $(this);
            
            var zoom = $this.attr('data-magnification') ? parseInt($this.attr('data-magnification')) : 2;
            var size = $this.attr('data-magnifier-size') ? $this.attr('data-magnifier-size') : '100px';
            
            jpit.resources.zoom.createZoom($this, zoom, size);
        });

        $('.pit-activities-form').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityForm($this);
        });

        $('.pit-activities-check').each(function(){
            var $this = $(this);
            dhbgApp.actions.activityCheck($this);
        });

        //open_url. This is processed on the end in order to not be disabled for another dynamic html
        $('.open_url').on('click', function(){
            window.open($(this).attr('data-url'));
        });
        
        //tooltip
        $('.tooltip').each(function() {
            
            var $this = $(this);
            
            var position = {};
            
            position.my = $this.attr('data-position-my') ? $this.attr('data-position-my') : "right top";
            position.at = $this.attr('data-position-at') ? $this.attr('data-position-at') : "left top";
            position.collision = $this.attr('data-position-flipfit') ? $this.attr('data-position-flipfit') : "flipfit";
            
            $this.tooltip({
                content: function() {
                    return $( this ).attr( "title" );
                },
                show: null, // show immediately 
                position: position,
                using: function( position, feedback ) {
                  $( this ).css( position );
                  $( "<div>" )
                    .addClass( "arrow" )
                    .addClass( feedback.vertical )
                    .addClass( feedback.horizontal )
                    .appendTo( this );
                },
                hide: { effect: "" }, //fadeOut
                close: function(event, ui){
                    ui.tooltip.hover(
                        function () {
                            $(this).stop(true).fadeTo(400, 1); 
                        },
                        function () {
                            $(this).fadeOut("400", function(){
                                $(this).remove(); 
                            })
                        }
                    );
                }
            });
        });

        $('.after-before').each(function() {
            var $this = $(this);
            var orientation = $this.attr('data-orientation') && $this.attr('data-orientation') == 'vertical' ? 'vertical' : 'horizontal';
            var offset = $this.attr('data-offset') ? $this.attr('data-offset') : 0.5;
            var before_img = $this.find("img:first");

            if (before_img.length > 0) {
                before_img = before_img[0];
                $this.css('width', before_img.width);
                $this.css('height', before_img.height);

                $this.addClass('twentytwenty-container');
                $this.twentytwenty({
                    "orientation": orientation,
                    "default_offset_pct": offset
                });
            }
        });

        $('.maphilight').each(function(){
            var $this = $(this);
            var fill_color = $this.attr('data-mark-fill-color') ? $this.attr('data-mark-fill-color') : 'ffffff';
            var stroke_color = $this.attr('data-mark-stroke-color') ? $this.attr('data-mark-stroke-color') : 'ffffff';
            var opacity = $this.attr('data-mark-opacity') ? parseFloat($this.attr('data-mark-opacity')) : 0.4;
            $this.maphilight( { fill : true, fillColor: fill_color, fillOpacity: opacity, strokeColor: stroke_color } );
        });

        $('.instruction').prepend('<i class="ion-help-circled"></i>');

        //feedback
        $('.jpit_activities_quiz_question_feedback_true').each(function(){
            var $this = $(this);
            
            $this.prepend('<i class="ion-checkmark"></i>');
        });
        $('.jpit_activities_quiz_question_feedback_false').each(function(){
            var $this = $(this);
            
            $this.prepend('<i class="ion-close"></i>');
        });
        
        //Sounds
        dhbgApp.actions.autoLoadSounds($('body'));

        dhbgApp.actions.beforeChangePage[dhbgApp.actions.beforeChangePage.length] = function($current_subpage){
            if (dhbgApp.DB.loadSound) {
                dhbgApp.DB.loadSound.pause();
            }
        };

        $('.page').each(function(index_page, value_page) {
            var $page = $(this);
            $page.addClass('page_' + index_page);
            
            $page.find('.subpage').each(function(i, v) {
                $(this).addClass('subpage_' + i);
            });
        });
        
        dhbgApp.pages[0] = {'id': 'context', 'subpages': 1, 'title': 'Contextualization'};
     //   dhbgApp.pages[1] = {'id': 'map', 'subpages': 1, 'title': 'Esquema'};
        
        $('#menu .children li').each(function(){

            var $this = $(this);
            var k = dhbgApp.pages.length;
            dhbgApp.pages[k] = {'id': $this.attr('page'), 'title': $this.text(), 'parent': '#main_menu .float_menu'};
            dhbgApp.pages[k].subpages = dhbgApp.FULL_PAGES ? 1 : $('.page_' + k + ' .subpage').length;
        });

     //   dhbgApp.pages[dhbgApp.pages.length] = {'id': 'activity', 'subpages': 1, 'title': 'Actividad de aprendizaje' };
        dhbgApp.pages[dhbgApp.pages.length] = {'id': 'bibliography', 'subpages': 1, 'title': 'BibliografÃ­a'};
        dhbgApp.pages[dhbgApp.pages.length] = {'id': 'credits', 'subpages': 1, 'title': 'CrÃ©ditos'};

        dhbgApp.pagesNames = [];


        $.each(dhbgApp.pages, function(i, v) {
            dhbgApp.pagesNames[v.id] = i;
            
            if (dhbgApp.scorm) {
                dhbgApp.scorm.indexPages[i] = [];

                for (var k = 0; k < v.subpages; k++) {
                    var sco = {
                        "page": i,
                        "subpage": k,
                        "visited": false,
                        "value": 1,
                        "index" : dhbgApp.scorm.scoList.length
                    };

                    if (dhbgApp.scorm.visited[sco.index]) {
                        sco.visited = true;
                    }

                    dhbgApp.scorm.indexPages[i][k] = sco.index;
                    dhbgApp.scorm.scoList[sco.index] = sco;
                }
            }
        });


        if (!dhbgApp.scorm || !dhbgApp.scorm.lms) {
            $('#not_scorm_msg').dialog( { modal: true } );
        }

        if (dhbgApp.scorm && dhbgApp.scorm.activities) {
            dhbgApp.scorm.activities = dhbgApp.sortObjectByProperty(dhbgApp.scorm.activities);
        }

        if (dhbgApp.scorm && dhbgApp.scorm.change_sco) {
            dhbgApp.changeSco(dhbgApp.scorm.currentSco);
        }
        else {
            dhbgApp.loadPage(0, 0);
        }

};


//=========================================================================
// Init functions
//=========================================================================
dhbgApp.standard.load_operations = function() {
    dhbgApp.changeSco = function(index) {
        var sco = dhbgApp.scorm.scoList[index];
        
        dhbgApp.scorm.currentSco = index;
        
        dhbgApp.loadPage(sco.page, sco.subpage);
    };
    
    dhbgApp.printProgress = function() {
        if (typeof dhbgApp.scorm == 'object') {
            var progress = dhbgApp.scorm.getProgress();

            if (progress) {
                $('#measuring_results_level div').css('width', progress + '%');
                $('#measuring_results_value span').text(progress);
            }
            else {
                $('#measuring_results').hide();
            }
        }
    };

    dhbgApp.printTitle = function() {
        if ((dhbgApp.DB.currentPage || dhbgApp.DB.currentPage === 0 ) && dhbgApp.pages[dhbgApp.DB.currentPage]) {
            $('header h1').html(dhbgApp.pages[dhbgApp.DB.currentPage].title);
        }
        else {
            $('header h1').html('');
        }
    };

    dhbgApp.loadPageN = function(name) {
        dhbgApp.loadPage(dhbgApp.pagesNames[name]);
    };

    dhbgApp.loadPage = function(npage, nsubpage) {

        if (!nsubpage) {
            nsubpage = 0;
        }

        if(npage == 0){
            $('#nav .btn_left').hide();
        }
        else{
            $('#nav .btn_left').show();
        }

        if(npage == dhbgApp.pages.length -1){
            $('#nav .btn_right').hide();
        }
        else{
            $('#nav .btn_right').show();
        }

        if (npage != dhbgApp.DB.currentPage) {

            var page = dhbgApp.pages[npage];
            $('#main_menu li').removeClass('current');

            $('#main_menu li[page="' + page.id + '"]').addClass('current');

            if (page.parent) {
                $(page.parent).addClass('current');
            }

            var $nav = $('#nav ul');
            var $node;

            $nav.empty();

            if (!dhbgApp.FULL_PAGES) {
                if (page.subpages > 1) {

                    var sco;
                    for(var i = 0; i < page.subpages; i++) {

                        $node = $('<li class="button">' + (i+1) + '</li>');
                        if (i == 0) {
                            $node.addClass('current  visited');
                        }

                        if (dhbgApp.scorm) {
                            sco = dhbgApp.scorm.scoList[dhbgApp.scorm.indexPages[npage][i]];

                            if (sco.visited) {
                                $node.addClass('visited');
                            }
                        }

                        $node.attr('spage', i);
                        $node.on('mouseover', dhbgApp.defaultValues.buttonover);
                        $node.on('mouseout', dhbgApp.defaultValues.buttonout);
                        
                        $node.on('click', function() { dhbgApp.loadSubPage(npage, parseInt($(this).attr('spage'))); });

                        $nav.append($node);
                    }
                }
            }
          
        }

        if (dhbgApp.FULL_PAGES) {
            dhbgApp.loadFullPage(npage, nsubpage);
        }
        else {
            dhbgApp.loadSubPage(npage, nsubpage);
        }

        dhbgApp.DB.currentPage = npage;
        dhbgApp.printNumberPage(npage, nsubpage);
        
    };

    dhbgApp.loadSubPage = function (npage, nsubpage) {

        if (dhbgApp.DB.currentSubPage != nsubpage || dhbgApp.DB.currentPage != npage) {
            
            var $current_subpage = $('#nav ul .current');
            
            //Actions before change page
            $.each(dhbgApp.actions.beforeChangePage, function(i, v){
                v($current_subpage);
            });

            if (nsubpage == 0 && npage == 0) {
                $('#main .btn_left .button').hide();
            }
            else {
                $('#main .btn_left .button').show();
            }

            if ((nsubpage + 1) >= dhbgApp.pages[npage].subpages && (npage + 1) == dhbgApp.pages.length) {
                $('#main .btn_right .button').hide();
            }
            else {
                $('#main .btn_right .button').show();
            }

            $current_subpage.removeClass('current');
                    
            $('#nav ul li[spage=' + nsubpage + ']').addClass('current');


            var $current = $('#main .subpage.current');

            var $new_subpage = $('#main .page_' + npage + ' .subpage_' + nsubpage);
            
            if ($current.length > 0) {
                $current.hide(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function() {
                    $('#main .subpage').removeClass('current');
                    
                    //Hack by multiple subpages selecteds in fast clicks
                    $('#main .subpage').hide();
                    
                    $new_subpage.addClass('current');
                    $new_subpage.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                        dhbgApp.eachLoadPage($new_subpage);
                    });
                });
            }
            else {
                $new_subpage.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                    dhbgApp.eachLoadPage($new_subpage);
                });
                $new_subpage.addClass('current');
            }

            if (dhbgApp.scorm) {
                dhbgApp.scorm.saveVisit(dhbgApp.scorm.indexPages[npage][nsubpage]);
            }

            dhbgApp.DB.currentSubPage = nsubpage;
            
            if (npage == dhbgApp.pagesNames['home']) {
                $('#home').hide();
            }
            else {
                $('#home').show();
            }
            //Actions in change page
            $.each(dhbgApp.actions.afterChangePage, function(i, v){
                v($new_subpage);
            });
        }
        dhbgApp.printNumberPage(npage, nsubpage);
    };

    dhbgApp.loadFullPage = function (npage, nsubpage) {

        if (dhbgApp.DB.currentPage != npage) {

            var $current_page = $('.page.current');

            if ($current_page.length > 0) {
                //Actions before change page
                $.each(dhbgApp.actions.beforeChangePage, function(i, v){
                    v($current_page);
                });

            }


            if (npage == 0) {
                $('#main .btn_left .button').hide();
            }
            else {
                $('#main .btn_left .button').show();
            }

            if ((npage + 1) == dhbgApp.pages.length) {
                $('#main .btn_right .button').hide();
            }
            else {
                $('#main .btn_right .button').show();
            }

            var $new_page = $('.page.page_' + npage);

            if ($current_page.length > 0) {
                $current_page.hide(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function() {
                    $current_page.removeClass('current');

                    //Hack by multiple subpages selecteds in fast clicks
                    $('.page').hide();

                    $new_page.addClass('current');
                    $new_page.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                        dhbgApp.eachLoadPage($new_page);
                    });
                });
            }
            else {
                $new_page.show(dhbgApp.transition, dhbgApp.transitionOptions, dhbgApp.transitionDuration, function(){
                    dhbgApp.eachLoadPage($new_page);
                });
                $new_page.addClass('current');
            }

            if (dhbgApp.scorm) {
                dhbgApp.scorm.saveVisit(dhbgApp.scorm.indexPages[npage][nsubpage]);
            }

            dhbgApp.DB.currentSubPage = nsubpage;
            
            if (npage == dhbgApp.pagesNames['home']) {
                $('#home').hide();
            }
            else {
                $('#home').show();
            }
            //Actions in change page
            $.each(dhbgApp.actions.afterChangePage, function(i, v){
                v($new_page);
            });
        }
        dhbgApp.printNumberPage(npage, nsubpage);
    };

    dhbgApp.printNumberPage = function (page, subpage) {

        dhbgApp.printTitle();
        dhbgApp.printProgress();

        if (dhbgApp.scorm && dhbgApp.scorm.indexPages.length > page && dhbgApp.scorm.indexPages[page].length > subpage) {
            var current = dhbgApp.FULL_PAGES ? page : dhbgApp.scorm.indexPages[page][subpage];
            $('#page_number').text(current + 1);
        }
    };

    dhbgApp.eachLoadPage = function($new_subpage) {
        $new_subpage.find('img.animation').each(function () {
            var $this = $(this);
            var img_src = $this.attr('src');
            $this.attr('src', '');
            $this.attr('src', img_src + '?' + (new Date().getTime()));
        });
    };

    dhbgApp.rangerand = function(min, max, round){
        if (!min) {
            min = 0;
        }
        if (!max) {
            max = 1;
        }
        
        if (min >= max) {
            max = min + 1;
        }

        var num = (max - min) * Math.random() + min;
        return round ? Math.round(num) : num;
    };

    dhbgApp.debug = function(msg) {
        if (dhbgApp.DEBUG_MODE) {
            console.log(msg);
        }
    };

    dhbgApp.actions.activityQuiz = function ($this) {
        var questions = [], activityOptions = {};
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'quiz';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var feedbacktrue = '¡Muy bien! La respuesta es correcta.', feedbackfalse = 'La respuesta es incorrecta.';
        var html_body = $this.html();
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        var intro = $this.attr('data-intro') && $this.attr('data-intro') == 'false' ? false : true;

        activityOptions.shuffleQuestions = $this.attr('data-shuffle') && $this.attr('data-shuffle') != 'true' ? false : true;
        activityOptions.prefixType       = $this.attr('data-prefixtype') ? $this.attr('data-prefixtype') : jpit.activities.quiz.prefixes.none;
        activityOptions.requiredAll      = $this.attr('data-requiredall') && $this.attr('data-requiredall') != 'true' ? false : true;
        activityOptions.paginationNumber = $this.attr('data-paginationnumber') ? parseInt($this.attr('data-paginationnumber')) : 1;
        
        var count_questions = $this.find('question[type!="label"]').length;
        var question_weight = 100 / count_questions;
        
        $this.find('question').each(function(){
            var $question = $(this);
            var q;
            var question_options = {};
            var q_feedbacktrue = feedbacktrue, q_feedbackfalse = feedbackfalse;
            
             if ($question.find('feedback correct').text() != '') {
                q_feedbacktrue = $question.find('feedback correct').html();
             //  q_feedbacktrue = $question.find('feedback correct').html();
                //document.getElementById('w_content_controler');
              // $this.append ('<button class="w_content_controler"> </button>')
            //   $this.append ('<div class="w_content"> </div>').attr('data-content')
                 
            }

            if ($question.find('feedback wrong').text() != '') {
                q_feedbackfalse = $question.find('feedback wrong').html();
            }

            question_options.shuffleAnswers = $question.attr('data-shuffle') && $question.attr('data-shuffle') != 'true' ? false : true;
            question_options.prefixType = $question.attr('data-prefixtype') ? $question.attr('data-prefixtype') : jpit.activities.quiz.prefixes.capital;
            question_options.displayFeedback = true;
            question_options.feedbackIfTrue = q_feedbacktrue;
            question_options.feedbackIfFalse = q_feedbackfalse;
            question_options.weight = question_weight;

            switch($question.attr('type')) {
                case 'simplechoice':
                    var answers = [];
                    var $optionlist = $question.find('ul');
                    var correct = 0;
                    
                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        answers[answers.length] = $opt.html();
                        
                        if ($opt.attr('data-response') && $opt.attr('data-response') == 'true') {
                            correct = i;
                        }
                    });
                    
                    q = new jpit.activities.quiz.question.simplechoice($question.find('description').html(), answers, correct, question_options);
                    
                    break;
                case 'complete':
                    var $paragraph = $question.find('p.item');
                    var correct = 0;
                    
                    $paragraph.find('.answers li').each(function(i, v){
                        var $opt = $(this);
                        
                        if ($opt.attr('data-response') && $opt.attr('data-response') == 'true') {
                            correct = i;
                        }
                    });
                    
                    q = new jpit.activities.quiz.question.complete($question.find('description').html(), $paragraph, correct, question_options);
                    
                    break;
                case 'label':
                    var text = $question.find('text').html();
                    q = new jpit.activities.quiz.question.label($question.find('description').html(), text, question_options);
                    
                    break;
                case 'multichoice':
                    var answers = [];
                    var $optionlist = $question.find('ul');
                    var correct = [];

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        answers[answers.length] = $opt.html();

                        if ($opt.attr('data-response') && $opt.attr('data-response') == 'true') {
                            correct[correct.length] = i;
                        }
                    });

                    q = new jpit.activities.quiz.question.multichoice($question.find('description').html(), answers, correct, question_options);

                    break;
                case 'defineterm':
                    var terms = [];
                    var $optionlist = $question.find('ul');
                    var correct = [];

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        terms[terms.length] = $opt.html();
                        correct[correct.length] = $opt.attr('data-response');
                    });

                    question_options.caseSensitive = $question.attr('data-casesensitive') ? $question.attr('data-casesensitive') : false;
                    question_options.keySensitive = $question.attr('data-keysensitive') ? $question.attr('data-keysensitive') : false;
                    question_options.caseSensitive = $question.attr('data-casesensitive') ? $question.attr('data-casesensitive') : false;
                    q = new jpit.activities.quiz.question.defineterm($question.find('description').html(), terms, correct, question_options);

                    break;
                case 'multisetchoice':
                    var answers = [];
                    var $optionlist = $question.find('ul');
                    var correctkeys = [], correct = [];

                    $optionlist.find('li').each(function(i, v){
                        var $opt = $(this);
                        answers[answers.length] = $opt.html();

                        if (!correctkeys[$opt.attr('data-response')]) {
                            correctkeys[$opt.attr('data-response')] = [];
                        }
                        correctkeys[$opt.attr('data-response')].push(i);

                    });

                    for (var key in correctkeys) {
                        if (correctkeys.hasOwnProperty(key)) {
                            correct.push(correctkeys[key]);
                        }
                    }

                    q = new jpit.activities.quiz.question.multisetchoice($question.find('description').html(), answers, correct, question_options);

                    break;
            }
            
            questions[questions.length] = q;
        });
        
        //Dialogs
        var $dialog_answer_required = $('<div>Por favor, asigne una respuesta para continuar</div>').dialog({modal: true, autoOpen: false, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        var $box_presentation = $('<div class="box_presentation"></div>');
        var $box_questions = $('<div class="box_content"></div>');
        var $box_end = $('<div class="box_end" style="display:none"></div>');

        if (intro) {
            $box_questions.hide();
        }
        else {
            $box_presentation.hide();
        }

        var activity = new jpit.activities.quiz.activity($box_questions, questions, activityOptions);
        
        activity.verified = [];

        var $verify = $('<button class="button general">Verificar</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);
        $verify.on('click', function() { 
            // if it is not answered
            if(!activity.showPartialFeedback(activity.currentPagination)){
                $dialog_answer_required.dialog('open');
            }
            else{
                activity.verified[activity.currentPagination] = true;
                var lower=(activity.currentPagination*activity.paginationNumber)-activity.paginationNumber; // before question index
                var top=(activity.currentPagination*activity.paginationNumber); // next question index
                for(var i=lower; i<top; i++){
                    if(activity.finalQuestionList[i] != undefined) {
                        activity.finalQuestionList[i].showFeedback();
                        activity.finalQuestionList[i].disableQuestion(); // disable questions in current page
                    }
                }
                
                $(this).hide();

                //If all questions was answered
                if(activity.isFullAnswered()){
                    
                    for(var i = 0; i < activity.finalQuestionList.length; i++){
                        if(activity.finalQuestionList[i] != undefined && activity.finalQuestionList[i].isQualifiable()) {
                            activity.finalQuestionList[i].showFeedback();
                            activity.finalQuestionList[i].disableQuestion(); // disable questions in current page
                            activity.verified[i + 1] = true;
                        }
                    }
                    
                    var weight = Math.round(activity.getSolvedWeight());

                    if (dhbgApp.scorm) {
                        dhbgApp.scorm.activityAttempt(scorm_id, weight)
                    }
                    dhbgApp.printProgress();
                    var msg;
                    if (weight >= dhbgApp.evaluation.approve_limit) {
                        msg = '<div class="correct">¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!</div>';
                        if ($this.attr('data-feedback-dialog')) {
                            $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                            $dialog_feedback_correct.dialog('open');
                        }
                    }
                    else {
                        msg = '<div class="wrong">' + (100 - weight) + '% de sus respuestas son incorrectas. Lo invitamos a que repase el contenido e intente resolver la actividad de nuevo.</div>';

                        if ($this.attr('data-feedback-dialog')) {
                            $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                            $dialog_feedback_correct.dialog('open');
                        }
                    }
                    $box_end.empty();
                    $box_end.append(msg).show();
                    
                    if (weight < dhbgApp.evaluation.approve_limit) {
                        var $button_again = $('<button class="button general">Reiniciar la actividad</button>');
                        $button_again.on('click', function(){
                            $this.empty();
                            $this.html(html_body);
                            dhbgApp.actions.activityQuiz($this);
                            dhbgApp.actions.autoLoadSounds($this);
                            $('.jpit_activities_quiz_question_feedback_true').each(function(){
                                var $this = $(this);
                                
                                $this.prepend('<i class="ion-checkmark"></i>');
                            });
                            $('.jpit_activities_quiz_question_feedback_false').each(function(){
                                var $this = $(this);
                                
                                $this.prepend('<i class="ion-close"></i>');
                            });
                        });

                        $box_end.append($button_again)
                    }
                }
            }

        });

        var verify_display_function = function(){
            if (activity.verified[activity.currentPagination]) {
                $verify.hide();
            }
            else {
                $verify.show();
            };
            
            var lower=(activity.currentPagination*activity.paginationNumber)-activity.paginationNumber; // before question index
            var top=(activity.currentPagination*activity.paginationNumber); // next question index
            for(var i=lower; i<top; i++){
                if(activity.finalQuestionList[i] != undefined  && !activity.finalQuestionList[i].isQualifiable()) {
                    $verify.hide();
                }
            }

        };

        activity.container.find('.jpit_activities_quiz_paginator_previous').on('click', verify_display_function);
        activity.container.find('.jpit_activities_quiz_paginator_next').on('click', verify_display_function);
        
        var $verify_box = $('<div class="verify_box"></div>');
        $verify_box.append($verify);
        $box_questions.find('.jpit_activities_quiz_board').after($verify_box);
        
        $box_presentation.html($this.find('presentation').html());
        var $start = $('<button class="button general">Iniciar la actividad</button>');
        $start.on('mouseover', dhbgApp.defaultValues.buttonover);
        $start.on('mouseout', dhbgApp.defaultValues.buttonout);
        $start.on('click', function() {
            $box_presentation.hide();
            $box_questions.show(); 
            verify_display_function ();
        });

        $box_presentation.append($start);

        $this.empty();
        $this.append($box_presentation);
        $this.append($box_questions);
        $this.append($box_end);
        verify_display_function ();
    };

    dhbgApp.actions.autoLoadSounds = function ($parent) {

        $parent.find('[data-sound]').each(function(){
            var $this = $(this);
            
            var audio_src = $this.attr('data-sound');
            if (dhbgApp.DB.loadedSounds.length <= 0 && !dhbgApp.DB.loadedSounds[audio_src]) {
                var soundToLoad = document.createElement('audio');
                
                soundToLoad.setAttribute('src', 'content/sounds/' + audio_src + '.mp3');
                soundToLoad.setAttribute('id', audio_src);
                soundToLoad.load();
                
                document.body.insertBefore(soundToLoad, document.getElementById('body'));
                dhbgApp.DB.loadedSounds[audio_src] = true;
            }
            
            $this.on('click', function() {
                
               if($this.attr('object-guessing')){
                    $this.addClass('guessing-selected');
                    
                    $('.board-objects-to-guess .overlay').removeClass('overlay');
                }

                if (dhbgApp.DB.loadSound) {
                    dhbgApp.DB.loadSound.pause();
                    dhbgApp.DB.loadSound.currentTime = 0;
                }
                
                dhbgApp.DB.loadSound = document.getElementById( $this.attr('data-sound'));
                dhbgApp.DB.loadSound.setAttribute('autoplay', 'autoplay');
                $this.addClass("keypressed");
                setTimeout(function() {
                    $this.removeClass('keypressed');
                }, 1000);
                dhbgApp.DB.loadSound.pause();
                dhbgApp.DB.loadSound.currentTime = 0;
                dhbgApp.DB.loadSound.play();

                
                dhbgApp.DB.currentSoundActive = $this.attr('data-sound');

            });
            
            if($this.attr('data-mouseover') != undefined){
                $this.on('mouseover', function() {
                    
                    if (dhbgApp.DB.loadSound) {
                        dhbgApp.DB.loadSound.pause();
                        dhbgApp.DB.loadSound.currentTime = 0;
                    }
                    dhbgApp.DB.loadSound = document.getElementById( $this.attr('data-sound'));
                    
                    dhbgApp.DB.loadSound.pause();
                    dhbgApp.DB.loadSound.currentTime = 0;
                    dhbgApp.DB.loadSound.play();
                });
            }
        });
    };

    dhbgApp.actions.activityWordpuzzle = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'wordpuzzle';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_wordpuzzle_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Felicitaciones, ha completado la actividad de manera satisfactoria', feedbackfalse = 'Debe intentarlo nuevamente, hasta responder la actividad de manera correcta';
        var html_body = $this.html();
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        //Dialogs
        var $dialog_answer_required = $('<div>Necesita seleccionar una palabra de la lista para continuar</div>').dialog({modal: true, autoOpen: false, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        

        //Build the board
        var letters = '', letterslist = [], words = [], words_definition = [];
        $this.find('letters row').each(function(){
            letterslist[letterslist.length] = $(this).text();
        });
        
        letters = letterslist.join('|');

        var $box_words   = $('<div class="box_words"></div>');
        var $box_score   = $('<div class="box_score"><strong>Resultado: </strong><span class="result"></span></div>');
        var $box_end     = $('<div class="box_end" style="display:none"></div>');

        //build the word list, verify answers and show finalization dialog
        $this.find('.words li').each(function(){
            var $item = $(this);
            var term = $item.attr('data-term');
            var definition = $item.text();
            
            if (!term) {
                term = definition;
            }
            
            words[words.length] = new jpit.activities.wordpuzzle.word(term);
            words_definition[words_definition.length] = definition;
            
            var $control = $('<input type="radio" name="' + unique_id + '_control[]" value="' + (words.length - 1) + '" />');
            $item.prepend($control);
            
            $control.on('click', function(){

                //init verification
                activity.initTerm("jpit_activity_wordpuzzle_correct", $(this).val(), function(){
                    $item.addClass('selected');
                    $control.attr('disabled', 'disabled');
                    
                    $box_score.find('.result').text(activity.getTotalResult() + ' de ' + words.length);
                    
                    var weight = ((activity.getTotalResult()*100) / words.length);
                    if (weight >= dhbgApp.evaluation.approve_limit) {
                        var msg = '<div class="correct">' + feedbacktrue + '</div>';
                        
                        if ($box_end) {
                            $box_end.append(msg).dialog({modal: true, close: function(){ $box_end = null; }});
                        }

                        if (dhbgApp.scorm) {
                            dhbgApp.scorm.activityAttempt(scorm_id, weight);
                        }
                        dhbgApp.printProgress();
                    
                    }
                    
                });
            });
        });

        $box_score.find('.result').text('0 de ' + words.length);
        
        $box_words.append($this.find('.words'));
        
        var $box_content = $('<div class="box_content"></div>');
        activity = new jpit.activities.wordpuzzle.game(letters, $box_content, words, null, false);
        

        //Clean the container
        $this.empty();
        
        var $layout = $('<table class="layout"></table>');
        var $r1 = $('<tr></tr>'), $r2 = $('<tr></tr>');
        var $f1 = $('<td rowspan="2" class="board_content"></td>'), $f2 = $('<td class="word_content"></td>'), $f3 = $('<td class="score_content"></td>');
        
        $f1.append($box_content);

        $f2.append($box_words);
        $f3.append($box_score);
        
        $r1.append($f1);    
        $r1.append($f2);

        $r2.append($f3);

        $layout.append($r1);
        $layout.append($r2);
        
        $this.append($layout);
        $this.append('<br class="clear" />');
    };

    dhbgApp.actions.activityDroppable = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'droppable';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_droppable_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Felicitaciones, ha completado la actividad de manera satisfactoria', feedbackfalse = 'Intente de nuevo.';
        var html_body = $this.html();
        
        var helper = '';
        if ($this.attr('data-droppable-content-inner') && $this.attr('data-droppable-content-helper')) {
            helper = $this.attr('data-droppable-content-helper');
        }
        
        var $box_end = $this.find('.box_end');
        $box_end.hide();
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        $this.find('feedback').empty();

        //Dialogs
        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        var draggable_container = $this.attr('data-container') ? $(this).attr('data-container') : $('#middle');

        var activityOptions={
            'autoResolve': false,
            'continueResolve': false,
            'holdCorrects': false,
            'multiTarget': 1,
            'autoAlignNodes': true,
            'requiredAll': false,
            'required_all_pairs': true,
            'draggableContainer': draggable_container
        };

        var type_verification = $this.attr('data-verify-type') ? $this.attr('data-verify-type') : 'source';
        //Build the board
        var origins = [], targets = [], pairs = [],  pair_indexs = [], targets_multiple = [];

        var $data_target_group;
        
        var i = 0;
        var count_targets = 0;
        var dropped_corrects = 0;
        $this.find('[data-group]').each(function(){
            var $item = $(this);

            var item_html = $item.html();
            $item.empty();
            $item.append('<span class="draggable-span">' + item_html + '</span>');
            // $item.append('<i class="ion-arrow-move"></i>');
            $item.attr('id', unique_id + '_origin_' + i);
            $item.addClass('draggable');
            origins[origins.length] = $item;
            $data_target_group = $this.find('[data-target-group="' + $item.attr('data-group') + '"]');
            
            $this.find('[data-target-group="' + $item.attr('data-group') + '"]').each(function(){
                pairs[pairs.length] = {'origin': $item, 'target': $(this)};
            });

            i++;
        });

        $this.find('[data-target-group]').each(function(){
            var $item = $(this);
              $item.attr('id', unique_id + '_target_' + $item.attr('data-target-group'));
            
            if($this.find('[data-multiple-options]')) {
                $item.attr('id', unique_id + '_target_' + $item.attr('data-target-group') + '_' + dhbgApp.rangerand(0, 1000, true));    
            }
            else {
                $item.attr('id', unique_id + '_target_' + $item.attr('data-target-group'));                
            }             
            
            $item.addClass('droppable');
            targets[targets.length] = $item;
        });

        activity = new jpit.activities.droppable.board(activityOptions, origins, targets, pairs);

        $.each(origins, function(index, origin){
            origin.on('dragstop', function(event, ui){

                var end = type_verification == 'target' ? activity.isComplete() : activity.isFullComplete();
                var $droppable_dropped = $this.find('.jpit_activities_jpitdroppable_dropped');
                var $ui = $(this);
                if($ui.hasClass('jpit_activities_jpitdroppable_dropped')) {
                    var droppable_window = $("#" + $ui.attr('id') ).attr('data-content') ? $("#" + $ui.attr('id') ).attr('data-content') : false;
                    if(droppable_window){
                        $(droppable_window).dialog('open');
                    }
                }
                var weight = 0; 
                if (end) {
                    if($this.attr('data-multiple-options')) {
                        
                        var $droppables_dropped = $this.find('.jpit_activities_jpitdroppable_dropped');
                        $this.find('.jpit_activities_jpitdroppable_dropped').each(function(index, val){
                            var $dropped = $(this);
                            for(var i = 0; i < targets.length; i++){
                                if(targets[i].attr('data-target-group') == $dropped.attr('data-group')){
                                    dropped_corrects++;
                                    break;
                                }
                            }
                            
                        });
                        weight = Math.round(dropped_corrects * 100 / targets.length);
                    }
                    else {
                        weight = Math.round(activity.countCorrect() * 100 / pairs.length);
                    }
                    
                    var pair_length = $this.find('[data-multiple-options]') ? Math.round(pairs.length / activity.countCorrect()) : pair.length;
                    var count_correct = $this.find('[data-multiple-options]') ? Math.round(activity.countCorrect() / $data_target_group.length) : activity.countCorrect();

                    activity.disable();

                    if (dhbgApp.scorm) {
                        dhbgApp.scorm.activityAttempt(scorm_id, weight)
                    }
                    dhbgApp.printProgress();

                    var msg;
                    if (weight >= 99) {
                        msg = '<div class="correct">¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!</div>';
                        
                        if ($this.attr('data-feedback-dialog')) {
                            $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                            $dialog_feedback_correct.dialog('open');
                        }
                    }
                    else {
                        msg = '<div class="wrong">' + (100 - weight) + '% de sus respuestas son incorrectas. Lo invitamos a que repase el contenido e intente resolver la actividad de nuevo.</div>';

                        if ($this.attr('data-feedback-dialog')) {
                            $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                            $dialog_feedback_correct.dialog('open');
                        }
                    }

                    $box_end.append(msg).show();
                    
                    if (weight < 99) {
                        var $button_again = $('<button class="button general">Reiniciar la actividad</button>');
                        $button_again.on('click', function(){
                            $box_end.empty().hide();
                            $this.find('.draggable').removeClass('wrong');
                            $this.find('.draggable').removeClass('correct');
                            $this.find('.droppable').removeClass('wrong');
                            $this.find('.droppable').removeClass('correct');
                            
                            if ($this.attr('data-droppable-content-inner')) {
                                $this.find('.draggable').show();
                                $this.find('.droppable').html(helper);
                            }

                            activity.resetStage();
                        });
                        dropped_corrects = 0;
                        $box_end.append($button_again);
                    }
                    
                    $this.find('.draggable').addClass('wrong');
                    $this.find('.droppable').addClass('wrong');
                    var corrects = activity.getCorrects();
                    
                    if (corrects.length > 0) {
                        $.each(corrects, function(index, correct){
                            correct.o.removeClass('wrong');
                            correct.o.addClass('correct');
                            correct.t.removeClass('wrong');
                            correct.t.addClass('correct');
                        });
                    }
                }
            });
        });
        
        if ($this.attr('data-droppable-content-inner')) {
            $.each(targets, function(index, target){
                target.on('drop', function(event, ui){
                    ui.draggable.hide();
                    target.html(ui.draggable.html());
                });
            });
        }
    };

    dhbgApp.actions.activityMultidroppable = function ($this) {

        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'multidroppable';

        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_multidroppable_' + dhbgApp.rangerand(0, 1000, true);

        var $box_end = $this.find('.box_end');
        $box_end.hide();

        var $targets = $this.find( ".target" );
        $targets.sortable({
            revert: true
        });

        //Build the board
        var origins = [], targets = [], pairs = [],  pair_indexs = [];

        var i = 0;
        $this.find('[data-group]').each(function(){
            var $item = $(this);
            $item.attr('id', unique_id + '_origin_' + i);
            $item.addClass('draggable');
            origins[origins.length] = $item;

            $this.find('[data-target-group="' + $item.attr('data-group') + '"]').each(function(){
                pairs[pairs.length] = {'origin': $item, 'target': $(this)};
            });

            i++;
        }).draggable({
            containment: $this,
            zIndex: 2000,
            connectToSortable: $targets,
            revert: "invalid",
            start: function(event, ui) {
                $(this).addClass('jpit_activities_jpitdroppable_dragstart');
            },
            stop: function(event, ui) {
                $(this).removeClass('jpit_activities_jpitdroppable_dragstart');
            }
        });

        $this.find('[data-target-group]').each(function(){
            var $item = $(this);
            $item.attr('id', unique_id + '_target_' + $item.attr('data-target-group'));
            $item.addClass('droppable');
            targets[targets.length] = $item;
        }).droppable({
            drop: function( event, ui ) {
            },
            out: function(event, ui) {
            }
        });

        var $verify = $this.find('button.verify');
        var $continue = $this.find('button.continue');

        $verify.on('click', function () {
            var dropped = $this.find('.box_targets .draggable');

            if (dropped.length >= origins.length) {

                $this.find('[data-group]').draggable( "disable" );
                $targets.sortable( "disable" );

                var corrects = 0;
                $.each(targets, function(i, $k){
                    corrects += $k.find('[data-group="' + $k.attr('data-target-group') + '"]').addClass('correct disabled').length;
                    $k.find('[data-group!="' + $k.attr('data-target-group') + '"]').addClass('wrong disabled');
                });

                $(this).hide();

                var weight = Math.round(corrects * 100 / origins.length);

                if (dhbgApp.scorm && dhbgApp.scorm.lms) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight)
                }
                dhbgApp.printProgress();

                var msg;
                if (weight >= dhbgApp.evaluation.approve_limit) {
                    msg = '<div class="correct">¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!</div>';
                }
                else {
                    msg = '<div class="wrong">' + (100 - weight) + '% de sus respuestas son incorrectas. Lo invitamos a que repase el contenido e intente resolver la actividad de nuevo.</div>';
                }

                $box_end.append(msg).show();

                if (weight < dhbgApp.evaluation.approve_limit) {
                    $continue.show();
                }
            }
            else {
                $('<div>Por favor, arrastre todos los elementos a alguno de los destinos vÃ¡lidos</div>').dialog({modal: true, autoOpen: true, buttons: {'Ok': function() { $(this).dialog('close'); } } });
            }
        });

        $continue.on('click', function () {

            $box_end.empty().hide();
            $this.find('.draggable').removeClass('wrong').removeClass('correct').removeClass('disabled');

            $this.find('[data-group]').draggable( "enable" );
            $targets.sortable( "enable" );

            $continue.hide();
            $verify.show();
        });


        $this.find( ".draggable" ).disableSelection();
    };

    dhbgApp.actions.activityCrossword = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'crossword';
        
        if (dhbgApp.scorm && dhbgApp.scorm.lms) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_crossword_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Felicitaciones, ha completado la actividad de manera satisfactoria', feedbackfalse = 'Debe intentarlo nuevamente, hasta responder la actividad de manera correcta';

        var html_body = $this.html();
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        //Dialogs
        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        //Build the board
        var words = [];
        var i = 1;

        var $box_content = $('<div class="box_content"></div>');
        var $box_horizontal   = $('<ol class="box_words"></ol>');
        var $box_vertical   = $('<ol class="box_words"></ol>');
        var $box_end = $('<div class="box_end" style="display:none"></div>');

        $this.find('horizontal li').each(function(){
            var $word = $(this);
            var label = $word.attr('data-label') ? $word.attr('data-label') : i;
            
            words[words.length] = new jpit.activities.crossword.word($word.attr('data-term'), parseInt($word.attr('data-col')), parseInt($word.attr('data-row')), label, jpit.activities.crossword.directions.lr);
            
            $box_horizontal.append('<li>' + $word.text() + '</li>');
            i++;
        });
        
        $box_vertical.attr('start', i);
        
        $this.find('vertical li').each(function(){
            var $word = $(this);
            var label = $word.attr('data-label') ? $word.attr('data-label') : i;
            
            words[words.length] = new jpit.activities.crossword.word($word.attr('data-term'), parseInt($word.attr('data-col')), parseInt($word.attr('data-row')), label, jpit.activities.crossword.directions.tb);
            
            $box_vertical.append('<li>' + $word.text() + '</li>');
            
            i++;
        });

        var properties = {'caseSensitive':false};
        
        activity = new jpit.activities.crossword.game($box_content, words, properties);
        
        var $verify = $('<button class="button general">Verificar</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);

        $verify.on('click', function() { 
            $verify.hide();

            var words_size = i - 1;
            var weight = Math.round(activity.getTotalResult() * 100 / words_size);

            if (dhbgApp.scorm) {
                dhbgApp.scorm.activityAttempt(scorm_id, weight)
            }
            dhbgApp.printProgress();
                    
            var msg;
            if (weight >= dhbgApp.evaluation.approve_limit) {
                msg = '<div class="correct">¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!</div>';
                
                if ($this.attr('data-feedback-dialog')) {
                    $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                    $dialog_feedback_correct.dialog('open');
                }
            }
            else {
                msg = '<div class="wrong">' + (100 - weight) + '% de sus respuestas son incorrectas. Lo invitamos a que repase el contenido e intente resolver la actividad de nuevo.</div>';

                if ($this.attr('data-feedback-dialog')) {
                    $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                    $dialog_feedback_correct.dialog('open');
                }
            }
            $this.find('.box_end').append(msg).show();
            
            activity.stop();
            activity.highlight('correct','wrong');

            if (weight < dhbgApp.evaluation.approve_limit) {
                var $button_again = $('<button class="button general">Reiniciar la actividad</button>');
                $button_again.on('click', function(){
                    $box_end.empty();
                    $box_end.hide();
                    activity.unHighlight('correct');
                    activity.unHighlight('wrong');
                    activity.run();
                    $verify.show();
                });

                $this.find('.box_end').append($button_again)
            }
        });    

        var $box_verify = $('<div class="verify_container"></div>');
        $box_verify.append($verify);
        $box_content.append($box_verify);
        
        //Clean the container and print layout
        $this.empty();
            
        var $layout = $('<table class="layout"></table>');
        var $r1 = $('<tr></tr>'), $r2 = $('<tr></tr>');
        var $f1 = $('<td rowspan="2" class="board_content"></td>'), $f2 = $('<td class="word_content"></td>'), $f3 = $('<td class="word_content"></td>');
        
        $f1.append($box_content);

        $f2.append('<h5>Horizontal</h5>');
        $f3.append('<h5>Vertical</h5>');

        $f2.append($box_horizontal);
        $f3.append($box_vertical);
        
        $r1.append($f1);    
        $r1.append($f2);

        $r2.append($f3);

        $layout.append($r1);
        $layout.append($r2);
        
        $this.append($layout);
        $this.append($box_end);
        $this.append('<br class="clear" />');
        
        activity.run();

        $box_content.find('input:first').focus(); //focus in first field

    };

    dhbgApp.actions.activityCloze = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'cloze';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_cloze_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Felicitaciones, ha completado la actividad de manera satisfactoria', feedbackfalse = 'Debe intentarlo nuevamente, hasta responder la actividad de manera correcta';

        var html_body = $this.html();
        var $box_end = $this.find('.box_end');
        $box_end.hide();
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        //Dialogs
        var $dialog_answer_required = $('<div>Por favor, llene todos los espacios en blanco para continuar</div>').dialog({modal: true, autoOpen: false, buttons: {'Ok': function() { $(this).dialog('close'); } } });

        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        //Build the board
        var words = [];
        var i = 1;

        activity = new jpit.activities.cloze.activity($this);
        
        var $verify = $('<button class="button general">Verificar</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);

        $verify.on('click', function() { 
            if (!activity.fullAnswered()){
                $dialog_answer_required.dialog('open');
            }
            else {
                $verify.hide();

                var weight = Math.round(activity.weight());

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight)
                }
                dhbgApp.printProgress();
                    
                var msg;
                if (weight >= dhbgApp.evaluation.approve_limit) {
                    msg = '<div class="correct">¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!</div>';
                    
                    if ($this.attr('data-feedback-dialog')) {
                        $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                        $dialog_feedback_correct.dialog('open');
                    }
                }
                else {
                    msg = '<div class="wrong">' + (100 - weight) + '% de sus respuestas son incorrectas. Lo invitamos a que repase el contenido e intente resolver la actividad de nuevo.</div>';

                    if ($this.attr('data-feedback-dialog')) {
                        $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                        $dialog_feedback_correct.dialog('open');
                    }
                }
                $box_end.append(msg).show();
                
                activity.disable();
                activity.highlight('correct', 'wrong');

                if (weight < dhbgApp.evaluation.approve_limit) {
                    var $button_again = $('<button class="button general">Continuar con la actividad</button>');
                    $button_again.on('click', function(){
                        $box_end.empty();
                        $box_end.hide();
                        $this.find('.correct').removeClass('correct');
                        $this.find('.wrong').removeClass('wrong');
                        activity.enable();
                        $verify.show();
                    });

                    $box_end.append($button_again);
                }
            }
        });    

        var $box_verify = $('<div class="verify_container"></div>');
        $box_verify.append($verify);
        $this.append($box_verify);

    };

    dhbgApp.actions.activityGuessing = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'guessing';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_guessing_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Felicitaciones, ya identificas los sonidos de las notas naturales y alteradas, incluyendo sus enarmónicos.', feedbackfalse = 'Aún necesitas practicar más.  Retoma la lectura de los documentos de estudio y realiza las actividades propuestas.  ¡Ánimo!';

        var html_body = $this.html();
        var $box_end = $this.find('.box_end');
        $box_end.hide();
        
        //Build the board
        var corrects = 0;
        var wrongs = 0;
        var i = 0;
        activity = new jpit.activities.guessing.activity($this);
        
        var $board_to_guess = $('<div class="board-to-guess"></div>');
        var $options_guessing = $this.find('.option-in-guessing');
        var $object_to_display = $('.object-to-guess').first().css("display", "inherit");
        activity.limitCorrects = $this.attr('data-limit-corrects') ? $this.attr('data-limit-corrects') : $options_guessing.length;
        activity.limitWrongs = $this.attr('data-limit-corrects') ? $this.attr('data-limit-wrongs') : $options_guessing.length;
        var calculatedWeight = 0;
        var generated_id;
        var object_guessing_ids = [$options_guessing.length];
        object_guessing_ids.fill(0);
        
        $('.board-objects-to-guess').prepend('<div class="cover overlay"></div>');
        $this.append('<div class="guessing-results box_connection gold"><div class="guessing-result-corrects"><h3>Aciertos</h3><p>0</p></div><div class="guessing-result-wrongs"><h3>Desaciertos</h3><p>0</p></div></div>');
        $options_guessing.each(function () {
            var $option_guessing = $(this);
            
            var $object_to_guess = $('<div class="object-to-guess iconsound button ion-volume-high" style="display: none;"></div>');
            generated_id = Math.floor(Math.random() * ($options_guessing.length)) + 1;
            while($.inArray(generated_id, object_guessing_ids) != -1  && i < $options_guessing.length) {
                generated_id = Math.floor(Math.random() * ($options_guessing.length)) + 1;
            }
            object_guessing_ids[i] = generated_id;
            
            $object_to_guess.attr('id', 'guessing_' + object_guessing_ids[i]);
            $option_guessing.attr('data-matching', 'guessing_' + object_guessing_ids[i]);
            
            
            if($option_guessing.attr('data-sound') !== 'undefined') {
                $object_to_guess.attr('data-sound', $option_guessing.attr('data-sound'));
                
                $board_to_guess.append($object_to_guess);
            }
            
            i++;
        });
        
        $options_guessing.on('click', function(){
            var $option_guessing = $(this);
            
            if($option_guessing.attr('data-matching') == $object_to_display.attr('id')){
                $option_guessing.addClass('matched');
                activity.highlight($option_guessing, true, 'matched', 'dont-matched');
                activity.corrects++;
                $('.guessing-result-corrects').html('<h3>Aciertos</h3><p>' + activity.corrects + '</p>');
                
            }
            else{
                $option_guessing.addClass('dont-matched');
                activity.highlight($option_guessing, false, 'matched', 'dont-matched');
                var $object_correct_matched = $("div[data-matching='" + $object_to_display.attr('id') + "']" );
                $object_correct_matched.addClass('matched');
                activity.highlight($object_correct_matched, true, 'matched', 'dont-matched');
                activity.wrongs++;
                $('.guessing-result-wrongs').html('<h3>Desaciertos</h3><p>' + activity.wrongs + '</p>');
            }

            if(activity.isEnded()){
                calculatedWeight = activity.weight();
                
                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, calculatedWeight)
                }
                
                var msg;
                if (calculatedWeight >= dhbgApp.evaluation.approve_limit) {
                    msg =  '<div class="correct">' + feedbacktrue + '</div>';
                }
                else {
                    msg = '<div class="wrong">' + calculatedWeight + '% de sus respuestas son correctas. ' + feedbackfalse + '</div>';
                }
                $box_end.append(msg).show();
                
                if (calculatedWeight < dhbgApp.evaluation.approve_limit) {
                    
                    var $button_again = $('<button class="button general">Intentar de nuevo</button>');
                    $button_again.on('click', function(){
                        $box_end.empty();
                        $box_end.hide();
                        $this.find('.correct').removeClass('correct');
                        $this.find('.wrong').removeClass('wrong');
                        activity.disable();
                        
                        activity.wrongs = 0;
                        activity.corrects = 0;
                        $('.guessing-result-corrects').html('<h3>Aciertos</h3><p>' + activity.corrects + '</p>');
                        $('.guessing-result-wrongs').html('<h3>Desaciertos</h3><p>' + activity.wrongs + '</p>');
                    });

                    $box_end.append($button_again);
                }
            }
            
            $('.object-to-guess').css("display", "none");
            
            generated_id = Math.floor(Math.random() * ($options_guessing.length)) + 1;
            $object_to_display = $('#guessing_' + generated_id);
            $object_to_display.attr("object-guessing", "selected");
            $object_to_display.css("display", "inherit");
            $('.option-in-guessing').attr('disabled','disabled');
            activity.disable('overlay');
        });

        $this.append($board_to_guess);

        generated_id = Math.floor(Math.random() * ($options_guessing.length)) + 1;
        $object_to_display = $('#guessing_' + generated_id);
        $object_to_display.attr("object-guessing", "selected");
        $object_to_display.css("display", "inherit");
    };
    
    dhbgApp.actions.activitySortable = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'sortable';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_sortable_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Felicitaciones, ha completado la actividad de manera satisfactoria', feedbackfalse = 'Debe intentarlo nuevamente, hasta responder la actividad de manera correcta';
        var html_body = $this.html();
        var $box_end = $this.find('.box_end');
        $box_end.hide();
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }

        //Dialogs
        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        //Build the board

        activity = new jpit.activities.sortable.activity($this);
        
        var $verify = $('<button class="button general">Verificar</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);

        $verify.on('click', function() { 
            $verify.hide();

            var weight = Math.round(activity.weight());

            if (dhbgApp.scorm) {
                dhbgApp.scorm.activityAttempt(scorm_id, weight)
            }
            dhbgApp.printProgress();
                    
            var msg;
            if (weight >= dhbgApp.evaluation.approve_limit) {
                msg = '<div class="correct">¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!</div>';
                
                if ($this.attr('data-feedback-dialog')) {
                    $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                    $dialog_feedback_correct.dialog('open');
                }
            }
            else {
                msg = '<div class="wrong">' + (100 - weight) + '% de sus respuestas son incorrectas. Lo invitamos a que repase el contenido e intente resolver la actividad de nuevo.</div>';

                if ($this.attr('data-feedback-dialog')) {
                    $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                    $dialog_feedback_correct.dialog('open');
                }
            }
            $box_end.append(msg).show();
            
            activity.disable();
            activity.highlight('correct', 'wrong');

            if (weight < dhbgApp.evaluation.approve_limit) {
                var $button_again = $('<button class="button general">Continuar con la actividad</button>');
                $button_again.on('click', function(){
                    $box_end.empty();
                    $box_end.hide();
                    $this.find('.correct').removeClass('correct');
                    $this.find('.wrong').removeClass('wrong');
                    activity.enable();
                    $verify.show();
                });

                $box_end.append($button_again);
            }

        });    

        var $box_verify = $('<div class="verify_container"></div>');
        $box_verify.append($verify);
        $this.append($box_verify);

    };

    dhbgApp.actions.activityMark = function ($this) {
        
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'mark';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_mark_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = null, feedbackfalse = null;
        var html_body = $this.html();
        var $box_verify = $('<div class="verify_container"></div>');
        var $box_end = $('<div class="box_end"></div>');
        $box_end.hide();
        $box_verify.append($box_end);
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }
        
        $this.find('feedback').empty();

        //Dialogs
        var $dialog_answer_required = $('<div>Necesitas marcar por lo menos una zona para continuar.</div>').dialog({modal: true, autoOpen: false, buttons: {'Aceptar': function() { $(this).dialog('close'); } } });

        var $dialog_feedback_correct = $('#congratulations_unit').dialog({modal: true, autoOpen: false, width: 900, buttons: {'Ok': function() { $(this).dialog('close'); } } });
        
        //Build the board
        var words = [];
        var i = 1;
        
        var mark_type = $this.attr('data-mark-type') ? $this.attr('data-mark-type') : 'rectangle';

        activity = new jpit.activities.mark.activity($this, mark_type);
        
        var $verify = $('<button class="button general">Verificar</button>');
        $verify.on('mouseover', dhbgApp.defaultValues.buttonover);
        $verify.on('mouseout', dhbgApp.defaultValues.buttonout);

        $verify.on('click', function() { 
            if (!activity.fullAnswered()){
                $dialog_answer_required.dialog('open');
            }
            else {
                $verify.hide();

                var weight = Math.round(activity.weight());

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight)
                }
                dhbgApp.printProgress();
                    
                var msg, feedback;
                if (weight >= 100) {
                    if (feedbacktrue == null) {
                        feedback = '¡Muy bien! ' + weight + '% de sus respuestas son correctas. ¡Felicitaciones!';
                    }
                    else {
                        feedback = feedbacktrue;
                    }

                    msg = '<div class="correct">' + feedback + '</div>';
                    
                    if ($this.attr('data-feedback-dialog')) {
                        $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                        $dialog_feedback_correct.dialog('open');
                    }
                    
                    $this.data('finished', true);
                }
                else {
                    if (feedbackfalse == null) {
                        feedback = 'La actividad es incorrecta en un ' + (100 - weight) + '%. Continua la actividad hasta completarla correctamente.';
                    }
                    else {
                        feedback = feedbackfalse;
                    }


                    msg = '<div class="wrong">' + feedback + '</div>';

                    if ($this.attr('data-feedback-dialog')) {
                        $dialog_feedback_correct.find('.subtitle_welcome').html(msg);
                        $dialog_feedback_correct.dialog('open');
                    }
                
                    $this.data('finished', false);
                }
                $box_end.append(msg).show();
                
                activity.disable();
                activity.highlight('correct', 'wrong');

                if (weight < 100) {
                    var $button_again = $('<button class="button general">Continuar con la actividad</button>');
                    $button_again.on('click', function(){
                        $box_end.empty();
                        $box_end.hide();
                        $this.find('.correct').removeClass('correct');
                        $this.find('.wrong').removeClass('wrong');
                        activity.enable();
                        $verify.show();
                    });

                    $box_end.append($button_again);
                }
            }
        });    

        $box_verify.append($verify);
        $this.append($box_verify);

    };

    dhbgApp.actions.activityCheck = function ($this) {
        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'check';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var words = [];
        $this.find('words li').each(function (k, word) {
            var $word = $(word);
            var value = $word.attr('data-val') && $word.attr('data-val') == 'true';
            words[words.length] = new jpit.activities.check.word($word.html(), value);
        });

        $this.find('words').empty();

        var properties = {
            "onfinished": function (a) {
                var weight = Math.round(a.countCorrect() * 100 / a.words.length);

                if (a.finishedAll()){
                    weight = 100;
                }

                if (dhbgApp.scorm) {
                    dhbgApp.scorm.activityAttempt(scorm_id, weight);
                }
                dhbgApp.printProgress();
            }
        };

        //Build the board
        var activity = new jpit.activities.check.init($this, words, properties);

    };

    dhbgApp.actions.activityForm = function ($this) {
        
        var printable = $this.attr('data-print');
        var can_save = $this.attr('data-save');

        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'form';
        
        if (dhbgApp.scorm && can_save) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        var activity;
        var unique_id = 'activity_form_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = 'Todos los campos han sido diligenciados.', feedbackfalse = 'Debe diligenciar todos los campos.';
        
        if ($this.find('feedback correct').text() != '') {
            feedbacktrue = $this.find('feedback correct').html();
        }
        
        if ($this.find('feedback wrong').text() != '') {
            feedbackfalse = $this.find('feedback wrong').html();
        }
        
        $this.find('feedback').empty();
        
        //Dialogs
        var $dialog_answer_required = $('<div>' + feedbackfalse + '</div>').dialog({modal: true, autoOpen: false, buttons: {'Aceptar': function() { $(this).dialog('close'); } } });
        
        var $dialog_save_error = $('<div>No se ha podido guardar la información, por favor verifique su conexión a Internet e intente de nuevo más tarde.</div>').dialog({modal: true, autoOpen: false, buttons: {'Aceptar': function() { $(this).dialog('close'); } } });
        
        var $dialog_saved = $('<div>Se ha guardado la información correctamente</div>').dialog({modal: true, autoOpen: false, buttons: {'Aceptar': function() { $(this).dialog('close'); } } });

        //Build the board
        activity = new jpit.activities.form.init($this);
        
        var $buttons = $('<div class="button_container"></div>');

        if (printable) {
            var $print = $('<button class="button general">Vista de impresión</button>');
            $print.on('mouseover', dhbgApp.defaultValues.buttonover);
            $print.on('mouseout', dhbgApp.defaultValues.buttonout);
            $buttons.append($print);
            
            $print.on('click', function() { 
                if (!activity.fullAnswered()){
                    $dialog_answer_required.dialog('open');
                }
                else {
                    $('body').addClass('print_mode');
                    $('#printent_content').show();
                    $('#printent_content div.content').append(activity.printableContent());
                }
            });
        }

        if (can_save && typeof dhbgApp.scorm == 'object' && dhbgApp.scorm.lms) {
            var $save = $('<button class="button general">Guardar</button>');
            $save.on('mouseover', dhbgApp.defaultValues.buttonover);
            $save.on('mouseout', dhbgApp.defaultValues.buttonout);
            $buttons.append($save);

            //Load current values, if exists
            var scorm_value = dhbgApp.scorm.getActivityValue(scorm_id);

            if (typeof scorm_value == 'string') {
                var unserialize_data = window.atob(scorm_value);
                activity.load_serialized(unserialize_data);
            }
            
            $save.on('click', function() { 
                if (!activity.fullAnswered()){
                    $dialog_answer_required.dialog('open');
                }
                else {
                    var serialize_data = activity.serialize();
                    var encode_serialize_data = window.btoa(serialize_data);
                    dhbgApp.scorm.activityAttempt(scorm_id, 100, 0);
                    dhbgApp.printProgress();

                    if (dhbgApp.scorm.setActivityValue(scorm_id, encode_serialize_data)) {
                        $dialog_saved.dialog('open');
                    }
                    else {
                        $dialog_save_error.dialog('open');
                    }
                }
            });
        }
        
        if($this.find('.see_more').length > 0){
            var $button_feedback = $this.find('.see_more');
            $buttons.append($button_feedback);
        }

        $this.append($buttons);

    };

    dhbgApp.actions.activityMemory = function ($this) {

        var scorm_id = $this.attr('data-act-id') ? $this.attr('data-act-id') : 'memory';
        
        if (dhbgApp.scorm) {
            if (!dhbgApp.scorm.activities[scorm_id]) { dhbgApp.scorm.activities[scorm_id] = []; }
        }

        $this.prepend('<div class="cover"></div>');

        $( ".pit-activities-memory ol" ).selectable({
            selected: function( event, ui ) {}
        });

        var activity;
        var unique_id = 'activity_memory_' + dhbgApp.rangerand(0, 1000, true);
        var feedbacktrue = '¡Felicitaciones! has completado la actividad satisfactoriamente.', feedbackfalse = 'Aún necesitas practicar más.  Retoma la lectura de los documentos de estudio y realiza las actividades propuestas.  ¡Ánimo!';

        var $box_score   = $('<div class="box_score"><strong>Avance: </strong><span class="result"></span></div>');

        var html_body = $this.html();
        var $box_end = $this.find('.box_end');
        $box_end.hide();

        var wrongs = 0;
        var calculatedWeight = 0;
        activity = new jpit.activities.memory.game($this);

        var i = 0;
        var $li_array = $this.find('li')
        if($this.attr('data-cover-back')){
            $li_array.each(function(){
                var $li = $(this);
                $li.css('background', 'url("' + $this.attr('data-cover-back') + '")');
                var generated_id = activity.generateElementId($li_array, i);

                activity.generated_ids[generated_id] = generated_id;

                $li.attr('id', 'memory_' + generated_id );

                var group_match = $li.attr('data-group-match') ? $li.attr('data-group-match') : -1;
                var data_first = $li.attr('group_match') ? $li.attr('group_match') : false;

                activity.matched_elements['memory_' + generated_id] = {
                  index : generated_id,
                  id: 'memory_' + generated_id,
                  dataGroup: group_match,
                  matched: false,
                  selected: false,
                  first: data_first
                };

                i++;

            });
        }

        var ids_length = activity.generated_ids.length - 1;
        $box_score.find('.result').text('0 % ');

        $( ".pit-activities-memory ol" ).on('selectableselected', function( event, ui){
            var $li_selected = $(ui.selected);

            if(!activity.matched_elements[$li_selected.attr('id')].matched && !activity.matched_elements[$li_selected.attr('id')].selected){
                activity.matched_elements[$li_selected.attr('id')].selected = true;
                $li_selected.addClass('memory-game-matched');
                activity.selected_elements_ids[activity.selected_elements_counter] = $li_selected.attr('id');
                $li_selected.css('background', 'url("' + $li_selected.attr('data-cover-forward') + '")');
                activity.data_group_match[activity.selected_elements_counter] = activity.matched_elements[activity.selected_elements_ids[activity.selected_elements_counter]].dataGroup;
                activity.selected_elements_counter++;
                
                if(activity.selected_elements_counter == 2){
                    activity.disableBoard('overlay');
                    
                    setTimeout(function(){
                        activity.enableBoard();
                        if(activity.data_group_match[0] != activity.data_group_match[1]){
                            activity.processElementsNotMatched(activity.selected_elements_ids);
                        }
                        else{
                            activity.processElementsMatched(activity.selected_elements_ids);

                            var memory_window = $("#" + activity.selected_elements_ids[0] ).attr('data-content') ? $("#" + activity.selected_elements_ids[0] ).attr('data-content') : false;
                            if(memory_window){
                                $(memory_window).dialog('open');
                            }
                            activity.matched_elements_counter += 2;
                            
                            var calculatedWeight = activity.calculateWeight();

                            $box_score.find('.result').text(calculatedWeight + ' % ');
                            
                            if(activity.isEnded($li_array)){
                                
                                if (dhbgApp.scorm) {
                                    dhbgApp.scorm.activityAttempt(scorm_id, calculatedWeight)
                                }
                                
                                var msg;
                                if (calculatedWeight >= dhbgApp.evaluation.approve_limit) {
                                    msg =  '<div class="correct">' + feedbacktrue + '</div>';
                                }
                                else {
                                    msg = '<div class="wrong">' + calculatedWeight + '% de sus respuestas son correctas. ' + feedbackfalse + '</div>';
                                }
                                
                                $box_end.append(msg).show();

                            }
                        }
                    }, 500);
                    activity.selected_elements_counter = 0;
                }
                
            }
        });
        
        $this.append($box_score);
        
    };
    
    var $main_menu = $('#main_menu');
    var menu_offset = $main_menu.offset().top + $main_menu.height();

    $( window ).bind("scroll", function() {
        var offset = $(this).scrollTop();

        if (offset >= menu_offset) {
            $main_menu.addClass('scroll_top');
        }
        else if (offset < menu_offset) {
            $main_menu.removeClass('scroll_top');
        }
    });

};


//About: http://stackoverflow.com/questions/1359761/sorting-a-javascript-object-by-property-name
dhbgApp.sortObjectByProperty = function (o) {
    var sorted = {}, key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
};