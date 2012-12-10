editMe
======

jQuery Plugin for on page content editing and some Ajax magic to save the changed data.

What is EditMe?
-----------------
EditMe is a jQuery plugin to allow on page content editing and saving data with a Ajax JSON request.
For Example: your Administration Area has a userlist, displaying: Name, E-Mail, Last Login and so on...
When you want to edit the user data, you normaly create an extra "edit user" Page or use a jQuery Dialog.
Now you can hit an edit button and change the username right in place. When you're ready, you hit the
save button and all changed data go via Ajax request to your server.


HTML options
-------------------
Every HTML element could have the "data" attributes, the following are required or optional for editMe.

        data-name
Like the input name, this will be the key in the JSON Array.

        data-readonly
Could be empty, this is like an hidden field.

Plugin Options
--------------------

To configure editMe you can set the default vars with the first element.
```javascript
$("p").editMe({
    css_highlight_class : "<your-css-class>",
    target_url : "destination.php",
    callback: yourCallbackFunction,
    edit_btn_txt : "Bearbeiten",
    cancel_btn_txt: "Abbrechen",
    save_btn_txt: "Speichern",
    menu_target_id: "<your-menu-id>", // id to append the Buttons
    save_btn_id :"<your-btn-id>", // or tell editMe the buttons to use
    cancel_btn_id: "<your-btn-id>",
    edit_btn_id: "<your-btn-id>"
});
```

Only the first element needs the global vars, for the next elements you need only the item vars.
```javascript
$("ul").editMe({
    css_highlight_class : "your-css-class", // optional
    target_url : "destination.php",
    callback: yourCallbackFunction, // callback for all items *optional*
    options: {} // options for your callback *optional*
});
```

```javascript
$("ul").editMe({
    css_highlight_class : "your-css-class",
    target_url : "destination.php",
    username: { // name provide by html attribute "data-name"
        callback: yourCallbackFunction,  // callback for items named "username"
        options:  "text" // options for your callback
    }
});
```

Special Input
-----------------
Sometimes you need some special input fields, jQueryUi got some nice plugins, like Datepicker or
Autocomplete. To define an autocomplete or a datepicker field, you add following lines to you config :

```javascript
$("ul").editMe({
    username: { // name provide by html attribute "data-name"
        type: "autocomplete", // type to display. The options are ( autocomplete | datepicker | input | radio )
       source: "<path-to-your-php-file>", // response.php for example
       minLength : 2
    },
    date: {
        type: "datepicker" // type to display. The options are ( autocomplete | datepicker | input | radio )
    },
});
```
The type attribute is optional and the default value is input

Requirements
-------------------
* jQuery 1.8.2
* jQueryUi 1.9.1
(because its the current jQuery library, feel free to test older releases and please tell me if it works)


Bugs
------------
This are all features!!!
Bug reports, suggestions and/or feedback is welcome.


License
-----------
Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0)
    http://creativecommons.org/licenses/by-nc-sa/3.0/


Installation
------------
comming soon.


Documentation
-------------
You read the Documentation just now. Try again.