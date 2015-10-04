# js-dragdrop-php

## Configuration

There plugin exposes the global variable `dropperParams`, which has two primary parameters:

- `dropperParams.uploadPath`: The path relative to `meta.php` that the images will be saved in. If you need a trailing slash, it should be inserted. **This path must be writeable by the PHP user**.
- `dropperParams.metaPath`: The path relative to the calling page of `meta.php`. It should terminate in a slash.

The following optional paramaters may be specified:

- `dropperParams.uploadText`: The text to show in the upload target. Defaults to "Drop your image here".
- `dropperParams.thumbWidth`: Maximum thumbnail width, in pixels. Default 640.
- `dropperParams.thumbHeight`: Maximum thumbnail height, in pixels. Default 480.
- `dropperParams.dependencyPath`: The path to the dependencies of the library. Defaults to `bower_components/`.
- `dropperParams.showProgress`: Show an extra progress bar beneath the drop target. Default `false`.
- `dropperParams.clickTargets`: Targets that can be clicked to initiate an upload. An array of CSS selectors. (Default: none)

## Using

Adding the function in is simple. **It has JQuery as a dependency**, but other than that simply run

```html
<script type="text/javascript" src="js/drop-upload.min.js"></script>
```

to load the script.

To configure it, you can do something like what's in [launch-test.coffee](launch-test.coffee):

```coffee
dropTargetSelector="#foobar"
callback = (file, result) ->
  # Callback here
  false
$ ->
  window.dropperParams.showProgress = true
  window.dropperParams.handleDragDropImage(dropTargetSelector, callback)
```

It's important to have the code run on the `onready` handler or similar, as the function will load its own dependencies, keeping the actual declaration slim.

Running the demo will show some sample outputs.

The most important of these outputs is the JSON result from `meta.php`. It will return an object like this:

```javascript
{
    "status": true, // Boolean true or false
    "original_file": "foobar.png", // The original file name
    "full_path": "path/to/MD5HASH.png", // A path to the uploaded file
    "thumb_path": "path/to/MD5HASH-thumb.png", // A path to the thumbnail of the uploaded file
    "resize_status": {
        "output": "path/to/MD5HASH-thumb.png", // A path to the thumbnail of the uploaded file. Same as thumb_path
        "output_size": "640 x 480", // The resized dimensions of the thumbnail
        "status": true // the status of the resize attempt
    },
    "error": "Could not write directory", // Developer error for the upload
    "human_error": "Please try again", // A friendly error for the user
    "wrote_file": "MD5HASH.png" // The bare filename of the uploaded image
}
```

## License

This library is dual-licensed under the MIT and GPLv3 liceneses (as LICENSE and LICENSE-2 in this repository). Feel free to use either for your work, as appropriate.

Please contact the me for any other licences you may want, and we'll work something out
