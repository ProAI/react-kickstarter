import MobileDetect from 'mobile-detect';

export default function detectDevice(userAgent) {
  const md = new MobileDetect(userAgent);
  if (md.mobile() !== null) {
    if (md.phone() !== null) {
      // phone
      return 'mobile';
    } else {
      // tablet
      return 'desktop';
    }
  } else {
    // desktop
    return 'desktop';
  }
};
