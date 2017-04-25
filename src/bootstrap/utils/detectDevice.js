const MobileDetect = require('mobile-detect');

module.exports = function detectDevice(userAgent, cookie, auto) {
  // we don't want to detect the device
  if (!auto) {
    return null;
  }

  // device is set by cookie
  if (cookie === 'mobile' || cookie === 'desktop') {
    return cookie;
  }

  // detect device from user agent
  const md = new MobileDetect(userAgent);
  if (md.mobile() !== null) {
    if (md.phone() !== null) {
      // phone
      return 'mobile';
    }
    // tablet
    return 'desktop';
  }
  // desktop
  return 'desktop';
};
