console.log("Finding Top Movies");
const request = require("request");
const cheerio = require("cheerio");

// parse the HTML body that request operation rececived
// use the cheerio package to achieve this
function parseRottenTomatoesHTML(fileData) {
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
    top100Doc("tr").each(function(index, element) {
      let movieDoc = cheerio.load(top100Doc(this).html());
      // console.log("this is the movieDoc: ", movieDoc);
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
      console.log("this is the movieobj: ", movieObj);
      allTomatoData.top100[allTomatoData.top100.length] = movieObj;
    });
  }
  // return error flag and data
  return { error: errorFlag, data: allTomatoData };
}

const TOP100_URL = "https://www.rottentomatoes.com/top/bestofrt/?year=";
const prevYear = new Date().getFullYear() - 1;
const ROTTEN_TOMATOES_TOP100_URL = `${TOP100_URL}${prevYear}`;

// makes a call to get the HTML from the rotten tomatoes front page
// uses the request package to achieve this
function requestRottenTomatoesHTML(callback) {
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

requestRottenTomatoesHTML(function(error, data) {
  if (!error) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(`some error occured`);
  }
});
