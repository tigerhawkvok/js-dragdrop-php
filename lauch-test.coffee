###
# Test initialization and callback
###

dropTargetSelector = "#new-message"

postUploadCallback = ->
  false

$ ->
  window.dropperParams.handleDragDropImage dropTargetSelector, postUploadCallback
