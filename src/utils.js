// for a url such as http://woot.com?foo=bar&bat=baz
// returns: { foo: "bar", bat: "baz" }
function getQueryParams() {
  var queryString = window.location.href.split('?')[1];
  if (!queryString) return {};

  var params = queryString.split('&');

  var paramsObj = {};

  params.forEach(function(param, i) {
    var s = param.split('=');
    paramsObj[s[0]] = s[1];
  });

  return paramsObj;
}

module.exports = {
  getQueryParams: getQueryParams
};
