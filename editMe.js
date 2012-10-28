/**
 * @author Mesa (Daniel Langemann)
 **/
(function( $ ){
    var items = new Array();
    var settings = {
        "started" : false
    }
    var events = new Object();
    var methods = {
        init : function( options ) {

            var newItem;
            var config = $.extend({
                'target_url' :"",
                'css_highlight_class' : "edit-me-highlight",
                'edit_btn_id':"edit-me-btn-edit",
                'cancel_btn_id': "edit-me-btn-cancel",
                'save_btn_id':"edit-me-btn-save",
                'callBack'     : '',
                'edit_btn_txt' :  "Edit",
                'cancel_btn_txt': "Cancel",
                'save_btn_txt' :  "Save"
            }, options);

            /**
             * Create only once all buttons and eventlistener
             */
            if ( settings.started == false) {
                var save_btn = $("#" + config.save_btn_id);
                var edit_btn = $("#" + config.save_btn_id);
                var cancel_btn = $("#" + config.cancel_btn_id);

                if ( save_btn.length == 0 || edit_btn.length == 0 || cancel_btn.length == 0) {
                    if ( typeof config.menu_target_id !== undefined) {
                        var menu_target = $("#" + config.menu_target_id);
                        menu_target.append(
                            "<button id=\"" + config.edit_btn_id + "\">" + config.edit_btn_txt + "</button>\
                        <button id=\"" + config.save_btn_id + "\">" + config.save_btn_txt + "</button>\
                        <button id=\"" + config.cancel_btn_id + "\">" + config.cancel_btn_txt + "</button>"
                            );
                    }
                }
                save_btn = $("#" + config.save_btn_id);
                edit_btn = $("#" + config.edit_btn_id);
                cancel_btn = $("#" + config.cancel_btn_id);

                save_btn.click( function (){
                    methods.notify("save");
                });
                edit_btn.click( function (){
                    methods.notify("active");
                });
                cancel_btn.click( function (){
                    methods.notify("standby");
                });

                settings.save_btn_id = config.save_btn_id;
                settings.edit_btn_id = config.edit_btn_id;
                settings.cancel_btn_id = config.cancel_btn_id;

                methods.observe("ready", methods.hideButtons);
                methods.observe("active", methods.showButtons);
                methods.observe("active", methods.activate);
                methods.observe("standby", methods.cancel);
                methods.observe("save", methods.save);
                methods.observe("standby", methods.hideButtons);
                methods.observe("save", methods.hideButtons);

                methods.notify("ready");
                settings.started = true;
            }

            newItem = new editMeObj( this, config );
            newItem.setTargetUrl(config.target_url);
            newItem.init();
            items.push( newItem );
            return this;
        },

        activate: function() {
            for ( var i = 0; i < items.length; i++) {
                items[i].activate();
            }
        },
        cancel: function() {
            for ( var i = 0; i < items.length; i++) {
                items[i].cancel();
            }
        },
        save: function() {
            for ( var i = 0; i < items.length; i++) {
                items[i].save();
            }
        },
        showButtons: function () {
            $("#" + settings.edit_btn_id).hide();
            $("#" + settings.save_btn_id).show();
            $("#" + settings.cancel_btn_id).show();
        },
        hideButtons: function () {
            $("#" + settings.edit_btn_id).show();
            $("#" + settings.save_btn_id).hide();
            $("#" + settings.cancel_btn_id).hide();
        },
        observe : function ( event, callBack ) {
            if ( events[event] == undefined) {
                events[event] = new Array();
            }
            events[event].push(callBack);
        },
        notify : function ( event, args ) {
            if (undefined !== events[event] && typeof events[event] == "object" ) {

                for ( var i = 0; i < events[event].length; i++) {
                    callback = events[event][i];
                    if ( callback != undefined && typeof callback == 'function') {
                        callback( event, args );
                    }
                }
            }
        }
    };

    $.fn.editMe = function( method ) {

        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }

    };

})( jQuery );

var tabindex = 1;
function editMeObj ( objects, options ) {
    var target_url;
    var items = objects;
    var groups = new Array();
    var data = new Array();

    this.init = function () {
        if ( items.length == 0) {
            return
        };
        var self = this;

        items.each( function (){
            var childNodes = $(this).find("[data-name]");
            var input = new Array();

            if (childNodes.length > 0 ) {
                childNodes.each( function (){
                    input.push( self.buildInput($(this), options, tabindex++) );
                });
            } else {
                input.push( self.buildInput($(this), options, tabindex++) );
            }

            groups.push(  input );
        });

    }

    this.buildInput = function ( item, options, index) {
        var name = item.data("name");
        if ( typeof options[name] == "undefined" || typeof options[name].type  == "undefined") {
            return new editMeInput( item, options, index );
        }

        if ( options[name].type  == "autocomplete" ) {
            return new editMeAutocomplete( item, options, index);
        }

        if ( options[name].type  == "datepicker" ) {
            return new editMeDatepicker( item, options, index);
        }

        alert("No type selected");
    }

    this.activate = function () {
        if ( items.length == 0) {
            return
        };

        for (var i = 0; i < groups.length; i++) {
            for (var z = 0; z < groups[i].length; z++) {
                groups[i][z].activate();
            }
        }
    }

    this.cancel = function () {
        if ( items.length == 0) {
            return;
        };
        for (var i = 0; i < groups.length; i++) {
            for (var z = 0; z < groups[i].length; z++) {
                groups[i][z].standby();
                groups[i][z].reset();
            }
        }
    }

    this.save = function () {
        if ( items.length == 0) {
            return;
        };
        var group_data = new Array();

        for (var i = 0; i < groups.length; i++) {
            var row_data = new Object();
            var counter=0;

            for (var z = 0; z < groups[i].length; z++) {
                var field = groups[i][z];

                if ( field.has_changed() ) {
                    row_data[field.getName()] = field.getValue();
                    if (!field.is_readonly()) {
                        counter++;
                    }
                }
                field.standby();
            }

            if ( counter > 0) {
                group_data.push(row_data);
            }
        }

        if ( group_data.length > 0) {
            $.post( target_url, {
                data: group_data
            }, function ( data ) {
                if ( data.status != 200) {
                    alert("I'am sorry but something went wrong")
                }
            }, "json")
        }
    }

    this.getItems = function () {
        return items;
    }

    this.setTargetUrl = function( url ) {
        target_url = url;
    }

    this.getTargetUrl = function () {
        return target_url;
    }
}

function editMeInput ( object, options, index )
{
    var item = object;
    var oldData;
    var css_class = options.css_highlight_class
    var readonly = false;
    var tabindex = index;

    this.is_readonly = function () {
        if (typeof item.data("readonly") != "undefined") {
            return true
        } else {
            return false;
        }
    }

    this.has_changed = function () {
        if ( oldData != this.getValue() ) {
            return true;
        } else {
            return false;
        }
    }

    this.getName = function () {
        return item.data("name");
    }

    this.getValue = function () {
        if (this.is_readonly() || typeof options.callback == "undefined") {
            return item.text();
        }

        var user_func = options.callback[this.getName()];
        if ( typeof options.callback == "object" && typeof user_func != "undefined") {
            return user_func( item.text() );
        }

        if ( typeof options.callback == "function" ) {
            user_func = options.callback
            return user_func( item.text() );
        }

        return item.text();
    }

    this.activate = function ()
    {
        if ( this.is_readonly() || typeof item.data("name") == "undefined") {
            return
        }

        if (typeof oldData == "undefined") {
            oldData = item.text();
            item.attr("tabindex", tabindex);
        }

        item.addClass(css_class, 500).attr("contenteditable", true);
        return this;
    }

    this.standby = function ()
    {
        if ( this.is_readonly() ) {
            return
        }

        if ( this.has_changed() ) {
            item.text( this.getValue() )
        }

        item.removeClass(css_class, 500).attr("contenteditable", false);
        return this;
    }

    this.reset = function ()
    {
        if ( this.is_readonly()) {
            return
        }

        if ( this.has_changed() ) {
            item.text( oldData );
        }

        return this;
    }

}

function editMeAutocomplete ( object, options, index )
{
    var item = object;
    var oldData;
    var css_class = options.css_highlight_class
    var readonly = false;
    var tabindex = index;

    this.is_readonly = function () {
        if (typeof item.data("readonly") != "undefined") {
            return true
        } else {
            return false;
        }
    }

    this.has_changed = function () {
        if ( oldData != this.getValue() ) {
            return true;
        } else {
            return false;
        }
    }

    this.getName = function () {
        return item.data("name");
    }

    this.getValue = function () {
        if (this.is_readonly() || typeof options.callback == "undefined") {
            return item.text();
        }

        var user_func = options.callback[this.getName()];
        if ( typeof options.callback == "object" && typeof user_func != "undefined") {
            return user_func( item.text() );
        }

        if ( typeof options.callback == "function" ) {
            user_func = options.callback
            return user_func( item.text() );
        }

        return item.text();
    }

    this.activate = function ()
    {
        if ( this.is_readonly() || typeof item.data("name") == "undefined") {
            return
        }

        if (typeof oldData == "undefined") {
            oldData = item.text();
            item.autocomplete({
                source: options[this.getName()].source,
                minLength: options[this.getName()].minLength
            })
            item.attr("tabindex", tabindex);
        }

        item.addClass(css_class, 500).attr("contenteditable", true);
        return this;
    }

    this.standby = function ()
    {
        if ( this.is_readonly() ) {
            return
        }

        if ( this.has_changed() ) {
            item.text( this.getValue() )
        }

        item.removeClass(css_class, 500).attr("contenteditable", false);
        return this;
    }

    this.reset = function ()
    {
        if ( this.is_readonly()) {
            return
        }

        if ( this.has_changed() ) {
            item.text( oldData );
        }

        return this;
    }

}


function editMeDatepicker ( object, options, index )
{
    var item = object;
    var oldData;
    var css_class = options.css_highlight_class
    var readonly = false;
    var tabindex = index;
    var input;
    this.is_readonly = function () {
        if (typeof item.data("readonly") != "undefined") {
            return true
        } else {
            return false;
        }
    }

    this.has_changed = function () {
        if ( oldData != this.getValue() ) {
            return true;
        } else {
            return false;
        }
    }

    this.getName = function () {
        return item.data("name");
    }

    this.getValue = function () {
        if (this.is_readonly() || typeof options.callback == "undefined") {
            return item.text();
        }

        var user_func = options.callback[this.getName()];
        if ( typeof options.callback == "object" && typeof user_func != "undefined") {
            return user_func( item.text() );
        }

        if ( typeof options.callback == "function" ) {
            user_func = options.callback
            return user_func( item.text() );
        }

        return item.text();
    }

    this.activate = function ()
    {
        if ( this.is_readonly() || typeof item.data("name") == "undefined") {
            return
        }

        if (typeof oldData == "undefined") {
            oldData = item.text();
            var newItem = $("<input type=\"text\" size=\"10\">");
            newItem.data("name", item.data("name"));
            newItem.val(item.text());
            newItem.change( function (){
                item.text(newItem.val())
            })
            item.after(newItem);
            newItem.datepicker({
                changeMonth: true,
                changeYear: true
            });
            item.attr("tabindex", tabindex);
            input = newItem;
            input.hide();
        }
        input.show().addClass(css_class, 500);
        item.hide();
        return this;
    }

    this.standby = function ()
    {
        if ( this.is_readonly() ) {
            return
        }

        if ( this.has_changed() ) {
            item.text( this.getValue() )
        }
        input.hide();
        item.show();
//        item.removeClass(css_class, 500).attr("contenteditable", false);
        return this;
    }

    this.reset = function ()
    {
        if ( this.is_readonly()) {
            return
        }

        if ( this.has_changed() ) {
            item.text( oldData );
        }

        return this;
    }

}
