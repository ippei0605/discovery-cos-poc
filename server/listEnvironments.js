'use strict';

// モジュールを読込む。
const
    context = require('./context'),
    DiscoveryModel = require('./models/discovery-model');

// モデルを作成する。
const discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

discovery.listEnvironments()
    .then(v => console.log(v))
    .catch(e => console.log('error:', e.stack));