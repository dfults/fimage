
var DEV_MODE = window.location.hostname === 'localhost';
var DEV_FORCE_LOGO = true;

function Fimage(id, parent) {
  var view = '';   // default view - not showing anything
  var searchString = '';
  var lightbox;
  var logoArea;
  var toolsArea;
  var viewArea;
  var toolsComponent;
  var viewComponent;
  var imageSource;
  var images = [];
  var imagePos = 0;
  var searches = [];
  var api = {
    init: function() {

      // Start with just a centered lightbox adjusted to fit the size
      // of the screen nicely
      html = '';
      html += '<div id="' + id + '" class="fimage__lightbox">';
      html += '<div class="fimage__logo-area"></div>';
      html += '<div class="fimage__tools-area"></div>';
      html += '<div class="fimage__view-area"></div>';
      html += '</div>';
      parent.innerHTML = html;

      lightbox = document.querySelector('#' + id);
      logoArea = lightbox.querySelector(' .fimage__logo-area');
      toolsArea = lightbox.querySelector(' .fimage__tools-area');
      viewArea = lightbox.querySelector(' .fimage__view-area');

      if (DEV_MODE && !DEV_FORCE_LOGO) {
        show();
      } else {
        // Flash the logo, then remove it
        logoArea.style.display = 'block';
        new FimageLogo().flashIn(logoArea, function() {
          logoArea.firstElementChild.remove();
          logoArea.style.display = 'none';
        });
        // As the logo stars fading, show the tools
        setTimeout(function() {
          show();
        }, 700);
      }

      // Init image source (at this time, only one available)
      imageSource = new FimageSourceShutterstock();
    }
  };

  var search = function() {
    console.log('Find image: ' + searchString);
    images = [];
    imagePos = 0;
    imageSource.search(searchString, function(results) {
      images = results;  // For now, just set.
      showView();  // Re-show the current view
    });
  };

  var showTools = function() {
    toolsComponent = new FimageTools(
      toolsArea,
      imageSource.getSearchPlaceholder(),

      // Search Callback
      function(searchValue) {
        searchString = searchValue;
        search();
      },

      // Previous Callback
      function() {
        if (imagePos > 0) {
          imagePos--;
          viewComponent.show(images, imagePos);
          toolsComponent.updateNavTools(images.length, imagePos);
        }
      },

      // Next Callback
      function() {
        if (imagePos < images.length - 1) {
          imagePos++;
          viewComponent.show(images, imagePos);
          toolsComponent.updateNavTools(images.length, imagePos);
        }
      }
    );
    toolsComponent.show(view);
  };

  var showView = function() {
    if (!view) {
      view = 'image';
    }
    if (view === 'image') {
      viewComponent = new FimageImageView(viewArea);
    } else if (view === 'gallery') {
      //viewComponent = new FimageGalleryView(viewArea);
    }
    viewComponent.show(images, imagePos);
    toolsComponent.updateNavTools(images.length, imagePos);
  };

  var show = function() {

    // Show the tools & re-invoke last search
    showTools();
    showView();
    search();
  };

  window.addEventListener('resize', function() {

    // Update view presentation to adjust for window size change
    showView();
  });

  return api;
}






