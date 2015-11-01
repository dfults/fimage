//
// A simple Ajax function in lieu of a fuller library implementation.
//
// headerData:  Object holding header data to set, e.g. {Content-type: 'application/json; charset=utf-8'}
//
simpleAjax = function(method, url, params, postData, headerData, callbackFunction) {
  var xhreq = function() {
    if (window.ActiveXObject) {
      return new ActiveXObject(/*NO*/'Microsoft.XMLHTTP');
    } else if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
    return false;
  }();

  if(xhreq) {
    if (!postData) postData = "";
    if (!headerData) headerData = "";
    xhreq.onreadystatechange = function() {
      switch (xhreq.readyState) {
        case 1:
          xhreq.t1 = new Date().getTime();  // Not the start of state 1
          break;
        case 2:
          xhreq.t2 = new Date().getTime();
          break;
        case 3:
          break;
        case 4:
          var connectDelay = xhreq.t2  - xhreq.t1;
          console.log("Xhreq time to connect: " + connectDelay + "ms");
          if ((xhreq.status==200) || ((xhreq.status==0 && xhreq.responseText))) {
            if (xhreq.status==0) {
              console.log("XHxhreq returned status of 0, but there appears to be responseText, so assuming OK");
            }
            // Success!  As expected
            callbackFunction(xhreq.responseText, xhreq.status, connectDelay);
          } else if (xhreq.status==0) {  // Except if status 0 and there is no reponseText, we have a problem...
            console.log("XHxhreq returned status of 0 but no responseText, statusText '" + xhreq.statusText + "'");
            console.log("URL was " + url);
            console.log("document.domain is '" + document.domain + "'");
            callbackFunction(xhreq.responseText, xhreq.status, connectDelay);
          } else {
            // Some other status entirely...
            console.log("XHxhreq returned status of '" + xhreq.status + "' statusText '" + xhreq.statusText + "'");
            console.log("URL was " + url);
            console.log("document.domain is '" + document.domain + "'");
            callbackFunction(xhreq.responseText, xhreq.status, connectDelay);
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
      console.log('Query is ' + query);
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
    xhreq.send(postData);
  }
  return xhreq;
};
