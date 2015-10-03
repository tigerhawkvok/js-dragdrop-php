unless window.dropperParams?
  window.dropperParams = new Object()
# Path to where meta.php lives. This is the file that handles the
# server-side upload.
dropperParams.metaPath ?= ""
dropperParams.uploadPath ?= "uploaded_images/"
dropperParams.dependencyPath ?= "bower_components/"
dropperParams.dropzonePath = "#{dropperParams.dependencyPath}dropzone/dist/min/dropzone.min.js"
dropperParams.md5Path = "#{dropperParams.dependencyPath}JavaScript-MD5/js/md5.min.js"
dropperParams.thumbWidth ?= 640
dropperParams.thumbHeight ?= 480
dropperParams.showProgress ?= false
dropperParams.clickTargets ?= false


handleDragDropImage = (uploadTargetSelector = "#upload-image", callback) ->
  ###
  # Take a drag-and-dropped image, and save it out to the database.
  # This function should be called on page load.
  #
  # This function is Shadow-DOM aware, and will work on Webcomponents.
  ###
  # If no callback is provided, we use this default one
  unless typeof callback is "function"
    callback = (file, result) ->
      if typeof result isnt "object"
        console.error "Dropzone returned an error - #{result}"
        toastStatusMessage("<strong>Error</strong> There was a problem with the server handling your image. Please try again.", "danger")
        return false
      unless result.status is true
        # Yikes! Didn't work
        result.human_error ?= "There was a problem uploading your image."
        toastStatusMessage("<strong>Error</strong> #{result.human_error}", "danger")
        console.error("Error uploading!",result)
        return false
      try
        console.info "Server returned the following result:", result
        console.info "The script returned the following file information:", file
        dropperParams.dropzone.removeAllFiles()
        toastStatusMessage("Upload complete", "success")
      catch e
        console.error("There was a problem with upload post-processing - #{e.message}")
        console.warn("Using",fileName,result)
        toastStatusMessage("<strong>Error</strong> Your upload completed, but we couldn't post-process it.", "danger")
      false
  ## The main script
  # Load dependencies
  loadJS dropperParams.md5Path
  loadJS dropperParams.dropzonePath, ->
    # Dropzone has been loaded!
    # Add the CSS
    c = document.createElement("link")
    c.setAttribute("rel","stylesheet")
    c.setAttribute("type","text/css")
    c.setAttribute("href","#{dropperParams.metaPath}css/main.min.css")
    document.getElementsByTagName('head')[0].appendChild(c)
    Dropzone.autoDiscover = false
    # See http://www.dropzonejs.com/#configuration
    defaultText = dropperParams.uploadText ? "Drop your image here."
    dragCancel = ->
      d$(uploadTargetSelector)
      .css("box-shadow","")
      .css("border","")
      d$("#{uploadTargetSelector} .dz-message span").text(defaultText)
    dropzoneConfig =
      url: "#{dropperParams.metaPath}meta.php?do=upload_image&uploadpath=#{dropperParams.uploadPath}&thumb_width=#{dropperParams.thumbWidth}&thumb_height=#{dropperParams.thumb_height}"
      acceptedFiles: "image/*"
      autoProcessQueue: true
      maxFiles: 1
      dictDefaultMessage: defaultText
      clickable: dropperParams.clickTargets
      init: ->
        # See http://www.dropzonejs.com/#events
        @on "error", (file, errorMessage) ->
          toastStatusMessage("An error occured sending your image to the server - #{errorMessage}.", "danger")
        @on "canceled", ->
          toastStatusMessage("Upload canceled.", "info")
        @on "dragover", ->
          d$("#{uploadTargetSelector} .dz-message span").text("Drop here to upload the image")
          ###
          # We want to hint a good hover -- so we use CSS
          #
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
        @on "uploadprogress", (file, progress, bytes) ->
          if dropperParams.showProgress is true
            progressBar = d$("#{uploadTargetSelector} + .image-upload-progress")
            unless progressBar.exists()
              # Show a bootstrap progress bar
              # http://getbootstrap.com/components/#progress
              html = """
              <div class="image-upload-progress">
                <div class="progress">
                  <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width:2em;">
                    <span class="upload-percent">0</span>%<span class="sr-only"> Complete</span>
                  </div>
                </div>
                <p class="text-center text-muted"><span class="bytes-done">0</span>/<span class="bytes-total">0</span> bytes</p>
              </div>
              """
              d$(uploadTargetSelector).after(html)
              progressBar = d$("#{uploadTargetSelector} + .image-upload-progress")
            progress = toInt(progress)
            # Handle the upload
            progressBar.find(".progress-bar")
            .attr("aria-valuenow",progress)
            .css("width","#{progress}%")
            progressBar.find(".upload-percent").text(progress)
            progressBar.find(".bytes-done").text(bytes)
            progressBar.find(".bytes-total").text(file.size)
        @on "success", (file, result) ->
          d$("#{uploadTargetSelector} + .image-upload-progress").remove()
          callback(file, result)
    # Create the upload target
    unless d$(uploadTargetSelector).hasClass("dropzone")
      d$(uploadTargetSelector).addClass("dropzone")
    fileUploadDropzone = new Dropzone(d$(uploadTargetSelector).get(0), dropzoneConfig)
    dropperParams.dropzone = fileUploadDropzone
  false

# Export
dropperParams.handleDragDropImage = handleDragDropImage
window.toastStatusMessage = toastStatusMessage
