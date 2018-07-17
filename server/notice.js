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
    environment_id: 'd738518d-a68e-4b29-89da-d15d7c455034',
    collection_id: '251109d7-06dc-428b-beda-fe18472aa75f',
    count: 1000
})
    .then(v => {
        console.log(JSON.stringify(v, undefined, 2));
    })
    .catch(e => {
        console.log('error:', e);
    });
