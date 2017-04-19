'use strict';

export function iframeResolver (rule, applicant) {
  switch (rule) {
    case 0:
      if (true === applicant) {
        return false;
      }
      return true;
    case 1:
      if (true === applicant) {
        return true;
      }
      return false;
    case 2:
    default:
      return true;
  }
}

export function hostResolver (host, applicant) {
  if ('string' !== typeof host) {
    return true;
  }

  return new RegExp(host).test(applicant);
}
