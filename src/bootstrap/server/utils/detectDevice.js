const DeviceDetector = require('device-detector-js');

module.exports = function detectDevice(req, config) {
  const { detection, cookieName } = config;

  // we don't want to detect the device
  if (!detection) {
    return null;
  }

  const cookie = req.cookies[cookieName];

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
