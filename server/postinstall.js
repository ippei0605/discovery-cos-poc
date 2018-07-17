/**
 * @file Discovery COS PoC Server: 初期化
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    context = require('./context'),
    CosModel = require('./models/cos-model'),
    DiscoveryModel = require('./models/discovery-model');

const
    cos = new CosModel(context.COS_CREDS),
    discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

discovery.listEnvironments({
    name: context.ENVIRONMENT_NAME
})
    .then(({environments: v}) => {
        if (v[0]) throw new Error('The environment already exists.');
        return discovery.createEnvironment({
            name: context.ENVIRONMENT_NAME,
            description: 'My environment'
        });
    })
    .then(v => {
        console.log(v.environment_id);
        return discovery.createCollection({
            environment_id: v.environment_id,
            name: context.COLLECTION_NAME,
            description: 'My collection',
            language: 'ja'
        });
    })
    .then(v => {
        console.log(v);
        return cos.listBuckets({});
    })
    .then(v => {
        if (v.Buckets.some(item => item.Name === context.BUCKET_NAME)) new Error('The bucket already exists.');
        return cos.createBucket(context.BUCKET_NAME);
    })
    .then(v => {
        console.log(v);
        console.log('Done.');
        process.exit(0);
    })
    .catch(e => {
        console.log('error:', e);
        if (e.message === 'The environment already exists.' || e.message === 'The bucket already exists.') {
            process.exit(0);
        } else {
            process.exit(1);
        }
    });
