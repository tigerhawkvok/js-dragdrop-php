###
# Test initialization and callback
###

dropTargetSelector = "#drop-target"

postUploadCallback = (file, result) ->
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
    html = """
    <div class='message'>
      <a href="#{result.full_path}" class="newwindow">
        <img src="#{result.thumb_path}" />
      </a>
      <p class="text-muted">Click the thumbnail for a full-sized image (#{file.name})</p>
    </div>
    """
    dropperParams.dropzone.removeAllFiles()
    $("#chat-region").append(html)
    mapNewWindows()
  catch e
    console.error("There was a problem with upload post-processing - #{e.message}")
    console.warn("Using",fileName,result)
    toastStatusMessage("<strong>Error</strong> Your upload completed, but we couldn't post-process it.", "danger")
  false

$ ->
  window.dropperParams.metaPath = "http://velociraptorsystems.com/samples/js-dragdrop-upload/"
  window.dropperParams.handleDragDropImage dropTargetSelector, postUploadCallback
