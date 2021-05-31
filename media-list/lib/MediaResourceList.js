const fetch = require('node-fetch');

const { CldResourceError } = require('./Errors');
const { mergeObjectArrays } = require('./utils');

/**
 * Media Resource List class
 */
class MediaResourceList {
  constructor(cloudName, tag) {
    this.cloudName = cloudName;
    this.tag = tag;
  }

  static checkStatus(response) {
    if (response.ok) { // res.status >= 200 && res.status < 300
      return response;
    // eslint-disable-next-line no-else-return
    } else {
      throw new CldResourceError(response);
    }
  }

  async getResourceList(resourceType) {
    const url = `https://res.cloudinary.com/${this.cloudName}/${resourceType}/list/${this.tag}.json`;

    // eslint-disable-next-line no-return-await
    return await fetch(url)
      .then(MediaResourceList.checkStatus)
      .then((res) => res.json())
      .then((json) => {
        // add the resource type to the resources
        json.resources.map((resource) => {
          // eslint-disable-next-line no-param-reassign
          resource.resource_type = resourceType;
        });
        return json;
      })
      .catch((err) => {
        if (err instanceof CldResourceError) {
          return {
            resources: [],
            error_message: err.json(),
          };
        }
      });
  }

  async getMediaResourceList() {
    const imageJson = await this.getResourceList('image');

    const videoJson = await this.getResourceList('video');

    const mediaJson = {
      resources: mergeObjectArrays(imageJson.resources, videoJson.resources, 'position'),
      updated_at: new Date().toISOString(),
    };

    // Throw an error if both the Resource lists are empty, use the imageJson as the error message
    // TODO: Decided on a better way to handle errors
    if (imageJson.error_message !== undefined && videoJson.error_message !== undefined) {
      throw new CldResourceError(imageJson.error_message);
    }

    // let errorString = '';
    // if (imageJson.error_message !== undefined) {
    //   errorString += `${imageJson.error_message.cldError} | `;
    // }
    // if (videoJson.error_message !== undefined) {
    //   errorString += videoJson.error_message.cldError;
    // }

    // if (errorString !== '') {
    //   mediaJson.error_message = errorString;
    // }

    return mediaJson;
  }
}

module.exports = { MediaResourceList };
