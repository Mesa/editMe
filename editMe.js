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
                var edit_btn = $("#" + config.edit_btn_id);
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
        var object;

        if (
            typeof options[name] == "undefined"
            || typeof options[name].type  == "undefined"
            || options[name].type  == "input"
            ) {
            object = new editMeInput( );
            object.setItem( item )
            object.setOptions( options )
            object.setIndex( index )
            return object;
        }

        if ( options[name].type  == "autocomplete" ) {
            object = new editMeAutocomplete( );
            object.setItem( item )
            object.setOptions( options )
            object.setIndex( index )
            return object;
        }

        if ( options[name].type  == "datepicker" ) {
            object = new editMeDatepicker( );
            object.setItem( item )
            object.setOptions( options )
            object.setIndex( index )
            return object;
        }

        if ( options[name].type  == "radio" ) {
            object = new editMeRadio( );
            if ( typeof options[name].options != "undefined") {
                object.setItem( item, options[name].options )
            } else {
            object.setItem( item )
            }
            object.setOptions( options )
            object.setIndex( index )
            return object;
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
            return
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

function editMeInput ( )
{
    this.config = {
    }

    this.standby = function ()
    {
        if ( this.is_readonly() ) {
            return this;
        }

        this.item.text( this.getValue() )

        this.item.removeClass(this.css_class, 500).attr("contenteditable", false).removeAttr("tabindex");
        return this;
    }

    this.reset = function ()
    {
        if ( this.is_readonly()) {
            return this;
        }

        if ( this.has_changed() ) {
            this.item.text( this.oldData );
        }

        return this;
    }

    this.setItem = function ( object ) {
        this.item = object;
    }

    this.setOptions = function ( options ) {
        this.css_class = options.css_highlight_class;
        this.options = options;
    }

    this.setIndex = function ( index ) {
        this.index = index;
    }

    this.getName = function () {
        return this.item.data("name");
    }

    this.has_changed = function () {
        if ( this.oldData != this.getValue() ) {
            return true;
        } else {
            return false;
        }
    }

    this.getValue = function () {
        if (this.is_readonly()) {
            return this.item.text();
        }

        if (
            typeof this.options[this.getName()] == "object"
            && typeof this.options[this.getName()].callback == "object"
            && typeof this.options[this.getName()].callback.name == "function"
            ) {
            return this.options[this.getName()].callback.name(
                this.item.text(),
                this.options[this.getName()].callback.options || ""
                );
        }

        if (
            typeof this.options.callback == "object"
            && typeof this.options.callback.name == "function" ) {
            return this.options.callback.name( this.item.text(), this.options.callback.options || "");
        }

        return this.item.text();
    }

    this.activate = function () {

        if ( this.is_readonly() || typeof this.item.data("name") == "undefined") {
            return this;
        }

        if (typeof this.oldData == "undefined") {
            this.oldData = this.item.text();
        }

        this.item.addClass(this.css_class, 500).attr("contenteditable", true).attr("tabindex", tabindex);
        return this;
    }

    this.is_readonly = function () {

        if (typeof this.item.data("readonly") != "undefined") {
            return true
        } else {
            return false;
        }
    }

    this.copyCss = function ( origin, destination ) {

        var attr = new Array(
            "fontSize",
            "fontFamily",
            "width",
            "height",
            "color",
            "padding"
            );

        for (i=0; i < attr.length; i++) {
            destination.css(attr[i], origin.css(attr[i]))
        }
    }
}

editMeAutocomplete = function () {
    var config = this.config;
    config.min_length = 2;

    this.activate = function ()
    {
        if (
            this.is_readonly()
            || typeof this.item.data("name") == "undefined"
            ) {
            return this;
        }

        if (
            typeof this.oldData == "undefined"
            && typeof this.options[this.getName()].source !== "undefined"
            ) {
            this.oldData = this.item.text();
            this.item.autocomplete({
                source: this.options[this.getName()].source,
                minLength: this.options[this.getName()].minLength || config.min_length
            });

            this.item.attr("tabindex", tabindex);
        }

        this.item.addClass(this.css_class, 500).attr("contenteditable", true);
        return this;
    }
};

editMeAutocomplete.prototype = new editMeInput(  );

editMeDatepicker = function () {
    var newItem;
    var self = this;

    this.activate = function ()
    {
        if ( this.is_readonly() || typeof this.item.data("name") == "undefined") {
            return this
        }

        if (typeof this.oldData == "undefined") {
            this.oldData = this.item.text();

            newItem = $("<input type=\"text\" size=\"10\">");
            newItem.data("name", this.item.data("name"));
            newItem.val(this.item.text());
            newItem.change( function (){
                self.item.text(newItem.val())
            });

            this.copyCss(this.item, newItem)
            this.item.after(newItem);
            newItem.datepicker({
                changeMonth: true,
                changeYear: true
            });

            this.item.attr("tabindex", tabindex);
            newItem.hide();
        }
        newItem.show().addClass(this.css_class, 500);
        this.item.hide();
        return this;
    }

    this.standby = function () {
        if ( this.is_readonly() ) {
            return this
            }

        if ( this.has_changed() ) {
            this.item.text( this.getValue() )
        }
        newItem.hide();
        this.item.show();
        return this;
    }

    this.reset = function ()
    {
        if ( this.is_readonly()) {
            return this
            }

        if ( this.has_changed() ) {
            this.item.text( this.oldData );
        }

        return this;
    }
}

editMeDatepicker.prototype = new editMeInput(  );
editMeRadio = function () {
    this.setItem = function ( object, itemOptions )  {
        this.item = object;

        object.buttonset();

        if ( typeof itemOptions !== "undefined") {
            for (var i = 0; i < itemOptions.length; i++ ) {
                this.item.find("[type=radio]").eq(i).button(itemOptions[i])
            }
        }

        object.buttonset("disable");
    }

    this.activate = function () {
        if ( this.is_readonly() || typeof this.item.data("name") == "undefined") {
            return this
        }
        if (typeof this.oldData == "undefined") {
         this.oldData = this.getValue();
        }
        this.item.buttonset("enable")
    }
    this.standby = function () {
        this.item.buttonset("disable");
    }
    this.reset = function () {
        this.item.find("[value=" + this.oldData + "]").attr("checked", true);
        this.item.buttonset("refresh");
    }
    this.getValue = function () {
        return this.item.find("[type=radio]:checked").val();
    }
}

editMeRadio.prototype = new editMeInput();

function onlyInt( text ) {
    return parseInt(text)
}

function maxLength( text, length ) {
    return text.substr(0, length);
}

function matchRegEx( text, regex ) {
    var match = text.match(regex)
    if ( null == match ) {
        return "";
    } else {
        return match[0];
    }
}

function replaceRegEx( text, options) {
    return text.replace(options.search, options.replace);
}