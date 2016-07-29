process.env.NODE_ENV = 'production';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var storyboard = require('storyboard');
var S = require('string');

var story = storyboard.mainStory;
storyboard.addListener(require('storyboard/lib/listeners/console').default);

var stats = require('./data/stats');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('short', {
    stream: {
        write: (toLog) => {
            story.info('http', S(toLog).chompRight('\n').s)
        }
    }
}));

app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/characters', require('./routes/characters'));
app.use('/commands', require('./routes/commands'));
app.use('/chatlogs', require('./routes/chatlogs'));

app.get('/', (req, res)=> {
    res.render('index', {
        pagetitle: 'FoxBot',
        header: {
            title: 'Foxbot',
            subtitle: 'A fully featured DiscordBot',
            button: {
                primary: {link: '/invite', text: 'Add to Guild'},
                secondary: [{link: '/commands', text: 'Commands'}]
            }
        },
        stats: stats()
    });
});

app.get('/template', (req, res)=> {
    res.render('template')
});

app.get('/invite', (req, res)=> {
    res.redirect('https://discordapp.com/oauth2/authorize?access_type=online&client_id=168751105558183936&scope=bot&permissions=473031686')
});

app.use(function (err, req, res, next) {
    res.status(err).send(err + ' - An error ocured. Sorry..');
});

app.listen(4236);
