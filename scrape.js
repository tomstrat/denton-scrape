const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = scrape = async (url) => {
  try {
    const response = await got(url);
    const dom = new JSDOM(response.body);
    return dom;
  } catch (error) {
    console.log(error);
    return new Error(error.message);
  }
};