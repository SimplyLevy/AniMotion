require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_random_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Discord Strategy Configuration
passport.use(new DiscordStrategy({
    clientID: '961735478225301534',
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || 'https://simplylevy.github.io/AniMotion/auth/discord/callback',
    scope: ['identify', 'guilds.join']
}, (accessToken, refreshToken, profile, done) => {
    // Successful authentication
    return done(null, profile);
}));

// Serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Routes
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: '/?login_failed=true',
        successRedirect: '/'
    })
);

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.get('/api/user', (req, res) => {
    if (req.user) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            avatar: req.user.avatar,
            discriminator: req.user.discriminator
        });
    } else {
        res.json(null);
    }
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// All other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Discord OAuth configured for client: 961735478225301534`);
});