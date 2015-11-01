//////////////////////////////////////////////////////////////////////////
//
// FimageGalleryView
//
// Just a shell, a work in progress.
//
// More TODO's: Will require some adjustments to the various interaces:
//
// ImageSource:  Will want to have thumbnails in common fimage image data for
//               faster rendering.  Also may be feasible to quickly get through
//               more than 100 images, in which
// View:         Need to adjust to account for the paging of N  photos per page
// Tools:        Adjust Next/Prev interface for paging of multi-image pages,
//               add tool for switching between individual photo & gallery
//
//////////////////////////////////////////////////////////////////////////

function FimageGalleryView(parent) {
  var images = [];
  var imagePos = 0;
  var render = function() {
    var html = '';
    html += '<div class="fimage-image-view">';

    // TODO:  the actual gallery view

    html += '</div>';
    return html;
  };
  var api = {
    show: function(imagesToShow, positionToShow) {
      images = imagesToShow;
      imagePos = positionToShow;
      parent.innerHTML = render();
    },
    navigate: function(positionToShow) {
      if (!images.length) {
        return;

      }
      // TODO: navigate to view a new image position
    }
  };
  return api;
}

