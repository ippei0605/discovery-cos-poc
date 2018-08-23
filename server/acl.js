'use strict';

// モジュールを読込む。
const
    context = require('./context'),
    CosModel = require('./models/cos-model'),
    DiscoveryModel = require('./models/discovery-model');

const cosCreds = {
    apikey: '49dgk-YmrSF1pa9eMDDJCiEeznfDoiofZiIhvGPuXIou',
    key: '6fd9a40d640a4a508f93d729d653c89d',
    secret: '2039be8cb5ec4b0f0204591389c7ab915d07b3e1ca14d072',
    resource_instance_id: 'crn:v1:bluemix:public:cloud-object-storage:global:a/48984e66e3b9b429a0cfe14d0637f075:8df05bdf-5007-48b5-ba33-1e7257f255f1::'
};

// モデルを作成する。
const cos = new CosModel(cosCreds);

/*
cos.putObjectAcl({
    Bucket: 'bucket-ippei0605-0001',
    Key: '_watsonsummit2017_session_list.pdf',
    ACL: 'public-read'
})
    .then(v => {
        console.log(v);
    })
    .catch(e => {
        console.log('Abend.');
    });
*/

/*
cos.putBucketAcl({
    Bucket: 'bucket-ippei0605-0001',
    ACL: 'public-read'
})
    .then(v => {
        console.log(v);
    })
    .catch(e => {
        console.log('Abend.');
    });
*/

/*
cos.getBucketAcl('bucket-ippei0605-0001')
    .then(v => {
        console.log(JSON.stringify(v, undefined, 2));
    })
    .catch(e => {
        console.log('error:', e);
    });
*/

cos.getObjectAcl('bucket-ippei0605-0001', '_watsonsummit2017_session_list.pdf')
    .then(v => {
        console.log(JSON.stringify(v, undefined, 2));
    })
    .catch(e => {
        console.log('error:', e);
    });
