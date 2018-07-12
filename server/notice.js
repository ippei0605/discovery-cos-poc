'use strict';

// モジュールを読込む。
const
    context = require('./context'),
    CosModel = require('./models/cos-model'),
    DiscoveryModel = require('./models/discovery-model');

// モデルを作成する。
const
    cos = new CosModel(context.COS_CREDS),
    discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

discovery.queryNotices({
    environment_id: '980db362-d83e-450a-aa19-877b1f76d80f',
    collection_id: '1f6e45a1-d5e8-4d2f-b460-e7447d3a122b',
    count: 1000
})
    .then(v => {
        console.log(JSON.stringify(v, undefined, 2));
    })
    .catch(e => {
        console.log('error:', e);
    });
