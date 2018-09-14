'use strict';

// 定数を設定する。
const environmentId = '79b5e700-51d3-40bd-a205-341b4934948f';

// モジュールを読込む。
const
    context = require('./context'),
    DiscoveryModel = require('./models/discovery-model');

// モデルを作成する。
const discovery = new DiscoveryModel(context.DISCOVERY_CREDS);


discovery.listCollections({
    environment_id: environmentId
})
    .then(v => console.log(v))
    .catch(e => console.log('error:', e.stack));