//////////////////////////////////////////////////////////////////////////
//
// Simple Ajax function functionality in lieu of an available library
// implementation, designed as a function instead of a module for easier
// switching to common implementations if desired.
//
//////////////////////////////////////////////////////////////////////////

Fimage.simpleAjax = function(
    method,      // GET, PUT, etc.
    url,         // Fully qualified Url but without qeuery or anchor
    params,      // Object holding parameters to be encoded & serialized
    postData,    // For PUTs:  Object holding header data to set
    headerData,  // Object holding header data to set, e.g.
                 //     {Content-type: 'application/json; charset=utf-8'}
    callbackFunction  // Function to be called back with response & status
) {
  var xhreq = false;
  if (window.ActiveXObject) {
    xhreq = new ActiveXObject(/*NO*/'Microsoft.XMLHTTP');
  } else if (window.XMLHttpRequest) {
    xhreq = new XMLHttpRequest();
  }
  if (xhreq) {
    xhreq.onreadystatechange = function() {
      switch (xhreq.readyState) {
        case 4:
          if ((xhreq.status == 200) ||
              ((xhreq.status == 0 && xhreq.responseText))) {
            callbackFunction(xhreq.responseText, xhreq.status);
          }
          break;
        default:
          break;
      }
    };
    var query = '';
    if (params) {
      for (var i in params) {
        query += !query.length ? '?' : '&';
        query += i + '=' + encodeURIComponent(params[i]);
      }
    }
    xhreq.open(method, url + query, true);
    if (headerData) {
      for (var i in headerData) {
        if (i === 'Authentication') {
          xhreq.withCredentials = true;
        }
        xhreq.setRequestHeader(i, headerData[i]);
      }
    }
    xhreq.send(postData || '');
  } else {
    console.log('WARNING: browser does not support XHReq!');
  }
  return xhreq;
};

