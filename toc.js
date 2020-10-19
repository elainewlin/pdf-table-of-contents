/**
 * This file parses a sheet of raw table of contents data.
 * See https://docs.google.com/spreadsheets/d/1igLAUQIgMZFQ2aLFhDuPIcQ_XE2R5X7Trx0a_Rx4l1M/edit#gid=0.
 */
const fs = require("fs");

/**
 * Row = Array<string> - This corresponds to a row from the Raw Data sheet
 */

/**
 * Get data from a row of the table of contents sheet
 * @param  {Row} row
 * @return {Object}
 * - tocPage: page of the table of contents
 * - title: song title
 * - startPage: what page the song starts on
 * - endPage: what page the song ends on
 */
function parseRow(row) {
  const [tocPage, title, startPage, endPage] = row.trim().split("\t");
  return {
    tocPage,
    title,
    startPage,
    endPage
  };
}

/**
 * Get a map from tocPage to all pages the TOC should link to
 * @param  {Array<Row>} tocData
 * @return {Object<string, Array<int>>}
 */
function getTocToPageLinks(tocData) {
  const tocToPageLinks = {};
  tocData.forEach(row => {
    const { tocPage, startPage } = parseRow(row);

    if (!(tocPage in tocToPageLinks)) {
      tocToPageLinks[tocPage] = [];
    }
    tocToPageLinks[tocPage].push(parseInt(startPage));
  });
  return tocToPageLinks;
}

/**
 * Parse TOC data + print out the Formatted Data sheet
 * @param  {Array<Row>} tocData
 */
function printFormattedToc(tocData) {
  tocData.forEach(row => {
    const { title, startPage, endPage } = parseRow(row);

    // Used to maintain table of contents
    const isOnePage = startPage === endPage;
    if (isOnePage) {
      console.log(`${title};${startPage}`);
    } else {
      console.log(`${title};${startPage}-${endPage}`);
    }
  });
}

fs.readFile("toc.tsv", "utf8", function(err, data) {
  // Skip the first row with headers
  const tocData = data.split("\n").slice(1);

  printFormattedToc(tocData);
  const tocToPageLinks = getTocToPageLinks(tocData);
  // console.log(tocToPageLinks);
});
