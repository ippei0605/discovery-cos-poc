/**
 * @file Discovery COS PoC Server
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    bodyParser = require('body-parser'),
    cfenv = require('cfenv'),
    express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    context = require('./context');

// アプリケーションを作成する。
const
    app = express(),
    appEnv = cfenv.getAppEnv();

// ミドルウェアを設定する。
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// production モード でなければ、CORS * に設定する。
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        next();
    });
}

app.use('/', express.static(__dirname + '/public'));
app.use('/', require('./routes'));

// リクエトを受付ける。
app.listen(context.PORT, () => {
    console.log("server starting on " + context.URL);
});