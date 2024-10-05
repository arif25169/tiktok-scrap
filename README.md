# TikTok Scrpaer

This is a very basic tiktok scraper based on NodeJs. I have attached some screnshots in the project.

## Technology used:
- puppeteer (For Sccraping)
- expressjs (For analysis and api)
- ReactJs (For Chart)

Should work for Node 18+

# Install

In the root directory, run the command: `npm i`
Once the installation is complete, for scraping type `npm run scrap` 
After the scraping process finishes, it will save data in `tiktok_data.json` file. 

To analyis the `data` we scraped, we can run `npm start` and the API will serve at 
http://localhost:5000/api

I have created a ReactJs project to visualize the data and it can be found in `frontend` folder. 
To run that project, go to frontend folder and run this command
`npm i`
After that `npm run dev`. In the terminal, you'll see which port the project started. It should be something like `http://localhost:5173/`

# Limitation

This is a very basic project. I couldn't solve the captcha problem even after login. Even after login to Tiktok I couldn't do it.  That's why I turned off the login function `loginToTikTok()` in `scrap.js` file. 
And, I could make it modular. However, due to time limitation I dropped that idea. 