//
// A simple Ajax function in lieu of a fuller library implementation.
//
// Pass:
// method: GET, PUT, etc.
// url:  fully qualified Url but without qeuery or anchor
// params: Object holding parameters to be encoded & serialized
// postData (for PUTs):  Object holding header data to set
// headerData:  Object holding header data to set, e.g. {Content-type: 'application/json; charset=utf-8'}
// callbackFunction:  function to be called back with response & status
//
simpleAjax = function(method, url, params, postData, headerData, callbackFunction) {
  var xhreq = false;
  if (window.ActiveXObject) {
    xhreq = new ActiveXObject(/*NO*/'Microsoft.XMLHTTP');
  } else if (window.XMLHttpRequest) {
    xhreq = new XMLHttpRequest();
  }
  if(xhreq) {
    xhreq.onreadystatechange = function() {
      switch (xhreq.readyState) {
        case 4:
          if ((xhreq.status==200) || ((xhreq.status==0 && xhreq.responseText))) {
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
    console.log('WARNING: browser does not support XHreq');
  }
  return xhreq;
};

