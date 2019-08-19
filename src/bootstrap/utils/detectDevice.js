const DeviceDetector = require('device-detector-js');

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
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(userAgent);

  if (device.device && device.device.type === 'smartphone') {
    // phone
    return 'mobile';
  }

  // desktop
  return 'desktop';
};
