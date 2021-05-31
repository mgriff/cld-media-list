const chai = require('chai');
const app = require('../../app.js');

const { expect } = chai;

const ROOT_DIRECTORY = 'media-list-test-cases/';

const event = {
  pathParameters: {
    cloud_name: 'matt-cloudinary',
  },
};
let context;

// eslint-disable-next-line no-undef
describe('Test Lambda Handler', () => {
  // eslint-disable-next-line no-undef
  it(`Should return images and videos in the correct order
      tag: media-list-case1
      assets: 5 images, 1 video
      attribute: Custom metadata field - position
      order:
         one-706897_1280
         1200px-Junction_2
         3_t2yah6
         sea-turtle_nwblgm (?)
         channel4
         5-types-of-software-licenses-2020-header`, async () => {
    event.pathParameters.proxy = 'media-list-case1.json';

    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    const response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.resources.length === 6);
    expect(response.resources[0].public_id).to.be.equal(`${ROOT_DIRECTORY}one-706897_1280`);
    expect(response.resources[1].public_id).to.be.equal(`${ROOT_DIRECTORY}1200px-Junction_2`);
    expect(response.resources[2].public_id).to.be.equal(`${ROOT_DIRECTORY}3_t2yah6`);
    expect(response.resources[3].public_id).to.be.equal(`${ROOT_DIRECTORY}sea-turtle_nwblgm`);
    expect(response.resources[4].public_id).to.be.equal(`${ROOT_DIRECTORY}channel4`);
    expect(response.resources[5].public_id).to.be.equal(`${ROOT_DIRECTORY}5-types-of-software-licenses-2020-header`);
  });

  // eslint-disable-next-line no-undef
  it(`Should return successfully and only contain images 
      tag: media-list-case2
      assets: 5 images and 0 video
      attribute: Custom metadata field - position
      order:
         one-706897_1280
         1200px-Junction_2
         3_t2yah6
         channel4
         5-types-of-software-licenses-2020-header`, async () => {
    event.pathParameters.proxy = 'media-list-case2.json';

    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    const response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.resources.length === 5);
    expect(response.resources[0].public_id).to.be.equal(`${ROOT_DIRECTORY}one-706897_1280`);
    expect(response.resources[1].public_id).to.be.equal(`${ROOT_DIRECTORY}1200px-Junction_2`);
    expect(response.resources[2].public_id).to.be.equal(`${ROOT_DIRECTORY}3_t2yah6`);
    expect(response.resources[3].public_id).to.be.equal(`${ROOT_DIRECTORY}channel4`);
    expect(response.resources[4].public_id).to.be.equal(`${ROOT_DIRECTORY}5-types-of-software-licenses-2020-header`);
  });

  // eslint-disable-next-line no-undef
  it(`Should return a 400 error as no images or videos appear for the tag 
      tag: media-list-case3-not-used
      assets: 0 images and 0 videos
      order:`, async () => {
    event.pathParameters.proxy = 'media-list-case3-not-used.json';

    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(404);
    expect(result.headers['x-cld-error']).to.be.an('string');
    expect(result.headers['x-cld-error']).to.be.equal('Resource not found - No resources found for type list media-list-case3-not-used');
  });

  // eslint-disable-next-line no-undef
  it(`Should not re-order resource list if not position added 
      tag: media-list-case4
      assets: 5 images
      attribute: Sturctured Metadata Field - position
      order:
        246377866_kzy2fl
        162182692_uikbdq
        _114319603_8866eb32-b95b-4a84-afd6-f15c11f80d57_y3szug
        3895_rrlsv8
        1583261816136_zhlb3y`, async () => {
    event.pathParameters.proxy = 'media-list-case4.json';

    const result = await app.lambdaHandler(event, context);

    expect(result).to.be.an('object');
    expect(result.statusCode).to.equal(200);
    expect(result.body).to.be.an('string');

    const response = JSON.parse(result.body);

    expect(response).to.be.an('object');
    expect(response.resources.length === 5);
    expect(response.resources[0].public_id).to.be.equal(`${ROOT_DIRECTORY}246377866_kzy2fl`);
    expect(response.resources[1].public_id).to.be.equal(`${ROOT_DIRECTORY}162182692_uikbdq`);
    expect(response.resources[2].public_id).to.be.equal(`${ROOT_DIRECTORY}_114319603_8866eb32-b95b-4a84-afd6-f15c11f80d57_y3szug`);
    expect(response.resources[3].public_id).to.be.equal(`${ROOT_DIRECTORY}3895_rrlsv8`);
    expect(response.resources[4].public_id).to.be.equal(`${ROOT_DIRECTORY}1583261816136_zhlb3y`);
  });
});
