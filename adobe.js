/**
 * This script automatically adds links to your table of contents.
 * See Adobe Acrobat Javascript docs for more details
 * https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/js_api_reference.pdf
 *
 * To run Javascript in a PDF, add a temp link + set its action to run JS.
 * You can enable the Javascript debugger under Preferences > Javascript.
 */

var PIXELS_PER_INCH = 72;

// How much space is between any 2 links on the page
var BETWEEN_LINK_OFFSET = 0.56 * PIXELS_PER_INCH;

// Map from pages of the TOC (0-indexed) to page numbers to link to (1-indexed)
// This is generated from Google sheets
var TOC_TO_LINKS = {
  "1": [6, 7, 8, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 23, 24, 25],
  "2": [26, 27, 28, 30, 31, 33, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
  "3": [45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
  "4": [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 77, 78, 79]
};

/**
 * Add a link on a PDF page
 * @param {int} pageNum         page to add the link on, 0-indexed
 * @param {int} yOffset         offset from bottom of the page
 * @param {int} destinationPage page the link goes to, 0-indexed
 */
function addLinkHelper(pageNum, yOffset, destinationPage) {
  var LINK_HEIGHT = 0.25 * PIXELS_PER_INCH;
  var LINK_WIDTH = 3.5 * PIXELS_PER_INCH;

  var X_OFFSET = 0.75 * PIXELS_PER_INCH;

  // Coordinates relative to the bottom left corner of the page
  var linkRect = [
    X_OFFSET,
    yOffset + LINK_HEIGHT,
    X_OFFSET + LINK_WIDTH,
    yOffset
  ];
  var link = this.addLink(pageNum, linkRect);

  // NOTE: This literally sets the link action to run Javascript.
  // Unfortunately, devices that aren't Adobe Acrobat cannot
  // execute Javascript, so this does not work on most devices.
  link.setAction("this.pageNumber = " + pageNum);
}

/**
 * Add all links for a page of the PDF
 * @param {int} tocPage                   page of TOC to add the link on, 0-indexed
 * @param {Array<int>} destinationPages   array of pages to link to, 1-indexed
 */
function addLinksForPage(tocPage, destinationPages) {
  // Total height of the page in pixels
  var HEIGHT_IN_PIXELS = PIXELS_PER_INCH * 11;

  // Distance from top of page to the first song link
  var INCHES_FROM_TOP = 0.7;

  var yOffset = HEIGHT_IN_PIXELS - INCHES_FROM_TOP * PIXELS_PER_INCH;
  for (var i = 0; i < destinationPages.length; i++) {
    // Convert from 1-indexed to 0-indexed
    var destinationPage = destinationPages[i] - 1;
    yOffset -= BETWEEN_LINK_OFFSET;

    addLinkHelper(tocPage, yOffset, destinationPage);
  }
}

/**
 * Add all links for all pages of the table of contents
 * @param {Map<string, Array<int>>} pageToLinks map from pages to list of links to add
 */
function addAllLinks(pageToLinks) {
  for (var tocPage in pageToLinks) {
    var destinationPages = pageToLinks[tocPage];
    var tocPageInt = parseInt(tocPage);
    addLinksForPage(tocPageInt, destinationPages);
  }
}

addAllLinks(TOC_TO_LINKS);
