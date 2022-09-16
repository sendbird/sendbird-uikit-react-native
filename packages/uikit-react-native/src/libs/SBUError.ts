enum SBUErrorCode {
  ERR_UNKNOWN = 90000000,

  // Platform service - 91001000 ~
  ERR_PERMISSIONS_DENIED = 91001000,
  ERR_DEVICE_UNAVAILABLE,
}

export default class SBUError extends Error {
  static CODE = SBUErrorCode;

  static get UNKNOWN() {
    return new SBUError(SBUErrorCode.ERR_UNKNOWN);
  }

  static get PERMISSIONS_DENIED() {
    return new SBUError(SBUErrorCode.ERR_PERMISSIONS_DENIED);
  }
  static get DEVICE_UNAVAILABLE() {
    return new SBUError(SBUErrorCode.ERR_DEVICE_UNAVAILABLE);
  }

  constructor(public code: SBUErrorCode, message?: string) {
    super(message);
  }
}
