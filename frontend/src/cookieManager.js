function getCookie(name) {
  // Split the cookies string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");

  // Loop through the array and find the named cookie
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  console.log("no cookie for this site");
  // If the named cookie does not exist, return null
  return null;
}

function setJwtCookie(token) {
  // Set the expiration date to one hour from now
  var expires = new Date();
  expires.setTime(expires.getTime() + 1 * 60 * 60 * 1000);

  // TODO add the httponly mode
  // Set the JWT
  document.cookie = "jwt=" + token + ";expires=" + expires.toUTCString(); //";httponly";
}

export default {
  getCookie: getCookie,
  setJwtCookie,
};
