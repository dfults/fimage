//////////////////////////////////////////////////////////////////////////
//
// FimageImageView
//
// A single-Image view
//
// Breaks up the view area into a center large image area & spaces off
// to the left & right (for possible use as either arrows or smaller
// previews of previous & next images, theough just being used for layout
// at the moment.
//
// Presents the title directly underneath the image, checking on the resulting
// spacing to make sure it's right below the image, and not always at the
// bottom of the view area.
//
//////////////////////////////////////////////////////////////////////////

function FimageImageView(parent) {
  var images = [];
  var imagePos = 0;
  var center;

  var render = function() {
    var html = '';
    html += '<div class="fimage-image-view">';
    html += '<div class="fimage-image-view__center"></div>';
    html += '<div class="fimage-image-view__left"></div>';
    html += '<div class="fimage-image-view__right"></div>';
    html += '</div>';
    return html;
  };


  var api = {
    show: function(imagesToShow, positionToShow) {
      images = imagesToShow;
      imagePos = positionToShow;
      parent.innerHTML = render();
      center = parent.querySelector('.fimage-image-view__center');
      if (images.length) {
        var image = images[imagePos];
        var imageComponent = new FimageImage(center);
        imageComponent.show(image);
        var title = document.createElement('div');
        title.classList.add('fimage-image-view__title');
        title.style.top = '-' + (imageComponent.getSpacing().vertical + 5) +
            'px';

        // Note the image title is already escaped, may include html
        title.innerHTML = image.title;
        center.appendChild(title);
      }
    },
    navigate: function(positionToShow) {
      if (!images.length) {
        return;

      }

      // Fade current pic, then let the new pic fade itself in
      center.firstChild.style.opacity = '0.7';
      setTimeout(function() {
        var imageComponent = new FimageImage(center).show(images[imagePos]);
      }, 200);
    }

  };
  return api;
}

