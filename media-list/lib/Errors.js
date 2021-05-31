/* eslint-disable max-classes-per-file */
/**
 * Custom Errors for the Media List Lambda
 */

/**
 * Validation error for parameters passed
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Cloudinary Error returned from a resource request
 */
class CldResourceError extends Error {
  constructor(response) {
    super(`CldResourceError: ${response.statusText}`);
    this.name = 'CldResourceError';
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.cldError = response.cldError || response.headers.get('x-cld-error');
  }

  json() {
    return {
      url: this.url,
      status: this.status,
      statustext: this.statusText,
      cldError: this.cldError,
    };
  }
}

module.exports = { ValidationError, CldResourceError };
