'use strict'

const path = require('path');

// const { sleep } = require('./lib/utils');

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    // sleep(111);

    validateParameters(event);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hello world',
        context,
        event,
      }),
    };
  } catch (err) {
    if (err.name === 'ValidationError') {
      response = {
        statusCode: 400,
        headers: {
          'x-cld-error': err.message,
        },
      };
    } else {
      return err;
    }
  }

  return response;
};

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateParameters(event) {
  if (event.pathParameters === undefined || event.pathParameters.cloud_name === undefined) {
    throw new ValidationError('Missing cloud_name');
  } else if (event.pathParameters.proxy === undefined) {
    throw new ValidationError('Unsupported transformation');
  } else {
    // We know proxy exists but not check it is in the form <tag>.json
    const proxyFilename = path.parse(event.pathParameters.proxy);

    if (proxyFilename.ext !== '.json') {  // also catches when the call is for /.json
      throw new ValidationError('Unsupported transformation');
    }
  }
}
