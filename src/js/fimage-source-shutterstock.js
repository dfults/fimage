//////////////////////////////////////////////////////////////////////////
//
// FimageSourceShutterstock
//
// An image source which fetch images per search term from the Shutterstock
// Public APIs, then reformats as desired for use within Fimage.
//
// Directly includes the Shutterstock credentials, making them vulnernable,
// but without our own authentication system & a backend to monitor and
// relay such requests that's what must be done.  As a free service that
// would undoubtedly be rate limited or even blocked should the credentials
// be put to excessive use, the risk is limited to fimage.us failing to
// retrieve Shutterstock // images.
//
// Produced array of image, as passed back via callback, provides image data
// in the following format:
//    url     - fully qualified url to actual image
//    width   - image width in pixels
//    height  - image height in pixels
//    title   - title or description of image, may include HTML such as links
//
//////////////////////////////////////////////////////////////////////////

function FimageSourceShutterstock() {

  var API_URL_BASE = 'https://api.shutterstock.com/v2/';

  // Shutterstock uses basic authentication, these are the credentials for
  // the "fimage" application registered with Shutterstock
  var getAuthorization = function() {
    var clientId = 'de95102af805663687dd';
    var clientSecret = 'e555564d2aee0ecd900bba125bfa2e60a4a9ecac';
    return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
  };

  var api = {
    search: function(q, callback) {
      if (!q) {
        callback([]);
        return;

      }
      var params = {

        // Fetch the 100 most popular images for this query
        image_type: 'photo',
        page: 1,
        per_page: 100,
        sort_method: 'popular'
      };
      var url = API_URL_BASE;
      if (q.indexOf('similar to #') === 0) {
        var id = q.substring('similar to #'.length, q.length);
        url += 'images/' + id + '/similar';
      } else {
        url += 'images/search';
        params.query = q;
      }
      var headerData = {
        'Authorization' : getAuthorization()
      };
      Fimage.simpleAjax('GET', url, params, null /* postData */, headerData,
          function(jsonResponse) {

        var response = JSON.parse(jsonResponse);
        var total = response.total_count;

        // Normalize the ShutterStock image data to what fimage is designed
        // to use
        var images = [];
        var data = response.data;
        if (data) {
          for (var i in data) {
            var photoData = data[i];
            var description = photoData.description;
            var preview = photoData.assets.preview;
            var url = preview.url;
            var width = preview.width;
            var height = preview.height;
            var id = photoData.id;
            var viewSimilarLink = '<a href="#" ' +
              'class="fimage__link" ' +
              'data-search="similar to #' + id + '"' +
              '>view similar</a>';
            var buyLink = '<a class="fimage__link"' +
              'target="_blank" ' +
              'href="http://www.shutterstock.com/pic-' + id + '"' + '>shutterstock.com</a>';
            var image = {
              url: url,
              width: width,
              height: height,
              title: Fimage.escapeHtml(description) + viewSimilarLink + buyLink
            };
            images.push(image);
          }
        }
        callback(images);
      });
    },
    getSearchPlaceholder: function() {

      // Provide the placeholder string to use in the search field while
      // prompting the user to search for only shutterstock images
      return 'search shutterstock images';
    }
  };
  return api;
}

