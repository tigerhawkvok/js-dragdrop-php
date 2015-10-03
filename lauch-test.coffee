###
# Test initialization and callback
###

dropTargetSelector = "#new-message"

postUploadCallback = ->
  false

$ ->
  window.dropperParams.metaPath = "http://velociraptorsystems.com/samples/js-dragdrop-upload/"
  window.dropperParams.handleDragDropImage dropTargetSelector
