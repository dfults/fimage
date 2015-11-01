//////////////////////////////////////////////////////////////////////////
//
// fimage
//
// A demonstration of accessing a public API to fetch & display images
// in a simple single-page web application.  Visible online at fimage.us
// or dfults.github.com/fimage
//
// Features
//
// * Simple logo sequence
// * Clean initial search UI with tools hidden until useful
// * Search input is debounced, so actual search isn't performed until
//   user hits return or stops typing
// * 'X" tool to clear search
// * Views & ImageSources are treated as (future)replaceable modules
// * ImageSource (initially for Shutterstock) provides image array in
//   standard format, which is then passed to the view for presentation.
// * Support for source-specific custom links in title, for shutterstock
//   "View Similar" and a link to the image on their site
// * View presents images as it likes, initial single image view presents title
// * Tools area updates visibility of prev/next areas per view
// * Responsive design allows window to be sized narrowly down to phone widths
//
// Designed as a series of JS modules and CSS restricted to the Fimage*
// name space, making it easy to incorporate into a larger application:
//
// Fimage - this top module, of which a single instance is created in index.htm
// FimageLogo - displays the logo & any effects thereof
// FimageTools - all the tools surround the actual image view area
// FimageImageView - one of potential several image views (gallery next?)
// FimageSourceShutterstock - one of potential several image sources
// FImageImage - single image presentation within a parent element
//
// and one utility:
//
// Fimage.simpleAjax - simple ajax functionality
//
// Author: Doug Fults
//
//////////////////////////////////////////////////////////////////////////

function Fimage(id, parent) {
  var view = '';          // String name of current view (init to none)
  var searchString = '';  // And no search string
  var lightboxEl;         // Element references
  var logoAreaEl;
  var toolsAreaEl;
  var viewAreaEl;
  var toolsComponent;     // Components we're using to generate these areas
  var viewComponent;
  var imageSourceComponent;
  var images = [];        // Current set of images to display
  var imagePos = 0;       // .. and the current image #
  var searches = [];      // Searches made by user this session

  var init = function() {

    // Start with just a centered lightboxEl adjusted to fit the size
    // of the screen nicely
    html = '';
    html += '<div id="' + id + '" class="fimage fimage__lightbox">';
    html += '<div class="fimage__logo-area"></div>';
    html += '<div class="fimage__tools-area"></div>';
    html += '<div class="fimage__view-area"></div>';
    html += '</div>';
    parent.innerHTML = html;

    // Fetch elements we commonly reference
    lightboxEl = document.querySelector('#' + id);
    logoAreaEl = lightboxEl.querySelector(' .fimage__logo-area');
    toolsAreaEl = lightboxEl.querySelector(' .fimage__tools-area');
    viewAreaEl = lightboxEl.querySelector(' .fimage__view-area');

    viewAreaEl.addEventListener('mousedown', tap);
    viewAreaEl.addEventListener('touch', tap);

    // Present logo, fade in UI
    if (DEV_MODE && !DEV_FORCE_LOGO) {
      show();
    } else {

      // Flash the logo, then remove it
      logoAreaEl.style.display = 'block';
      new FimageLogo().flashIn(logoAreaEl, function() {
        logoAreaEl.firstElementChild.remove();
        logoAreaEl.style.display = 'none';
      });

      // Init image source (at this time, only one available)
      imageSourceComponent = new FimageSourceShutterstock();

      // As the logo stars fading, show the tools & view
      setTimeout(function() {

        // Show the tools, current view
        showTools();
        showView();

        // Re-invoke last search if any
        search();

      }, 700);
    }
  };

  var tap = function(ev) {
    var target = ev.target;

    // If user taps on a link with "data-search" attribute, search on
    // the value of that attribute.
    if (target.classList.contains('fimage__link')) {
      var searchAction = target.getAttribute('data-search');
      if (searchAction) {
        searchString = searchAction;
        toolsComponent.updateSearchString(searchString);
        search();
      }
    }
    ev.preventDefault();
    return false;
  };

  var showTools = function() {

    // Fill in the toolsArea with standard tools, of which we have only
    // one type at present:
    toolsComponent = new FimageTools(
      toolsAreaEl,
      imageSourceComponent.getSearchPlaceholder(),

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

    // Fill the viewarea with the desired current view style, supporting:
    // ''        - no view
    // 'image'   - a single big image view
    // 'gallery' - a gallery view (IN DEVELOPMENT)
    if (!view) {
      view = 'image';
    }
    if (view === 'image') {
      viewComponent = new FimageImageView(viewAreaEl);
    } else if (view === 'gallery') {
      viewComponent = new FimageGalleryView(viewAreaEl);
    }
    viewComponent.show(images, imagePos);
    toolsComponent.updateNavTools(images.length, imagePos);
  };

  var search = function() {

    // Search current image source with a given string and
    // update the current view with the results
    images = [];
    imagePos = 0;
    imageSourceComponent.search(searchString, function(results) {
      images = results;  // For now, just set.
      showView();  // Re-show the current view
    });
  };

  window.addEventListener('resize', function() {

    // On window resize, re-layout the view.  Note that the core
    // HTML & Tool areas are set up to automatically adjust via
    // CSS only.
    showView();
  });

  var api = {
    init: function() {
      init();
    }
  };
  return api;
}






