const DeviceDetector = require('device-detector-js');

module.exports = function detectDevice(source, cookies, config) {
  const { detection, cookieName } = config;

  // we don't want to detect the device
  if (!detection) {
    return null;
  }

  const cookie = cookies.get(cookieName);

  // device is set by cookie
  if (cookie === 'mobile' || cookie === 'desktop') {
    return cookie;
  }

  // detect device from user agent
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(source);

  if (device.device && device.device.type === 'smartphone') {
    // phone
    return 'mobile';
  }

  // desktop
  return 'desktop';
};
