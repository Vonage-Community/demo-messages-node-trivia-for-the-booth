const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Converts boolean to number
 *
 * @param {boolean} value - boolean value
 * @returns {1|0}
 */
export const toRowBoolean = (value) => (value ? 1 : 0);

/**
   * Guard function for RPC and models — throws if not a string or is empty.
   *
   * @param {string} name - name of the parameter (for error messages)
   * @param {string} val - value to check
   * @returns {string} the value, if valid
   */
export const requireNonEmptyString = (name, value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw {
      code: -32602,
      message: `${name} is required`,
    };
  }

  return value;
};

/**
   * Guard function for RPC and models — throws if not a number.
   *
   * @param {string} name - name of the parameter (for error messages)
   * @param {string} val - value to check
   * @returns {string} the value, if valid
   */
export const requireInt = (name, value) => {
  const num = Number(value);

  if (!Number.isInteger(num)) {
    throw {
      code: -32602,
      message: `${name} must be an integer`,
    };
  }

  return num;
};

/**
   * Guard function for RPC and models — throws if not a number or is signed.
   *
   * @param {string} name - name of the parameter (for error messages)
   * @param {string} val - value to check
   * @returns {string} the value, if valid
   */
export const requireUInt = (name, value) => {
  const num = requireInt(name, value);

  if (num < 0) {
    throw {
      code: -32602,
      message: `${name} must be an unsigned integer`,
    };
  }

  return num;
};

/**
   * Check if a value looks like a UUID string.
   *
   * @param {string} val
   * @returns {boolean}
   */
export const isUuid = (val) => typeof val === 'string' && UUID_REGEX.test(val);

/**
   * Guard function for RPC and models — throws if not a UUID.
   *
   * @param {string} name - name of the parameter (for error messages)
   * @param {string} val - value to check
   * @returns {string} the value, if valid
   */
export const requireUuid = (name, value) => {
  if (!isUuid(value)) {
    throw {
      code: -32602,
      message: `${name} must be a valid UUID`,
    };
  }

  return value;
};
