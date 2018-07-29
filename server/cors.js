'use strict';

// モジュールを読込む。
const
    context = require('./context'),
    CosModel = require('./models/cos-model'),
    DiscoveryModel = require('./models/discovery-model');

const cosCreds = {
    apikey: 'KcTm3vmsUflex7UehNGj5i6LrEI2VWMudI0Jh77FwJzW',
    resource_instance_id: 'crn:v1:bluemix:public:cloud-object-storage:global:a/48984e66e3b9b429a0cfe14d0637f075:8df05bdf-5007-48b5-ba33-1e7257f255f1::'
};

// モデルを作成する。
const cos = new CosModel(cosCreds);

/*
cos.putBucketCors({
    Bucket: 'bucket-ippei0605-0001',
    CORSConfiguration: {
        CORSRules: [
            {
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                AllowedOrigins: ["*"],
                ExposeHeaders: [],
                MaxAgeSeconds: 3000
            }
        ]
    }
})
    .then(v => {
        console.log(v);
    })
    .catch(e => {
        console.log('Abend.');
    });
*/

cos.getBucketCors('bucket-ippei0605-0001')
    .then(v => {
        console.log(JSON.stringify(v, undefined, 2));
    });
