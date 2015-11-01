//////////////////////////////////////////////////////////////////////////
//
// FimageGalleryView
//
// Not yet used; when completed should match API for fimage-image-view.js
//
//////////////////////////////////////////////////////////////////////////

function FimageGalleryView(parent) {
  var images = [];
  var imagePos = 0;
  var render = function() {
    var html = '';
    html += '<div class="fimage-image-view">';
    html += '</div>';
    return html;
  };
  var api = {
    show: function(imagesToShow, positionToShow) {
      images = imagesToShow;
      imagePos = positionToShow;
      parent.innerHTML = render();
    }
  };
  return api;
}

