var activityIndicatorOff, activityIndicatorOn, bindClicks, byteCount, d$, decode64, deepJQuery, delay, encode64, foo, formatScientificNames, getLocation, getMaxZ, getPosterFromSrc, goTo, handleDragDropImage, isBlank, isBool, isEmpty, isHovered, isJson, isNull, isNumber, jsonTo64, lightboxImages, loadJS, mapNewWindows, openLink, openTab, overlayOff, overlayOn, prepURI, randomInt, roundNumber, roundNumberSigfig, toFloat, toInt, toObject, toastStatusMessage,
  slice = [].slice;

window.locationData = new Object();

locationData.params = {
  enableHighAccuracy: true
};

locationData.last = void 0;

window.debounce_timer = null;

isBool = function(str, strict) {
  var e;
  if (strict == null) {
    strict = false;
  }
  if (strict) {
    return typeof str === "boolean";
  }
  try {
    if (typeof str === "boolean") {
      return str === true || str === false;
    }
    if (typeof str === "string") {
      return str.toLowerCase() === "true" || str.toLowerCase() === "false";
    }
    if (typeof str === "number") {
      return str === 1 || str === 0;
    }
    return false;
  } catch (_error) {
    e = _error;
    return false;
  }
};

isEmpty = function(str) {
  return !str || str.length === 0;
};

isBlank = function(str) {
  return !str || /^\s*$/.test(str);
};

isNull = function(str) {
  var e;
  try {
    if (isEmpty(str) || isBlank(str) || (str == null)) {
      if (!(str === false || str === 0)) {
        return true;
      }
    }
  } catch (_error) {
    e = _error;
    return false;
  }
  return false;
};

isJson = function(str) {
  var e;
  if (typeof str === 'object') {
    return true;
  }
  try {
    JSON.parse(str);
    return true;
  } catch (_error) {
    e = _error;
    return false;
  }
  return false;
};

isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

toFloat = function(str) {
  if (!isNumber(str) || isNull(str)) {
    return 0;
  }
  return parseFloat(str);
};

toInt = function(str) {
  if (!isNumber(str) || isNull(str)) {
    return 0;
  }
  return parseInt(str);
};

String.prototype.toBool = function() {
  return this.toString() === 'true';
};

Boolean.prototype.toBool = function() {
  return this.toString() === 'true';
};

Number.prototype.toBool = function() {
  return this.toString() === "1";
};

String.prototype.addSlashes = function() {
  return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
};

Object.size = function(obj) {
  var e, key, size;
  if (typeof obj !== "object") {
    try {
      return obj.length;
    } catch (_error) {
      e = _error;
      console.error("Passed argument isn't an object and doesn't have a .length parameter");
      console.warn(e.message);
    }
  }
  size = 0;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

delay = function(ms, f) {
  return setTimeout(f, ms);
};

roundNumber = function(number, digits) {
  var multiple;
  if (digits == null) {
    digits = 0;
  }
  multiple = Math.pow(10, digits);
  return Math.round(number * multiple) / multiple;
};

roundNumberSigfig = function(number, digits) {
  var digArr, needDigits, newNumber, significand, trailingDigits;
  if (digits == null) {
    digits = 0;
  }
  newNumber = roundNumber(number, digits).toString();
  digArr = newNumber.split(".");
  if (digArr.length === 1) {
    return newNumber + "." + (Array(digits + 1).join("0"));
  }
  trailingDigits = digArr.pop();
  significand = digArr[0] + ".";
  if (trailingDigits.length === digits) {
    return newNumber;
  }
  needDigits = digits - trailingDigits.length;
  trailingDigits += Array(needDigits + 1).join("0");
  return "" + significand + trailingDigits;
};

jsonTo64 = function(obj) {
  var objString;
  if (typeof obj === "array") {
    obj = toObject(arr);
  }
  objString = JSON.stringify(obj);
  return encodeURIComponent(encode64(objString));
};

encode64 = function(string) {
  var e;
  try {
    return Base64.encode(string);
  } catch (_error) {
    e = _error;
    console.warn("Bad encode string provided");
    return string;
  }
};

decode64 = function(string) {
  var e;
  try {
    return Base64.decode(string);
  } catch (_error) {
    e = _error;
    console.warn("Bad decode string provided");
    return string;
  }
};

isHovered = function(selector) {
  return $(selector + ":hover").length > 0;
};

jQuery.fn.exists = function() {
  return jQuery(this).length > 0;
};

jQuery.fn.isVisible = function() {
  return jQuery(this).is(":visible") && jQuery(this).css("visibility") !== "hidden";
};

jQuery.fn.hasChildren = function() {
  return Object.size(jQuery(this).children()) > 3;
};

byteCount = (function(_this) {
  return function(s) {
    return encodeURI(s).split(/%..|./).length - 1;
  };
})(this);

function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

toObject = function(array) {
  var element, index, rv;
  rv = new Object();
  for (index in array) {
    element = array[index];
    if (element !== void 0) {
      rv[index] = element;
    }
  }
  return rv;
};

loadJS = function(src, callback, doCallbackOnError) {
  var e, errorFunction, onLoadFunction, s;
  if (callback == null) {
    callback = new Object();
  }
  if (doCallbackOnError == null) {
    doCallbackOnError = true;
  }

  /*
   * Load a new javascript file
   *
   * If it's already been loaded, jump straight to the callback
   *
   * @param string src The source URL of the file
   * @param function callback Function to execute after the script has
   *                          been loaded
   * @param bool doCallbackOnError Should the callback be executed if
   *                               loading the script produces an error?
   */
  if ($("script[src='" + src + "']").exists()) {
    if (typeof callback === "function") {
      try {
        callback();
      } catch (_error) {
        e = _error;
        console.error("Script is already loaded, but there was an error executing the callback function - " + e.message);
      }
    }
    return true;
  }
  s = document.createElement("script");
  s.setAttribute("src", src);
  s.setAttribute("async", "async");
  s.setAttribute("type", "text/javascript");
  s.src = src;
  s.async = true;
  onLoadFunction = function() {
    var state;
    state = s.readyState;
    try {
      if (!callback.done && (!state || /loaded|complete/.test(state))) {
        callback.done = true;
        if (typeof callback === "function") {
          try {
            return callback();
          } catch (_error) {
            e = _error;
            return console.error("Postload callback error - " + e.message);
          }
        }
      }
    } catch (_error) {
      e = _error;
      return console.error("Onload error - " + e.message);
    }
  };
  errorFunction = function() {
    console.warn("There may have been a problem loading " + src);
    try {
      if (!callback.done) {
        callback.done = true;
        if (typeof callback === "function" && doCallbackOnError) {
          try {
            return callback();
          } catch (_error) {
            e = _error;
            return console.error("Post error callback error - " + e.message);
          }
        }
      }
    } catch (_error) {
      e = _error;
      return console.error("There was an error in the error handler! " + e.message);
    }
  };
  s.setAttribute("onload", onLoadFunction);
  s.setAttribute("onreadystate", onLoadFunction);
  s.setAttribute("onerror", errorFunction);
  s.onload = s.onreadystate = onLoadFunction;
  s.onerror = errorFunction;
  document.getElementsByTagName('head')[0].appendChild(s);
  return true;
};

String.prototype.toTitleCase = function() {
  var i, j, len, len1, lower, lowerRegEx, lowers, str, upper, upperRegEx, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  lowers = ["A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At", "By", "For", "From", "In", "Into", "Near", "Of", "On", "Onto", "To", "With"];
  for (i = 0, len = lowers.length; i < len; i++) {
    lower = lowers[i];
    lowerRegEx = new RegExp("\\s" + lower + "\\s", "g");
    str = str.replace(lowerRegEx, function(txt) {
      return txt.toLowerCase();
    });
  }
  uppers = ["Id", "Tv"];
  for (j = 0, len1 = uppers.length; j < len1; j++) {
    upper = uppers[j];
    upperRegEx = new RegExp("\\b" + upper + "\\b", "g");
    str = str.replace(upperRegEx, upper.toUpperCase());
  }
  return str;
};

Function.prototype.debounce = function() {
  var args, delayed, e, execAsap, func, threshold, timeout;
  threshold = arguments[0], execAsap = arguments[1], timeout = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
  if (threshold == null) {
    threshold = 300;
  }
  if (execAsap == null) {
    execAsap = false;
  }
  if (timeout == null) {
    timeout = debounce_timer;
  }
  func = this;
  delayed = function() {
    if (!execAsap) {
      func.apply(func, args);
    }
    return console.log("Debounce applied");
  };
  if (timeout != null) {
    try {
      clearTimeout(timeout);
    } catch (_error) {
      e = _error;
    }
  } else if (execAsap) {
    func.apply(obj, args);
    console.log("Executed immediately");
  }
  return setTimeout(delayed, threshold);
};

randomInt = function(lower, upper) {
  var ref, ref1, start;
  if (lower == null) {
    lower = 0;
  }
  if (upper == null) {
    upper = 1;
  }
  start = Math.random();
  if (lower == null) {
    ref = [0, lower], lower = ref[0], upper = ref[1];
  }
  if (lower > upper) {
    ref1 = [upper, lower], lower = ref1[0], upper = ref1[1];
  }
  return Math.floor(start * (upper - lower + 1) + lower);
};

toastStatusMessage = function(message, type, selector) {
  var html, topContainer;
  if (type == null) {
    type = "warning";
  }
  if (selector == null) {
    selector = "#status-message";
  }

  /*
   * Pop up a status message
   * Uses the Bootstrap alert dialog
   *
   * See
   * http://getbootstrap.com/components/#alerts
   * for available types
   */
  if (!$(selector).exists()) {
    html = "<div class=\"alert alert-" + type + " alert-dismissable\" role=\"alert\" id=\"" + (selector.slice(1)) + "\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n    <div class=\"alert-message\"></div>\n</div>";
    topContainer = $("main").exists() ? "main" : $("article").exists() ? "article" : "body";
    $(topContainer).prepend(html);
  }
  return $(selector + " .alert-message").html(message);
};

openLink = function(url) {
  if (url == null) {
    return false;
  }
  window.open(url);
  return false;
};

openTab = function(url) {
  return openLink(url);
};

goTo = function(url) {
  if (url == null) {
    return false;
  }
  window.location.href = url;
  return false;
};

mapNewWindows = function(stopPropagation) {
  if (stopPropagation == null) {
    stopPropagation = true;
  }
  return $(".newwindow").each(function() {
    var curHref, openInNewWindow;
    curHref = $(this).attr("href");
    if (curHref == null) {
      curHref = $(this).attr("data-href");
    }
    openInNewWindow = function(url) {
      if (url == null) {
        return false;
      }
      window.open(url);
      return false;
    };
    $(this).click(function(e) {
      if (stopPropagation) {
        e.preventDefault();
        e.stopPropagation();
      }
      return openInNewWindow(curHref);
    });
    return $(this).keypress(function() {
      return openInNewWindow(curHref);
    });
  });
};

deepJQuery = function(selector) {

  /*
   * Do a shadow-piercing selector
   *
   * Cross-browser, works with Chrome, Firefox, Opera, Safari, and IE
   * Falls back to standard jQuery selector when everything fails.
   */
  var e;
  try {
    if (!$("html /deep/ " + selector).exists()) {
      throw "Bad /deep/ selector";
    }
    return $("html /deep/ " + selector);
  } catch (_error) {
    e = _error;
    try {
      if (!$("html >>> " + selector).exists()) {
        throw "Bad >>> selector";
      }
      return $("html >>> " + selector);
    } catch (_error) {
      e = _error;
      return $(selector);
    }
  }
};

d$ = function(selector) {
  return deepJQuery(selector);
};

bindClicks = function(selector) {
  if (selector == null) {
    selector = ".click";
  }

  /*
   * Helper function. Bind everything with a selector
   * to execute a function data-function or to go to a
   * URL data-href.
   */
  $(selector).each(function() {
    var callable, e, url;
    try {
      url = $(this).attr("data-href");
      if (!isNull(url)) {
        $(this).unbind();
        try {
          if (url === uri.o.attr("path") && $(this).prop("tagName").toLowerCase() === "paper-tab") {
            $(this).parent().prop("selected", $(this).index());
          }
        } catch (_error) {
          e = _error;
          console.warn("tagname lower case error");
        }
        $(this).click(function() {
          if ($(this).attr("newTab").toBool() || $(this).attr("newtab").toBool()) {
            return openTab(url);
          } else {
            return goTo(url);
          }
        });
        return url;
      } else {
        callable = $(this).attr("data-function");
        if (callable != null) {
          $(this).unbind();
          return $(this).click(function() {
            try {
              console.log("Executing bound function " + callable + "()");
              return window[callable]();
            } catch (_error) {
              e = _error;
              return console.error("'" + callable + "()' is a bad function - " + e.message);
            }
          });
        }
      }
    } catch (_error) {
      e = _error;
      return console.error("There was a problem binding to #" + ($(this).attr("id")) + " - " + e.message);
    }
  });
  return false;
};

getPosterFromSrc = function(srcString) {

  /*
   * Take the "src" attribute of a video and get the
   * "png" screencap from it, and return the value.
   */
  var dummy, e, split;
  try {
    split = srcString.split(".");
    dummy = split.pop();
    split.push("png");
    return split.join(".");
  } catch (_error) {
    e = _error;
    return "";
  }
};

lightboxImages = function(selector, lookDeeply) {
  var jqo, options;
  if (selector == null) {
    selector = ".lightboximage";
  }
  if (lookDeeply == null) {
    lookDeeply = false;
  }

  /*
   * Lightbox images with this selector
   *
   * If the image has it, wrap it in an anchor and bind;
   * otherwise just apply to the selector.
   *
   * Requires ImageLightbox
   * https://github.com/rejas/imagelightbox
   */
  options = {
    onStart: function() {
      return overlayOn();
    },
    onEnd: function() {
      overlayOff();
      return activityIndicatorOff();
    },
    onLoadStart: function() {
      return activityIndicatorOn();
    },
    onLoadEnd: function() {
      return activityIndicatorOff();
    },
    allowedTypes: 'png|jpg|jpeg|gif|bmp|webp',
    quitOnDocClick: true,
    quitOnImgClick: true
  };
  jqo = lookDeeply ? d$(selector) : $(selector);
  return jqo.click(function(e) {
    try {
      $(this).imageLightbox(options).startImageLightbox();
      e.preventDefault();
      e.stopPropagation();
      return console.warn("Event propagation was stopped when clicking on this.");
    } catch (_error) {
      e = _error;
      return console.error("Unable to lightbox this image!");
    }
  }).each(function() {
    var e, imgUrl, tagHtml;
    console.log("Using selectors '" + selector + "' / '" + this + "' for lightboximages");
    try {
      if ($(this).prop("tagName").toLowerCase() === "img" && $(this).parent().prop("tagName").toLowerCase() !== "a") {
        tagHtml = $(this).removeClass("lightboximage").prop("outerHTML");
        imgUrl = (function() {
          switch (false) {
            case !!isNull($(this).attr("data-layzr-retina")):
              return $(this).attr("data-layzr-retina");
            case !!isNull($(this).attr("data-layzr")):
              return $(this).attr("data-layzr");
            default:
              return $(this).attr("src");
          }
        }).call(this);
        return $(this).replaceWith("<a href='" + imgUrl + "' class='lightboximage'>" + tagHtml + "</a>");
      }
    } catch (_error) {
      e = _error;
      return console.log("Couldn't parse through the elements");
    }
  });
};

activityIndicatorOn = function() {
  return $('<div id="imagelightbox-loading"><div></div></div>').appendTo('body');
};

activityIndicatorOff = function() {
  $('#imagelightbox-loading').remove();
  return $("#imagelightbox-overlay").click(function() {
    return $("#imagelightbox").click();
  });
};

overlayOn = function() {
  return $('<div id="imagelightbox-overlay"></div>').appendTo('body');
};

overlayOff = function() {
  return $('#imagelightbox-overlay').remove();
};

formatScientificNames = function(selector) {
  if (selector == null) {
    selector = ".sciname";
  }
  return $(".sciname").each(function() {
    var nameStyle;
    nameStyle = $(this).css("font-style") === "italic" ? "normal" : "italic";
    return $(this).css("font-style", nameStyle);
  });
};

prepURI = function(string) {
  string = encodeURIComponent(string);
  return string.replace(/%20/g, "+");
};

window.locationData = new Object();

locationData.params = {
  enableHighAccuracy: true
};

locationData.last = void 0;

getLocation = function(callback) {
  var geoFail, geoSuccess;
  if (callback == null) {
    callback = void 0;
  }
  geoSuccess = function(pos, callback) {
    window.locationData.lat = pos.coords.latitude;
    window.locationData.lng = pos.coords.longitude;
    window.locationData.acc = pos.coords.accuracy;
    window.locationData.last = Date.now();
    if (callback != null) {
      callback(window.locationData);
    }
    return false;
  };
  geoFail = function(error, callback) {
    var locationError;
    locationError = (function() {
      switch (error.code) {
        case 0:
          return "There was an error while retrieving your location: " + error.message;
        case 1:
          return "The user prevented this page from retrieving a location";
        case 2:
          return "The browser was unable to determine your location: " + error.message;
        case 3:
          return "The browser timed out retrieving your location.";
      }
    })();
    console.error(locationError);
    if (callback != null) {
      callback(false);
    }
    return false;
  };
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(geoSuccess, geoFail, window.locationData.params);
  } else {
    console.warn("This browser doesn't support geolocation!");
    if (callback != null) {
      return callback(false);
    }
  }
};

getMaxZ = function() {
  var mapFunction;
  mapFunction = function() {
    return $.map($("body *"), function(e, n) {
      if ($(e).css("position") !== "static") {
        return parseInt($(e).css("z-index") || 1);
      }
    });
  };
  return Math.max.apply(null, mapFunction());
};

foo = function() {
  toastStatusMessage("Sorry, this feature is not yet finished");
  stopLoad();
  return false;
};

$(function() {
  bindClicks();
  window.bindClicks = bindClicks;
  return window.mapNewWindows = mapNewWindows;
});

if (window.dropperParams == null) {
  window.dropperParams = new Object();
}

if (dropperParams.metaPath == null) {
  dropperParams.metaPath = "";
}

if (dropperParams.uploadPath == null) {
  dropperParams.uploadPath = "uploaded_images/";
}

if (dropperParams.dropzonePath == null) {
  dropperParams.dropzonePath = "bower_components/dropzone/dist/min/dropzone.min.js";
}

if (dropperParams.md5Path == null) {
  dropperParams.md5Path = "bower_components/JavaScript-MD5/js/md5.min.js";
}

if (dropperParams.thumbWidth == null) {
  dropperParams.thumbWidth = 640;
}

if (dropperParams.thumbHeight == null) {
  dropperParams.thumbHeight = 480;
}

handleDragDropImage = function(uploadTargetSelector, callback) {
  if (uploadTargetSelector == null) {
    uploadTargetSelector = "#upload-image";
  }

  /*
   * Take a drag-and-dropped image, and save it out to the database.
   * This function should be called on page load.
   *
   * This function is Shadow-DOM aware, and will work on Webcomponents.
   */
  if (typeof callback !== "function") {
    callback = function(file, result) {
      var e;
      if (typeof result !== "object") {
        console.error("Dropzone returned an error - " + result);
        toastStatusMessage("<strong>Error</strong> There was a problem with the server handling your image. Please try again.", "danger");
        return false;
      }
      if (result.status !== true) {
        if (result.human_error == null) {
          result.human_error = "There was a problem uploading your image.";
        }
        toastStatusMessage("<strong>Error</strong> " + result.human_error, "danger");
        console.error("Error uploading!", result);
        return false;
      }
      try {
        console.info("Server returned the following result:", result);
        console.info("The script returned the following file information:", file);
        dropperParams.dropzone.removeAllFiles();
        toastStatusMessage("Upload complete", "success");
      } catch (_error) {
        e = _error;
        console.error("There was a problem with upload post-processing - " + e.message);
        console.warn("Using", fileName, result);
        toastStatusMessage("<strong>Error</strong> Your upload completed, but we couldn't post-process it.", "danger");
      }
      return false;
    };
  }
  loadJS(dropperParams.md5Path);
  loadJS(dropperParams.dropzonePath, function() {
    var c, defaultText, dragCancel, dropzoneConfig, fileUploadDropzone, ref;
    c = document.createElement("link");
    c.setAttribute("rel", "stylesheet");
    c.setAttribute("type", "text/css");
    c.setAttribute("href", dropperParams.metaPath + "css/main.min.css");
    document.getElementsByTagName('head')[0].appendChild(c);
    Dropzone.autoDiscover = false;
    defaultText = (ref = dropperParams.uploadText) != null ? ref : "Drop your image here.";
    dragCancel = function() {
      d$(uploadTargetSelector).css("box-shadow", "").css("border", "");
      return d$(uploadTargetSelector + " .dz-message span").text(defaultText);
    };
    dropzoneConfig = {
      url: dropperParams.metaPath + "meta.php?do=upload_image&uploadpath=" + dropperParams.uploadPath + "&thumb_width=" + dropperParams.thumbWidth + "&thumb_height=" + dropperParams.thumb_height,
      acceptedFiles: "image/*",
      autoProcessQueue: true,
      maxFiles: 1,
      dictDefaultMessage: defaultText,
      init: function() {
        this.on("error", function(file, errorMessage) {
          return toastStatusMessage("An error occured sending your image to the server - " + errorMessage + ".", "danger");
        });
        this.on("canceled", function() {
          return toastStatusMessage("Upload canceled.", "info");
        });
        this.on("dragover", function() {
          d$(uploadTargetSelector + " .dz-message span").text("Drop here to upload the image");

          /*
           * We want to hint a good hover -- so we use CSS
           *
           * box-shadow: 0px 0px 15px rgba(15,157,88,.8);
           * border: 1px solid #0F9D58;
           */
          return d$(uploadTargetSelector).css("box-shadow", "0px 0px 15px rgba(15,157,88,.8)").css("border", "1px solid #0F9D58");
        });
        this.on("dragleave", function() {
          return dragCancel();
        });
        this.on("dragend", function() {
          return dragCancel();
        });
        this.on("drop", function() {
          return dragCancel();
        });
        return this.on("success", function(file, result) {
          return callback(file, result);
        });
      }
    };
    if (!d$(uploadTargetSelector).hasClass("dropzone")) {
      d$(uploadTargetSelector).addClass("dropzone");
    }
    fileUploadDropzone = new Dropzone(d$(uploadTargetSelector).get(0), dropzoneConfig);
    return dropperParams.dropzone = fileUploadDropzone;
  });
  return false;
};

dropperParams.handleDragDropImage = handleDragDropImage;

window.toastStatusMessage = toastStatusMessage;

//# sourceMappingURL=maps/drop-upload.js.map
