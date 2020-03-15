# topMoviesFinder

Finds the top 100 movies rated by Rotten Tomatoes, scrapes data, and lists them onto an excel spreadsheet.
I wanted to work with a module that allows me to scrape data from a website and write onto an excel file.

Install needed dependencies using npm.

    npm install

Run app.js to run the app.

    node app.js

The app will scrape rottentomatoes.com's top 100 rated movies from the previous year and store them onto a rottenTomatoes2019Top100.xlsx file.

## Tech ⚒ Stack

- excel4node - Write to excel file
- request - HTTP calling
- cheerio - jQuery functions and HTML parsing
