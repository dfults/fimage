
function FimageSourceShutterstock() {

  var API_URL = 'https://api.shutterstock.com/v2/images/search';

  var getAuthorization = function() {
    var clientId = 'de95102af805663687dd';
    var clientSecret = 'e555564d2aee0ecd900bba125bfa2e60a4a9ecac';
    return 'Basic ' + window.btoa(clientId + ':' + clientSecret) ;
  };

  var api = {
    search: function(q, callback) {
      if (!q) {
        callback([]);
        return;

      }
      var params = {
        query: q,
        image_type: 'photo'
      };
      var headerData = {
        'Authorization' : getAuthorization()
      };
      simpleAjax('GET', API_URL, params, null /* postData */, headerData, function(jsonResponse) {

        var response = JSON.parse(jsonResponse);
        var total = response.total_count;

        // Normalize the ShutterStock image data to what we use
        var images = [];
        var data = response.data;
        for (var i in data) {
          var description = data[i].description;
          var preview = data[i].assets.preview;
          var url = preview.url;
          var width = preview.width;
          var height = preview.height;
          var image = {
            url : url,
            width: width,
            height: height,
            title: description
          };
          images.push(image);
        }
        callback(images);
      });
    },
    getSearchPlaceholder: function() {
      return 'search shutterstock images';
    }
  };
  return api;
}
