const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();


(async () => {
    const keywords = [
        'beautiful destinations',
        'places to visit',
        'places to travel',
        'places that don\'t feel real',
        'travel hacks'
    ];

    const hashtags = [
        'traveltok',
        'wanderlust',
        'backpackingadventures',
        'luxurytravel',
        'hiddengems',
        'solotravel',
        'roadtripvibes',
        'travelhacks',
        'foodietravel',
        'sustainabletravel'
    ];

    let scrapedData = [];

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Currently Disabled
    async function loginToTikTok() {
        try {
            const loginUrl = 'https://www.tiktok.com/login/phone-or-email/email';
            await page.goto(loginUrl, { waitUntil: 'networkidle2' });

            // Enter username and password
            await page.type('input[name="username"]', process.env.TIKTOK_USERNAME, { delay: 100 });
            await page.type('input[type="password"]', process.env.TIKTOK_PASSWORD, { delay: 100 });

            // Click the login button
            await page.click('button[type="submit"]'); // Modify the selector based on the button used to login

            // Wait for successful login (check for some post-login element)
            await page.waitForSelector('[data-e2e="homepage-for-you-feed"]');  // Change this selector to something that indicates a successful login
            console.log('Logged in successfully!');
        } catch (err) {
            console.error('Error during login:', err);
        }
    }

    async function scrapeKeywords(searchTerm) {
        try {
            const url = `https://www.tiktok.com/search?q=${encodeURIComponent(searchTerm)}`;
            await page.goto(url, { waitUntil: 'networkidle2' });

            await page.waitForSelector('[class*="DivItemContainerForSearch"]');

            const posts = await page.$$eval('[class*="DivItemContainerForSearch"]', postEls => postEls.map(post => {
                const videoUrl = post.querySelector('a')?.href || null;
                const videoCaptionElement = post.querySelector('[data-e2e="search-card-video-caption"] span');
                const videoCaption = videoCaptionElement ? videoCaptionElement.innerText : null;
                const authorUsernameElement = post.querySelector('[data-e2e="search-card-user-unique-id"]');
                const authorUsername = authorUsernameElement ? authorUsernameElement.innerText : null;

                return {
                    video_url: videoUrl,
                    video_caption: videoCaption,
                    author_username: authorUsername
                };
            }));

            if (posts.length === 0) {
                console.log(`No posts found for ${searchTerm}`);
                return;
            }

            for (let post of posts) {
                try {
                    console.log(`Processing post by ${post.author_username}`);

                    await page.goto(`https://www.tiktok.com/@${post.author_username}`, { waitUntil: 'networkidle2' });

                    const authorData = await page.evaluate((post) => {
                        const username = post.author_username;
                        const followerCount = document.querySelector('[data-e2e="followers-count"]')?.innerText || 'N/A';
                        const followingCount = document.querySelector('[data-e2e="following-count"]')?.innerText || 'N/A';
                        const likeCount = document.querySelector('[data-e2e="likes-count"]')?.innerText || 'N/A';

                        return {
                            username,
                            follower_count: followerCount,
                            following_count: followingCount,
                            like_count: likeCount
                        };
                    }, post);

                    if (!authorData.username) {
                        console.log(`No author data found for ${post.author_username}`);
                        continue;
                    }

                    scrapedData.push({
                        ...post,
                        author: authorData
                    });
                } catch (err) {
                    console.error(`Error processing author data for ${post.author_username}:`, err);
                    continue;
                }
            }
        } catch (err) {
            console.error(`Error scraping posts for ${searchTerm}:`, err);
        }
    }

    async function scrapeHashtags(searchTerm) {
        try {
            const url = `https://www.tiktok.com/tag/${searchTerm}`;
            await page.goto(url, { waitUntil: 'networkidle2' });

            await page.waitForSelector('[class*="DivItemContainerV2"]');

            const posts = await page.$$eval('[class*="DivItemContainerV2"]', postEls => postEls.map(post => {
                const videoUrl = post.querySelector('a')?.href || null;
                const videoCaptionElement = post.querySelector('div[class*="DivDesContainer"] h1 span');
                const videoCaption = videoCaptionElement ? videoCaptionElement.innerText : null;
                const authorUsernameElement = post.querySelector('[data-e2e="challenge-item-username"]');
                const authorUsername = authorUsernameElement ? authorUsernameElement.innerText : null;

                return {
                    video_url: videoUrl,
                    video_caption: videoCaption,
                    author_username: authorUsername
                };
            }));

            console.log(posts)

            if (posts.length === 0) {
                console.log(`No posts found for ${searchTerm}`);
                return;
            }

            for (let post of posts) {
                try {
                    console.log(`Processing post by ${post.author_username}`);

                    await page.goto(`https://www.tiktok.com/@${post.author_username}`, { waitUntil: 'networkidle2' });

                    const authorData = await page.evaluate((post) => {
                        const username = post.author_username;
                        const followerCount = document.querySelector('[data-e2e="followers-count"]')?.innerText || 'N/A';
                        const followingCount = document.querySelector('[data-e2e="following-count"]')?.innerText || 'N/A';
                        const likeCount = document.querySelector('[data-e2e="likes-count"]')?.innerText || 'N/A';

                        return {
                            username,
                            follower_count: followerCount,
                            following_count: followingCount,
                            like_count: likeCount
                        };
                    }, post);

                    if (!authorData.username) {
                        console.log(`No author data found for ${post.author_username}`);
                        continue;
                    }

                    scrapedData.push({
                        ...post,
                        author: authorData
                    });
                } catch (err) {
                    console.error(`Error processing author data for ${post.author_username}:`, err);
                    continue;
                }
            }
        } catch (err) {
            console.error(`Error scraping posts for ${searchTerm}:`, err);
        }
    }

    for (const keyword of keywords) {
        await scrapeKeywords(keyword);
    }

    for (const hashtag of hashtags) {
        await scrapeHashtags(hashtag);
    }

    // await loginToTikTok();

    fs.writeFileSync('tiktok_data.json', JSON.stringify(scrapedData, null, 2));

    console.log('Scraping completed and data saved to tiktok_data.json');
    await browser.close();
})();
