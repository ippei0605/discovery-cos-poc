'use strict';

// 定数を設定する。
const
    environmentId = '79b5e700-51d3-40bd-a205-341b4934948f',
    collectionId = '611e297d-a75b-4b40-a1fe-aa50512ad6d9';

// モジュールを読込む。
const
    context = require('./context'),
    DiscoveryModel = require('./models/discovery-model');

// モデルを作成する。
const discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

discovery.getCollection({
    environment_id: environmentId,
    collection_id: collectionId
})
    .then(v => console.log(v))
    .catch(e => console.log('error:', e.stack));