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
app.use('/', require('./routes'));

// リクエトを受付ける。
app.listen(context.PORT, () => {
    console.log("server starting on " + context.URL);
});