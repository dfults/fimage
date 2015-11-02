
// A simple HTML text escape routine compliments of Moustache, to guard
// against chars in image titles that have specific meaning in HTML
Fimage.entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
Fimage.escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function(s) {
    return Fimage.entityMap[s];
  });
};
