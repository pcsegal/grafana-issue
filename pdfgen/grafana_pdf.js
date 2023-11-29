'use strict';

const puppeteer = require('puppeteer');

const width_px = 1200;

async function generate_pdf(url, auth_header, outfile) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      const headers = interceptedRequest.headers();
      headers['Authorization'] = auth_header;
      interceptedRequest.continue( { headers } );
    });

    // Increase timeout from the default of 30 seconds to 120 seconds, to allow for slow-loading panels
    page.setDefaultNavigationTimeout(120000);

    // Increasing the deviceScaleFactor gets a higher-resolution image. The width should be set to
    // the same value as in page.pdf() below. The height is not important
    await page.setViewport({
      width: width_px,
      height: 20000,
      deviceScaleFactor: 2,
      isMobile: false
    })

    // Wait until all network connections are closed (and none are opened withing 0.5s).
    // In some cases it may be appropriate to change this to {waitUntil: 'networkidle2'},
    // which stops when there are only 2 or fewer connections remaining.
    await page.goto(url, {waitUntil: 'networkidle0'});

    // Hide all panel description (top-left "i") pop-up handles and, all panel resize handles
    // Annoyingly, it seems you can't concatenate the two object collections into one
    await page.evaluate(() => {
      let infoCorners = document.getElementsByClassName('panel-info-corner');
      for (el of infoCorners) { el.hidden = true; };
      let resizeHandles = document.getElementsByClassName('react-resizable-handle');
      for (el of resizeHandles) { el.hidden = true; };
    });

    // Get the height of the main canvas, and add a margin
    var height_px = await page.evaluate(() => {
      return document.getElementsByClassName('react-grid-layout')[0].getBoundingClientRect().bottom;
    }) + 20;

    await page.evaluate(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));

    await page.pdf({
      fullPage: true,
      printBackground: true,
      path: outfile,
      width: width_px + 'px',
      height: height_px + 'px',
      scale: 1,
      displayHeaderFooter: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0, },
    });

    await browser.close();
}

generate_pdf("http://grafana:3000/d/db539c28-4327-4572-9523-e2b0d86ece60/new-dashboard?orgId=1", "Basic YWRtaW46YWRtaW4=", "/tmp/pdf/test.pdf")
