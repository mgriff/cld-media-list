const fetch = require('node-fetch');

const { CldResourceError } = require('./Errors');
const { mergeObjectArrays } = require('./utils');

/**
 * Media Resource List class
 */
class MediaResourceList {
  constructor(cloudName, tag, sortParameter) {
    this.cloudName = cloudName;
    this.tag = tag;
    this.sortParameter = sortParameter;
  }

  /**
   * Checks if the response returns successfully
   * @param {node fetch response} response
   * @returns response
   * @throws CldResourceError
   */
  static checkStatus(response) {
    if (response.ok) { // res.status >= 200 && res.status < 300
      return response;
    // eslint-disable-next-line no-else-return
    } else {
      throw new CldResourceError(response);
    }
  }

  /**
   * Returns the resource list for the provided resourceType
   * @param {String} resourceType either image or video
   * @returns Resource List JSON
   */
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
          resource.mediaType = resourceType;
          return resource;
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
        return err;
      });
  }

  /**
   * Method to return the combined Image and Video JSON list
   * @returns combined media list
   */
  async getMediaResourceList() {
    const imageJson = await this.getResourceList('image');

    const videoJson = await this.getResourceList('video');

    const mediaJson = {
      resources: mergeObjectArrays(imageJson.resources, videoJson.resources, this.sortParameter),
      updated_at: new Date().toISOString(),
    };

    // Throw an error if both the Resource lists are empty, use the imageJson as the error message
    // TODO: Decided on a better way to handle errors
    if (imageJson.error_message !== undefined && videoJson.error_message !== undefined) {
      throw new CldResourceError(imageJson.error_message);
    }

    return mediaJson;
  }
}

module.exports = { MediaResourceList };
