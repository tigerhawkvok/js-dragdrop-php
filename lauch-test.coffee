###
# Test initialization and callback
###

dropTargetSelector = "#new-message"

postUploadCallback = (file, result) ->
  ###
  # A sample callback function for handleDragDropImage
  #
  # The "file" object contains information about the uploaded file,
  # such as name, height, width, size, type, and more. Check the
  # console logs in the demo for a full output.
  #
  # The result object contains the results of the upload. The "status"
  # key is true or false depending on the status of the upload, and
  # the other most useful keys will be "full_path" and "thumb_path".
  ###
  # Clear out the file uploader
  window.dropperParams.dropzone.removeAllFiles()
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
    mediaType = result.mime_provided.split("/")[0]

    html = switch mediaType
      when "image" then """
        <div class='message-media'>
          <a href="#{result.full_path}" class="newwindow">
            <img src="#{result.thumb_path}" />
          </a>
          <p class="text-muted">Click the thumbnail for a full-sized image (#{file.name})</p>
        </div>
        """
      when "audio" then """
      <div class="message-media">
        <audio src=#{result.full_path} controls preload="auto">
          <img src="#{result.thumb_path}" alt="Audio Thumbnail" class="img-responsive" />
          <p>
            Your browser doesn't support the HTML5 <code>audio</code> element.
            Please download the file below.
          </p>
        </audio>
        <p class="text-muted">
          (<a href="#{result.full_path}" class="newwindow" download="#{file.name}">
            Original Media
          </a>)
        </p>
      </div>
      """
      when "video" then """
      <div class="message-media">
        <video src=#{result.full_path} controls preload="auto">
          <img src="#{result.thumb_path}" alt="Audio Thumbnail" class="img-responsive" />
          <p>
            Your browser doesn't support the HTML5 <code>video</code> element.
            Please download the file below.
          </p>
        </video>
        <p class="text-muted">
          (<a href="#{result.full_path}" class="newwindow" download="#{file.name}">
            Original Media
          </a>)
        </p>
      </div>
      """
    $("#chat-region").append(html)
    mapNewWindows()
  catch e
    console.error("There was a problem with upload post-processing - #{e.message}")
    console.warn("Using",fileName,result)
    toastStatusMessage("<strong>Error</strong> Your upload completed, but we couldn't post-process it.", "danger")
  false

$ ->
  # Configuration
  window.dropperParams.metaPath = "http://velociraptorsystems.com/samples/js-dragdrop-upload/"
  window.dropperParams.showProgress = true
  window.dropperParams.clickTargets = ["#do-upload-image"]
  window.dropperParams.handleDragDropImage dropTargetSelector, postUploadCallback
