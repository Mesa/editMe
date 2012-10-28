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

`required`
Like the input name, this will be the key in the JSON Array.
    data-name


`optional`
Could be empty, this is like an hidden field.
    data-readonly


For the first element
```javascript
$("p").editMe({
    css_highlight_class : "your-css-class",
    target_url : "data_destination.php",
    edit_btn_txt : "Bearbeiten",
    cancel_btn_txt: "Abbrechen",
    save_btn_txt: "Speichern",
    menu_target_id:"menu",
    callback: yourCallbackFunction
});
```

```javascript
$("ul").editMe({
    css_highlight_class : "edit-me-highlight3",
    target_url : "data_destination.php",
    callback: {
        username: testing
    }
});
```

Requirements
-------------------
jQuery 1.8.2
jQueryUi 1.9.1
(because its the current jQuery library, feel free to test older releases and please tell me if it works)


Bugs
------------
This are all features!!!
Bug reports, suggestions and feedback is welcome.


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