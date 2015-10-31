
function FimageImageView(parent) {
  var images = [];
  var imagePos = 0;
  var center;
  var render = function () {
    var html = '';
    html+= '<div class="fimage-image-view">';
    html+= '<div class="fimage-image-view__center">';
    html+= '</div>';
    html+= '<div class="fimage-image-view__left">';
    html+= '</div>';
    html+= '<div class="fimage-image-view__right">';
    html+= '</div>';
    html+= '</div>';
    return html;
  };
  var api = {
    show: function (imagesToShow, positionToShow) {
      images = imagesToShow;
      imagePos = positionToShow;
      parent.innerHTML = render();
      center = parent.querySelector('.fimage-image-view__center');
      if (images.length) {
        var imageComponent = new FimageImage(center).show(images[imagePos]);
      }
    },
    navigate: function(positionToShow) {
      if (!images.length) {
        return;

      }
      center.firstChild.style.opacity = '0.7';  // Fade current pic, then let the new pic fade itself in
      setTimeout(function() {
        var imageComponent = new FimageImage(center).show(images[imagePos]);
      }, 200);
    }

  };
  return api;
}

