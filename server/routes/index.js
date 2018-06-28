/**
 * Discovery COS PoC Server: ルーティング
 * @module routes/index
 * @author Ippei SUZUKI
 * @see {@link https://www.npmjs.com/package/ibm-cos-sdk}
 */

'use strict';

// モジュールを読込む。
const
    express = require('express'),
    fs = require('fs'),
    multer = require('multer'),
    context = require('../context'),
    CosModel = require('../models/cos-model'),
    DiscoveryModel = require('../models/discovery-model');

const
    cos = new CosModel(context.COS_CREDS),
    discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

let
    ENVIRONMENT_ID = '',
    COLLECTION_ID = '';
discovery.listEnvironments({
    name: context.ENVIRONMENT_NAME
})
    .then(({environments: v}) => {
        ENVIRONMENT_ID = v[0].environment_id;
        return discovery.listCollections({
            environment_id: ENVIRONMENT_ID,
            name: context.COLLECTION_NAME
        });
    })
    .then(({collections: v}) => {
        COLLECTION_ID = v[0].collection_id;
    });


// ルーターを作成する。
const router = express.Router();
module.exports = router;

// ファイルアップロードを設定する。
const upload = multer({
    "dest": "upload/"
});

// Bucket の一覧を表示する。
router.get('/', (req, res) => {
    res.sendStatus(500);
});


// Object をアップロードする。
router.post('/', upload.array('upload-files'), (req, res) => {
    if (req.files) {
        return Promise.all(req.files.map(item => {
            return cos.putObject({
                Bucket: context.BUCKET_NAME,
                Key: item.originalname,
                Body: fs.createReadStream(item.path),
                ContentType: item.mimetype
            })
                .then(v => {
                    console.log('###', ENVIRONMENT_ID, COLLECTION_ID);
                    return discovery.addDocument({
                        environment_id: ENVIRONMENT_ID,
                        collection_id: COLLECTION_ID,
                        file: fs.createReadStream(item.path),
                        file_content_type: item.mimetype
                    });
                })
                .then(v => {
                    fs.unlink(item.path, (error) => {
                    });
                });
        }))
            .then(v => {
                res.json({});
            })
            .catch(e => {
                console.log('error:', e);
                res.json({});
            });
    } else {
        res.json({});
    }
});
