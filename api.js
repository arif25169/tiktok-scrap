const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const JSONStream = require('JSONStream');
const app = express();
const PORT = 5000;

app.use(cors()); 

function parseValue(value) {
    if (value.includes('K')) {
      return parseInt(parseFloat(value) * 1000);
    } else if (value.includes('M')) {
      return parseInt(parseFloat(value) * 1000000);
    } else {
      return parseInt(value);
    }
}

app.get('/api', (req, res) => {
  const fileStream = fs.createReadStream('tiktok_data.json');
  
  const influencers = [];
  const processedUsernames = new Set();  
  

  fileStream
    .pipe(JSONStream.parse('*'))
    .on('data', (data) => {
      const username = data?.author?.username;
      const followerCount = parseValue(data?.author?.follower_count);
      const likeCount = parseValue(data?.author?.like_count);
      
      // Check if the author has at least 100k followers and over 1 million likes and is unique
      if (followerCount >= 100000 && likeCount > 1000000 && !processedUsernames.has(username)) {
        influencers.push({
          username: data.author.username,
          followerCount,
          likeCount,
          videoUrl: data.video_url
        });
        processedUsernames.add(username);  
      }
    })
    .on('end', () => {
      res.json(influencers);  
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error reading the file.');
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
