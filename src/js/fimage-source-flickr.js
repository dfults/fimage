//////////////////////////////////////////////////////////////////////////
//
// FimageSourceFlickr
//
// An image source which fetch images per search term from Flickr
// Public APIs, then reformats as desired for use within Fimage.
//
// Produces array of image, as passed back via callback, provides image data
// in the following format:
//    url     - fully qualified url to actual image
//    width   - image width in pixels
//    height  - image height in pixels
//    title   - title or description of image, may include HTML such as links
//
//////////////////////////////////////////////////////////////////////////

function FimageSourceFlickr() {

  var API_URL = 'https://api.flickr.com/services';

  // Flickr App Id
  var api_key = '667766fbd83a0f90db2e3c507d9e1b2d';

  var jsonFlickrApi = function(object) {
    return object;
  };

  var getPhotoInfo = function(image, callback) {
    var params = {
      api_key: api_key,
      format: 'json',
      method: 'flickr.photos.getSizes',
      photo_id: image.id
    };
    Fimage.simpleAjax('GET', API_URL + '/rest/', params, null /* postData */,
      null /* headerData */,
      function(flickrResponse) {
        var response = eval(flickrResponse);
        if (response.stat !== 'ok') {
          return null;

        }

        // Lookup size for image 500 pixels wide, which is what the standard
        // Url returned is for
        var sizes = response.sizes.size;
        var size;
        for (var i in sizes) {
          size = sizes[i];
          if (parseInt(size.width) === 500) {
            break;
          }
        }
        var photoInfo = {
          id: image.id,
          url: image.url,  // The origianal 500 pixel image
          title: image.title,
          width: parseInt(size.width, 10),
          height: parseInt(size.height, 10)
        };
        callback(photoInfo);
      }
    );
  };

  var api = {
    search: function(q, callback) {
      if (!q) {
        callback([]);
        return;

      }
      var params = {
        api_key: api_key,
        format: 'json',
        per_page: 50,
        method: 'flickr.photos.search',
        text: q
      };
      Fimage.simpleAjax('GET', API_URL + '/rest/', params, null /* postData */,
        null /* headerData */,
        function(flickrResponse) {
          var response = eval(flickrResponse);
          if (response.stat !== 'ok') {
            return;

          }
          var photos = response.photos;

          // Normalize the Flickr image data to what fimage is designed to use
          var images = [];

          if (photos) {
            var data = photos.photo;
            for (var i in data) {
              var photo = data[i];
              // The format for a 500x500 space in which the photo fits
              // is {farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
              var url = 'https://farm';
              url += photo.farm;
              url += '.staticflickr.com/';
              url += photo.server;
              url += '/';
              url += photo.id;
              url += '_';
              url += photo.secret;
              url += '.jpg';
              var image = {
                id: photo.id,
                url: url,
                title: Fimage.escapeHtml(photo.title),
                info: function(image, callback) {
                  getPhotoInfo(image, callback);
                }
              };
              images.push(image);
            }
          }
          callback(images);
        });
    },
    getSearchPlaceholder: function() {

      // Provide the placeholder string to use in the search field while
      // prompting the user to search for only flickr public images
      return 'search flickr photos';
    }
  };
  return api;
}


