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
  var spacing;

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
      spacing = {};
      spacing.top = spacing.bottom = 0;
      spacing.left = spacing.right = (canvasWidth - backgroundWidth) / 2;

    } else {

      // Image will be constrained by the width of the canvas space
      backgroundWidth = canvasWidth;
      backgroundHeight = canvasWidth * imageRatio;
      spacing = {};
      spacing.left = spacing.right = 0;
      spacing.top = 0.4 * (canvasHeight - backgroundHeight);
      spacing.bottom = 0.6 * (canvasHeight - backgroundHeight);
    }
    positionY = spacing.top;
    positionX = spacing.left;

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
    show: function(imageToShow, callback) {
      var showLow = function() {
        parent.innerHTML = render();
        imageEl = parent.querySelector(' .fimage-image');
        setTimeout(function() {
          imageEl.style.opacity = '1.0';
        });
      };
      image = imageToShow;
      if (image.width && image.height) {
        showLow();
        callback();
      } else {

        // If no Url, then we need to call the "inof" function to fetch that &
        // other info we need to be able to render the image.
        if (image.info) {
          image.info(image, function(imageInfo) {
            image = imageInfo;
            showLow();
            callback();
          });
        }
      }
    },
    getSpacing: function(callback) {
      return spacing;
    }
  };
  return api;
}


