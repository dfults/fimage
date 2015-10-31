
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
        new FimageLogo().flashIn(logoArea, function () {
          logoArea.firstElementChild.remove();
          logoArea.style.display = 'none';
        });
        // As the logo stars fading, show the tools
        setTimeout(function() {
          show();
        }, 700);
      }
    }
  };

  var search = function() {
    console.log('Find image: ' + searchString);

    images = [];
    if (searchString) {
      var image = {
        url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSi958u22R8Dt1dPk0sMXN8l_EG91v3XKCN5QzaC__NRngka160',
        width: 594,
        height: 381
      };
      images.push(image);
      var image2 = {
        url: 'http://images2.roomstogo.com/is/image/roomstogo/lr_sof_10111413_lilithpond~Lilith-Pond-Taupe-Sofa.jpeg%3F$PDP_Primary_525x366$',
        width: 594,
        height: 381
      };
      images.push(image2);
    }
    showView();  // Re-show the current view
  };

  var showTools = function() {
    toolsComponent = new FimageTools(toolsArea,

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






