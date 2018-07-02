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

// モデルを作成する。
const
    cos = new CosModel(context.COS_CREDS),
    discovery = new DiscoveryModel(context.DISCOVERY_CREDS);

// ルーターを作成する。
const router = express.Router();
module.exports = router;

// ファイルアップロードを設定する。
const upload = multer({
    "storage": multer.diskStorage({
        "destination": (req, file, cb) => {
            cb(null, 'upload/');
        },
        "filename": (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

// 初期化する。
router.get('/ready', (req, res) => {
    let environmentId, collectionId;
    discovery.listEnvironments({
        name: context.ENVIRONMENT_NAME
    })
        .then(({environments: v}) => {
            environmentId = v[0].environment_id;
            return discovery.listCollections({
                environment_id: environmentId,
                name: context.COLLECTION_NAME
            });
        })
        .then(({collections: v}) => {
            collectionId = v[0].collection_id;
            res.json({
                environment_id: environmentId,
                collection_id: collectionId
            });
        })
        .catch(e => {
            console.log('error:', e);
            res.sendStatus(500);
        });
});

// Object を表示する。
router.get('/cos/:key', (req, res) => {
    console.log(req.params.key);
    const
        bucket = context.BUCKET_NAME,
        key = req.params.key;
    cos.getObject({
        Bucket: bucket,
        Key: key
    })
        .then(v => {
            res.set('Content-Type', v.ContentType);
            res.send(v.Body);
        })
        .catch(e => {
            console.log('error', e);
            res.sendStatus(500);
        });
});

// Query を実行する。
router.get('/:environmentId/:collectionId', (req, res) => {
    const count = req.query.count ? req.query.count : 10;
    const filter = req.query.filter === undefined ? undefined : req.query.filter;
    const nlq = req.query.nlq === undefined ? undefined : req.query.nlq;
    const passages = req.query.passages === 'true' ? true : undefined;
    discovery.query({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
        filter: filter,
        natural_language_query: nlq,
        passages: passages,
        count: count
    })
        .then(v => {
            res.json(v);
        })
        .catch(e => {
            console.log('error:', e);
            res.sendStatus(500);
        });
});

// Object をアップロードする。
router.post('/:environmentId/:collectionId', upload.array('upload-files'), (req, res) => {
    if (req.files) {
        return Promise.all(req.files.map(item => {
            return cos.putObject({
                Bucket: context.BUCKET_NAME,
                Key: item.originalname,
                Body: fs.createReadStream(item.path),
                ContentType: item.mimetype
            })
                .then(v => {
                    return discovery.addDocument({
                        environment_id: req.params.environmentId,
                        collection_id: req.params.collectionId,
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

// Object を削除する。
router.delete('/:environmentId/:collectionId/:documentId', (req, res) => {
    return Promise.all([
        cos.deleteObject({
            Bucket: context.BUCKET_NAME,
            Key: req.body.filename
        }),
        discovery.deleteDocument({
            environment_id: req.params.environmentId,
            collection_id: req.params.collectionId,
            document_id: req.params.documentId
        })
    ])
        .then(v => {
            res.json({});
        })
        .catch(e => {
            console.log('error:', e);
            res.status(500).send(e);
        });
});

