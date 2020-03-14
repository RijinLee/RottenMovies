console.log("Finding Top Movies");

// parse the HTML body that request operation rececived
// use the cheerio package to achieve this
function parseRottenTomatoesHTML(fileData) {
  const cheerio = require("cheerio");
  // prep the return obj
  let allTomatoData = {
    top100: []
  };
  let errorFlag = true;

  // sanity check that this is rotten tomatoes web html
  if (fileData.indexOf("Rotten Tomatoes") != -1) {
    // set error flag to false for passing sanity check
    errorFlag = false;

    // load the html into the cheerio doc
    let fullDoc = cheerio.load(fileData);

    // find the stub for top 100 rated movies
    let top100Doc = cheerio.load(fullDoc('[id = "top_movies_main"]').html());

    // iterate through movies and strip useful parts, add each to return obj
    top100Doc("tr").each(function(index) {
      let movieDoc = cheerio.load(top100Doc(this).html());
      let movieRank = index;
      // movieDoc(".bold").text().trim();
      let movieRating = movieDoc(".tMeterScore")
        .text()
        .trim();
      let movieTitie = movieDoc(".unstyled")
        .text()
        .trim();

      let movieObj = {
        rank: movieRank,
        rating: movieRating,
        title: movieTitie
      };
      allTomatoData.top100[allTomatoData.top100.length] = movieObj;
    });
  }
  // return error flag and data
  return { error: errorFlag, data: allTomatoData };
}

const TOP100_URL = "https://www.rottentomatoes.com/top/bestofrt/?year=";
const prevYear = new Date().getFullYear() - 1;
const ROTTEN_TOMATOES_TOP100_URL = `${TOP100_URL}${prevYear}`;

// makes a call to get the HTML from the rotten tomatoes top100 page
// uses the request package to achieve this
function requestRottenTomatoesHTML(callback) {
  const request = require("request");
  request({ uri: ROTTEN_TOMATOES_TOP100_URL }, function(error, response, body) {
    if (!error) {
      let parsedData = parseRottenTomatoesHTML(body);
      if (parsedData.error == false) {
        callback(false, parsedData.data);
      } else {
        callback(true, null);
      }
    } else {
      callback(true, null);
    }
  });
}

//
requestRottenTomatoesHTML(function(error, data) {
  if (!error) {
    // console.log(JSON.stringify(data, null, 2));
    const xl = require("excel4node");

    //////////////Excel Code///////////////
    // Create a new instance of a Workbook class
    let wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet(`Rotten Tomatoes Top100 of ${prevYear}`);

    // Create a reusable style
    var style = wb.createStyle({
      font: {
        color: "#000000",
        size: 12
      },
      numberFormat: "#,##0; (#,##0); -"
    });

    ws.cell(1 + 1, 2)
      .string("My simple string")
      .style(style);

    for (var i = 0; i < 101; i++) {
      ws.cell(i + 1, 1)
        .number(data.top100[i].rank)
        .style(style); // rank

      ws.cell(i + 1, 2)
        .string(data.top100[i].rating)
        .style(style); // artist name

      ws.cell(i + 1, 3)
        .string(data.top100[i].title)
        .style(style); // song title
    }

    wb.write(`rottenTomatoes${prevYear}Top100.xlsx`);
  } else {
    console.log(`some error occured`);
  }
});
