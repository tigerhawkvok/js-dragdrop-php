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

## License

This library is dual-licensed under the MIT and GPLv3 liceneses (as LICENSE and LICENSE-2 in this repository). Feel free to use either for your work, as appropriate.

Please contact the me for any other licences you may want, and we'll work something out.
