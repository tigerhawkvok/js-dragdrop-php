dropperParams = new Object()
dropperParams.metaPath = "FOOBAR"

handleDragDropImage = (uploadTargetSelector = "#upload-image", callback) ->
  ###
  # Take a drag-and-dropped image, and save it out to the database.
  # This function should be called on page load.
  ###
  unless typeof callback is "function"
    callback = (file, result) ->
      unless result.status is true
        # Yikes! Didn't work
        result.human_error ?= "There was a problem uploading your image."
        toastStatusMessage(result.human_error)
        console.error("Error uploading!",result)
        return false
      try
        fileName = file.name
        # Disable the selector
        dropperParams.dropzone.disable()
        # Now, process the rename and insert it into the file area
        # Get the MD5 of the original filename
        ext = fileName.split(".").pop()
        # MD5.extension is the goal
        fullFile = "#{md5(fileName)}.#{ext}"
        fullPath = "species_photos/#{fullFile}"
        # Insert it into the field
        d$("#edit-image")
        .attr("disabled","disabled")
        .attr("value",fullPath)
        toastStatusMessage("Upload complete")
      catch e
        console.error("There was a problem with upload post-processing - #{e.message}")
        console.warn("Using",fileName,result)
        toastStatusMessage("Your upload completed, but we couldn't post-process it.")
      false
  # Load dependencies
  loadJS("bower_components/JavaScript-MD5/js/md5.min.js")
  loadJS "bower_components/dropzone/dist/min/dropzone.min.js", ->
    # Dropzone has been loaded!
    # Add the CSS
    c = document.createElement("link")
    c.setAttribute("rel","stylesheet")
    c.setAttribute("type","text/css")
    c.setAttribute("href","css/dropzone.min.css")
    document.getElementsByTagName('head')[0].appendChild(c)
    Dropzone.autoDiscover = false
    # See http://www.dropzonejs.com/#configuration
    defaultText = "Drop a high-resolution image for the taxon here."
    dragCancel = ->
      d$(uploadTargetSelector)
      .css("box-shadow","")
      .css("border","")
      d$("#{uploadTargetSelector} .dz-message span").text(defaultText)
    dropzoneConfig =
      url: "#{dropperParams.metaPath}meta.php?do=upload_image"
      acceptedFiles: "image/*"
      autoProcessQueue: true
      maxFiles: 1
      dictDefaultMessage: defaultText
      init: ->
        @on "error", ->
          toastStatusMessage("An error occured sending your image to the server.")
        @on "canceled", ->
          toastStatusMessage("Upload canceled.")
        @on "dragover", ->
          d$("#{uploadTargetSelector} .dz-message span").text("Drop here to upload the image")
          ###
          # box-shadow: 0px 0px 15px rgba(15,157,88,.8);
          # border: 1px solid #0F9D58;
          ###
          d$(uploadTargetSelector)
          .css("box-shadow","0px 0px 15px rgba(15,157,88,.8)")
          .css("border","1px solid #0F9D58")
        @on "dragleave", ->
          dragCancel()
        @on "dragend", ->
          dragCancel()
        @on "drop", ->
          dragCancel()
        @on "success", (file, result) ->
          callback(file, result)
    # Create the upload target
    unless d$(uploadTargetSelector).hasClass("dropzone")
      d$(uploadTargetSelector).addClass("dropzone")
    fileUploadDropzone = new Dropzone(d$(uploadTargetSelector).get(0), dropzoneConfig)
    dropperParams.dropzone = fileUploadDropzone
  false
