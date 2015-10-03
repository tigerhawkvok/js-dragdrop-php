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
    fileName = file.name
    # Disable the selector
    dropperParams.dropzone.disable()
    # Now, process the rename and insert it into the file area
    # Get the MD5 of the original filename
    ext = fileName.split(".").pop()
    # MD5.extension is the goal
    fullFile = "#{md5(fileName)}.#{ext}"
    fullPath = "#{dropperParams.uploadPath}#{fullFile}"
    # Insert it into the field
    d$("#edit-image")
    .attr("disabled","disabled")
    .attr("value",fullPath)
    toastStatusMessage("Upload complete", "success")
  catch e
    console.error("There was a problem with upload post-processing - #{e.message}")
    console.warn("Using",fileName,result)
    toastStatusMessage("<strong>Error</strong> Your upload completed, but we couldn't post-process it.", "danger")
  false

$ ->
  window.dropperParams.metaPath = "http://velociraptorsystems.com/samples/js-dragdrop-upload/"
  window.dropperParams.handleDragDropImage dropTargetSelector, postUploadCallback
