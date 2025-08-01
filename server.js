require('dotenv').config();
const express = require('express');
const axios = require('axios');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
}

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/auth/discord', (req, res) => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(authUrl);
});

app.get('/auth/discord/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI,
                scope: 'identify'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`
            }
        });

        req.session.user = {
            id: userResponse.data.id,
            username: userResponse.data.username,
            avatar: userResponse.data.avatar 
                ? `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${userResponse.data.discriminator % 5}.png`,
            isAdmin: process.env.ADMIN_IDS.split(',').includes(userResponse.data.id)
        };

        res.redirect('/');
    } catch (error) {
        console.error('Discord OAuth error:', error);
        res.redirect('/?error=auth_failed');
    }
});

// API Routes
app.get('/api/user', (req, res) => {
    res.json(req.session.user || null);
});

app.get('/api/anime', (req, res) => {
    try {
        const animeList = JSON.parse(fs.readFileSync('anime.json', 'utf8') || []);
        res.json(animeList);
    } catch {
        res.json([]);
    }
});

app.post('/api/anime', (req, res) => {
    if (!req.session.user?.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const animeData = req.body;
    animeData.id = Date.now();
    animeData.timestamp = new Date().toISOString();
    
    const animeList = JSON.parse(fs.readFileSync('anime.json', 'utf8') || []);
    animeList.unshift(animeData);
    fs.writeFileSync('anime.json', JSON.stringify(animeList));
    
    res.json(animeData);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!fs.existsSync('anime.json')) {
        fs.writeFileSync('anime.json', '[]');
    }
});