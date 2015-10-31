
function FimageLogo() {
  var render = function () {
    var html = '';
    html += '<div id="fimage-logo" class="fimage-logo fimage--trans-opacity" style="opacity: 0.0">';
    html += '<div class="fimage-logo__name"></div>';
    html += '<div class="fimage-logo__tagline"></div>';
    html += '</div>';
    return html;
  };
  var api = {
    flashIn: function(parent, callback) {
      var html = render();
      parent.innerHTML = html;
      setTimeout(function() {
        var logo = document.getElementById('fimage-logo');
        logo.style.opacity = '1.0';
        setTimeout(function() {
          logo.style.opacity = '0.0';
          setTimeout(function() {
            callback();
          }, 700);
        }, 2800);
      }, 200);
    }
  };
  return api;
}

