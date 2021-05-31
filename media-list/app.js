const path = require('path');

// const { sleep } = require('./lib/utils');

const { ValidationError, CldResourceError } = require('./lib/Errors');
const { MediaResourceList } = require('./lib/MediaResourceList');

let response;

/**
 * Validate that the correct parameters are passed
 * @param {*} event
 */
function validateParameters(event) {
  if (event.pathParameters === undefined || event.pathParameters.cloud_name === undefined) {
    throw new ValidationError('Missing cloud_name');
  } else if (event.pathParameters.proxy === undefined) {
    throw new ValidationError('Unsupported transformation');
  } else {
    // We know proxy exists but not check it is in the form <tag>.json
    const proxyFilename = path.parse(event.pathParameters.proxy);

    if (proxyFilename.ext !== '.json') { // also catches when the call is for /.json as it is not treated as an extension
      throw new ValidationError('Unsupported transformation');
    }
  }
}

/**
 * LambdaHandler
 * @param {*} event
 * @param {*} context
 * @returns
 */
exports.lambdaHandler = async (event, context) => {
  try {
    validateParameters(event);

    const cloudName = event.pathParameters.cloud_name;
    const tag = path.parse(event.pathParameters.proxy).name;

    const mediaList = new MediaResourceList(cloudName, tag);
    const body = await mediaList.getMediaResourceList();

    response = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (err) {
    if (err instanceof ValidationError) {
      response = {
        statusCode: 400,
        headers: {
          'x-cld-error': err.message,
        },
      };
    } else if (err instanceof CldResourceError) {
      response = {
        statusCode: err.json().status,
        headers: {
          'x-cld-error': err.json().cldError,
        },
      };
    } else {
      return err;
    }
  }

  return response;
};
