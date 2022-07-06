export const getUrlVars = () => {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
};
/**
 * var fType = getUrlVars()["type"];
 *
 */

export const isValideEmail = (input) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
    return true;
  }
  return false;
};

export const testPassword = (pwString) => {
  var strength = 0;
  strength += /[A-Z]+/.test(pwString) ? 1 : 0;
  strength += /[a-z]+/.test(pwString) ? 1 : 0;
  strength += /[0-9]+/.test(pwString) ? 1 : 0;
  strength += /[\W]+/.test(pwString) ? 1 : 0;

  switch (strength) {
    case 3:
      return "medium";
    case 4:
      return "strong";
    default:
      return "weak";
  }
};
export const calculate_age = (date) => {
  const millis = Date.now() - Date.parse(date);
  return new Date(millis).getFullYear() - 1970;
};

// usage
