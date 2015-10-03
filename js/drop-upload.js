(function() {
  var activityIndicatorOff, activityIndicatorOn, animateLoad, bindClicks, byteCount, d$, decode64, deepJQuery, delay, doCORSget, dropperParams, e, encode64, foo, formatScientificNames, getLocation, getMaxZ, getPosterFromSrc, goTo, handleDragDropImage, isBlank, isBool, isEmpty, isHovered, isJson, isNull, isNumber, jsonTo64, lightboxImages, loadJS, mapNewWindows, openLink, openTab, overlayOff, overlayOn, prepURI, randomInt, roundNumber, roundNumberSigfig, startLoad, stopLoad, stopLoadError, toFloat, toInt, toObject, toastStatusMessage, uri,
    slice = [].slice;

  try {
    uri = new Object();
    uri.o = $.url();
    uri.urlString = uri.o.attr('protocol') + '://' + uri.o.attr('host') + uri.o.attr("directory");
    uri.query = uri.o.attr("fragment");
  } catch (_error) {
    e = _error;
    console.warn("PURL not installed!");
  }

  window.locationData = new Object();

  locationData.params = {
    enableHighAccuracy: true
  };

  locationData.last = void 0;

  window.debounce_timer = null;

  isBool = function(str, strict) {
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
    var key, size;
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
    try {
      return Base64.encode(string);
    } catch (_error) {
      e = _error;
      console.warn("Bad encode string provided");
      return string;
    }
  };

  decode64 = function(string) {
    try {
      return Base64.decode(string);
    } catch (_error) {
      e = _error;
      console.warn("Bad decode string provided");
      return string;
    }
  };

  jQuery.fn.polymerSelected = function(setSelected, attrLookup) {
    var attr, itemSelector, val;
    if (setSelected == null) {
      setSelected = void 0;
    }
    if (attrLookup == null) {
      attrLookup = "attrForSelected";
    }

    /*
     * See
     * https://elements.polymer-project.org/elements/paper-menu
     * https://elements.polymer-project.org/elements/paper-radio-group
     *
     * @param attrLookup is based on
     * https://elements.polymer-project.org/elements/iron-selector?active=Polymer.IronSelectableBehavior
     */
    attr = $(this).attr(attrLookup);
    if (setSelected != null) {
      if (!isBool(setSelected)) {
        try {
          return $(this).get(0).select(setSelected);
        } catch (_error) {
          e = _error;
          return false;
        }
      } else {
        $(this).parent().children().removeAttribute("aria-selected");
        $(this).parent().children().removeAttribute("active");
        $(this).parent().children().removeClass("iron-selected");
        $(this).prop("selected", setSelected);
        $(this).prop("active", setSelected);
        $(this).prop("aria-selected", setSelected);
        if (setSelected === true) {
          return $(this).addClass("iron-selected");
        }
      }
    } else {
      val = void 0;
      try {
        val = $(this).get(0).selected;
        if (isNumber(val) && !isNull(attr)) {
          itemSelector = $(this).find("paper-item")[toInt(val)];
          val = $(itemSelector).attr(attr);
        }
      } catch (_error) {
        e = _error;
        return false;
      }
      if (val === "null" || (val == null)) {
        val = void 0;
      }
      return val;
    }
  };

  jQuery.fn.polymerChecked = function(setChecked) {
    var val;
    if (setChecked == null) {
      setChecked = void 0;
    }
    if (setChecked != null) {
      return jQuery(this).prop("checked", setChecked);
    } else {
      val = jQuery(this)[0].checked;
      if (val === "null" || (val == null)) {
        val = void 0;
      }
      return val;
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
    var errorFunction, onLoadFunction, s;
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
    var args, delayed, execAsap, func, threshold, timeout;
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

  animateLoad = function(elId) {
    var selector;
    if (elId == null) {
      elId = "loader";
    }

    /*
     * Suggested CSS to go with this:
     *
     * #loader {
     *     position:fixed;
     *     top:50%;
     *     left:50%;
     * }
     * #loader.good::shadow .circle {
     *     border-color: rgba(46,190,17,0.9);
     * }
     * #loader.bad::shadow .circle {
     *     border-color:rgba(255,0,0,0.9);
     * }
     *
     * Uses Polymer 1.0
     */
    if (isNumber(elId)) {
      elId = "loader";
    }
    if (elId.slice(0, 1) === "#") {
      selector = elId;
      elId = elId.slice(1);
    } else {
      selector = "#" + elId;
    }
    try {
      if (!$(selector).exists()) {
        $("body").append("<paper-spinner id=\"" + elId + "\" active></paper-spinner");
      } else {
        $(selector).attr("active", true);
      }
      return false;
    } catch (_error) {
      e = _error;
      return console.log('Could not animate loader', e.message);
    }
  };

  startLoad = animateLoad;

  stopLoad = function(elId, fadeOut) {
    var selector;
    if (elId == null) {
      elId = "loader";
    }
    if (fadeOut == null) {
      fadeOut = 1000;
    }
    if (elId.slice(0, 1) === "#") {
      selector = elId;
      elId = elId.slice(1);
    } else {
      selector = "#" + elId;
    }
    try {
      if ($(selector).exists()) {
        $(selector).addClass("good");
        return delay(fadeOut, function() {
          $(selector).removeClass("good");
          return $(selector).removeAttr("active");
        });
      }
    } catch (_error) {
      e = _error;
      return console.log('Could not stop load animation', e.message);
    }
  };

  stopLoadError = function(message, elId, fadeOut) {
    var selector;
    if (elId == null) {
      elId = "loader";
    }
    if (fadeOut == null) {
      fadeOut = 5000;
    }
    if (elId.slice(0, 1) === "#") {
      selector = elId;
      elId = elId.slice(1);
    } else {
      selector = "#" + elId;
    }
    try {
      if ($(selector).exists()) {
        $(selector).addClass("bad");
        if (message != null) {
          toastStatusMessage(message, "", fadeOut);
        }
        return delay(fadeOut, function() {
          $(selector).removeClass("bad");
          return $(selector).removeAttr("active");
        });
      }
    } catch (_error) {
      e = _error;
      return console.log('Could not stop load error animation', e.message);
    }
  };

  toastStatusMessage = function(message, className, duration, selector) {
    var html, ref;
    if (className == null) {
      className = "";
    }
    if (duration == null) {
      duration = 3000;
    }
    if (selector == null) {
      selector = "#status-message";
    }

    /*
     * Pop up a status message
     */
    if (((ref = window.metaTracker) != null ? ref.isToasting : void 0) == null) {
      if (window.metaTracker == null) {
        window.metaTracker = new Object();
        window.metaTracker.isToasting = false;
      }
    }
    if (window.metaTracker.isToasting) {
      delay(250, function() {
        return toastStatusMessage(message, className, duration, selector);
      });
      return false;
    }
    window.metaTracker.isToasting = true;
    if (!isNumber(duration)) {
      duration = 3000;
    }
    if (selector.slice(0, 1) === !"#") {
      selector = "#" + selector;
    }
    if (!$(selector).exists()) {
      html = "<paper-toast id=\"" + (selector.slice(1)) + "\" duration=\"" + duration + "\"></paper-toast>";
      $(html).appendTo("body");
    }
    $(selector).attr("text", message).text(message).addClass(className);
    $(selector).get(0).show();
    return delay(duration + 500, function() {
      $(selector).empty();
      $(selector).removeClass(className);
      $(selector).attr("text", "");
      return window.metaTracker.isToasting = false;
    });
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
      var callable, url;
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
    var dummy, split;
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

  doCORSget = function(url, args, callback, callbackFail) {
    var corsFail, createCORSRequest, settings, xhr;
    if (callback == null) {
      callback = void 0;
    }
    if (callbackFail == null) {
      callbackFail = void 0;
    }
    corsFail = function() {
      if (typeof callbackFail === "function") {
        return callbackFail();
      } else {
        throw new Error("There was an error performing the CORS request");
      }
    };
    settings = {
      url: url,
      data: args,
      type: "get",
      crossDomain: true
    };
    try {
      $.ajax(settings).done(function(result) {
        if (typeof callback === "function") {
          callback();
          return false;
        }
        return console.log(response);
      }).fail(function(result, status) {
        return console.warn("Couldn't perform jQuery AJAX CORS. Attempting manually.");
      });
    } catch (_error) {
      e = _error;
      console.warn("There was an error using jQuery to perform the CORS request. Attemping manually.");
    }
    url = url + "?" + args;
    createCORSRequest = function(method, url) {
      var xhr;
      if (method == null) {
        method = "get";
      }
      xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        xhr = null;
      }
      return xhr;
    };
    xhr = createCORSRequest("get", url);
    if (!xhr) {
      throw new Error("CORS not supported");
    }
    xhr.onload = function() {
      var response;
      response = xhr.responseText;
      if (typeof callback === "function") {
        callback(response);
      }
      console.log(response);
      return false;
    };
    xhr.onerror = function() {
      console.warn("Couldn't do manual XMLHttp CORS request");
      return corsFail();
    };
    xhr.send();
    return false;
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
      var imgUrl, tagHtml;
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
    formatScientificNames();
    try {
      return $('[data-toggle="tooltip"]').tooltip();
    } catch (_error) {
      e = _error;
      return console.warn("Tooltips were attempted to be set up, but do not exist");
    }
  });

  dropperParams = new Object();

  dropperParams.metaPath = "FOOBAR";

  handleDragDropImage = function(uploadTargetSelector, callback) {
    if (uploadTargetSelector == null) {
      uploadTargetSelector = "#upload-image";
    }

    /*
     * Take a drag-and-dropped image, and save it out to the database.
     * This function should be called on page load.
     */
    if (typeof callback !== "function") {
      callback = function(file, result) {
        var ext, fileName, fullFile, fullPath;
        if (result.status !== true) {
          if (result.human_error == null) {
            result.human_error = "There was a problem uploading your image.";
          }
          toastStatusMessage(result.human_error);
          console.error("Error uploading!", result);
          return false;
        }
        try {
          fileName = file.name;
          dropperParams.dropzone.disable();
          ext = fileName.split(".").pop();
          fullFile = (md5(fileName)) + "." + ext;
          fullPath = "species_photos/" + fullFile;
          d$("#edit-image").attr("disabled", "disabled").attr("value", fullPath);
          toastStatusMessage("Upload complete");
        } catch (_error) {
          e = _error;
          console.error("There was a problem with upload post-processing - " + e.message);
          console.warn("Using", fileName, result);
          toastStatusMessage("Your upload completed, but we couldn't post-process it.");
        }
        return false;
      };
    }
    loadJS("bower_components/JavaScript-MD5/js/md5.min.js");
    loadJS("bower_components/dropzone/dist/min/dropzone.min.js", function() {
      var c, defaultText, dragCancel, dropzoneConfig, fileUploadDropzone;
      c = document.createElement("link");
      c.setAttribute("rel", "stylesheet");
      c.setAttribute("type", "text/css");
      c.setAttribute("href", "css/dropzone.min.css");
      document.getElementsByTagName('head')[0].appendChild(c);
      Dropzone.autoDiscover = false;
      defaultText = "Drop a high-resolution image for the taxon here.";
      dragCancel = function() {
        d$(uploadTargetSelector).css("box-shadow", "").css("border", "");
        return d$(uploadTargetSelector + " .dz-message span").text(defaultText);
      };
      dropzoneConfig = {
        url: dropperParams.metaPath + "meta.php?do=upload_image",
        acceptedFiles: "image/*",
        autoProcessQueue: true,
        maxFiles: 1,
        dictDefaultMessage: defaultText,
        init: function() {
          this.on("error", function() {
            return toastStatusMessage("An error occured sending your image to the server.");
          });
          this.on("canceled", function() {
            return toastStatusMessage("Upload canceled.");
          });
          this.on("dragover", function() {
            d$(uploadTargetSelector + " .dz-message span").text("Drop here to upload the image");

            /*
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

}).call(this);

//# sourceMappingURL=maps/drop-upload.js.map