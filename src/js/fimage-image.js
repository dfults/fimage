//////////////////////////////////////////////////////////////////////////
//
// FimageImage
//
// Single image presentation of an "imageToShow" within a parent.
//
// Expects image object to include:
//    url     - fully qualified url to actual image
//    width   - image width in pixels
//    height  - image height in pixels
//    title   - title or description of image, may include HTML such as links
//
// Inspects the parent element size to determine how large the image can
// be made and yet fit in its entirety within the parent, adding spacing
// either above and below or to the left and right of the image.
//
//////////////////////////////////////////////////////////////////////////

function FimageImage(parent) {
  var image;
  var imageEl;
  var spacing = {};

  var render = function() {
    var imageUrl = image.url;
    var imageWidth = image.width;
    var imageHeight = image.height;

    var imageRatio = imageHeight / imageWidth;
    var canvasWidth = parent.clientWidth;
    var canvasHeight = parent.clientHeight;
    var canvasRatio = canvasHeight / canvasWidth;

    var backgroundWidth, backgroundHeight, positionX, positionY;
    if (imageRatio > canvasRatio) {

      // Image will be constrained by the height of the canvas space
      backgroundHeight = canvasHeight;
      backgroundWidth = canvasHeight / imageRatio;
      spacing.vertical = 0;
      spacing.horizontal = (canvasWidth - backgroundWidth) / 2;

    } else {

      // Image will be constrained by the width of the canvas space
      backgroundWidth = canvasWidth;
      backgroundHeight = canvasWidth * imageRatio;
      spacing.horizontal = 0;
      spacing.vertical = (canvasHeight - backgroundHeight) / 2;
    }
    positionY = spacing.vertical;
    positionX = spacing.horizontal;

    var html = '';
    html += '<div class="fimage-image fimage--trans-opacity-fast" style="';
    html += 'opacity: 0.7;';
    html += "background-image:url('" + imageUrl + "');";
    html += 'background-repeat:no-repeat;';
    html += 'background-size:' + backgroundWidth + 'px auto;';
    html += 'background-position:' + positionX + 'px ' + positionY + 'px;';
    html += '">';
    html += '</div>';
    return html;
  };

  var api = {
    show: function(imageToShow) {
      image = imageToShow;
      parent.innerHTML = render();
      imageEl = parent.querySelector(' .fimage-image');
      setTimeout(function() {
        imageEl.style.opacity = '1.0';
      });
    },
    getSpacing: function() {
      return spacing;
    }
  };
  return api;
}


