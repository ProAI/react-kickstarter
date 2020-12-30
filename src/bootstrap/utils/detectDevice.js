const DeviceDetector = require('device-detector-js');

module.exports = function detectDevice(req, cookies, config) {
  // we don't want to detect the device
  if (!config.deviceDetection) {
    return null;
  }

  const cookie = cookies.get(config.deviceCookieName);

  // device is set by cookie
  if (cookie === 'mobile' || cookie === 'desktop') {
    return cookie;
  }

  // detect device from user agent
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.parse(req.headers['user-agent']);

  if (device.device && device.device.type === 'smartphone') {
    // phone
    return 'mobile';
  }

  // desktop
  return 'desktop';
};
