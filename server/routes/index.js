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

// アップロードディレクトリーがない場合は作成する。
const UPLOAD_DIR = 'upload/';
fs.access(UPLOAD_DIR, e => {
    if (e) {
        if (e.code === 'ENOENT') {
            fs.mkdir(UPLOAD_DIR, e => {
                if (e) console.log('error', e);
            });
        } else {
            console.log('error', e);
        }
    }
});

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
            cb(null, UPLOAD_DIR);
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
                collection_id: collectionId,
                bucket_name: context.BUCKET_NAME
            });
        })
        .catch(e => {
            console.log('error:', e);
            res.sendStatus(500);
        });
});

// Object を表示する。
router.get('/cos/:key', (req, res) => {
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
    const
        count = req.query.count ? req.query.count : 10,
        filter = req.query.filter === undefined ? undefined : req.query.filter,
        nlq = req.query.nlq === undefined ? undefined : req.query.nlq,
        highlight = req.query.highlight === 'true' ? true : undefined,
        passages = req.query.passages === 'true' ? true : undefined,
        passages_count = passages && req.query.passages_count ? req.query.passages_count : undefined;
    let temp = {};
    discovery.query({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
        filter: filter,
        natural_language_query: nlq,
        count: count,
        passages: passages,
        passages_count: passages_count,
        highlight: highlight
    })
        .then(v => {
            temp = v;
            return discovery.queryNotices({
                environment_id: req.params.environmentId,
                collection_id: req.params.collectionId,
                count: 1000
            });
        })
        .then(({results: v}) => {
            const noticeTable = {};
            v.forEach(row => {
                row.notices.forEach(item => {
                    if (item.document_id && !item.query_id) {
                        if (noticeTable[item.document_id]) {
                            noticeTable[item.document_id].push(item);
                        } else {
                            noticeTable[item.document_id] = [item];
                        }
                    }
                });
            });
            const results = temp.results.map(item => {
                item.notices = noticeTable[item.id];
                return item;
            });
            temp.results = results;
            res.json(temp);
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
                res.status(500).send(e);
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

// トレーニングデータを追加する。
router.post('/:environmentId/:collectionId/train', (req, res) => {
    discovery.addTrainingData({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
        natural_language_query: req.body.natural_language_query,
        examples: req.body.examples
    })
        .then(v => {
            res.json(v);
        })
        .catch(e => {
            console.log('error:', e);
            if (e.code) {
                res.sendStatus(e.code);
            } else {
                res.sendStatus(500);
            }
        });
});

// トレーニングデータ一覧を表示する。
router.get('/:environmentId/:collectionId/train', (req, res) => {
    let temp = {};
    discovery.listTrainingData({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
    })
        .then(v => {
            temp = v;
            return discovery.queryNotices({
                environment_id: req.params.environmentId,
                collection_id: req.params.collectionId,
                count: 1000
            });
        })
        .then(({results: v}) => {
            const noticeTable = {};
            v.forEach(row => {
                row.notices.forEach(item => {
                    if (item.query_id) {
                        if (noticeTable[item.query_id]) {
                            noticeTable[item.query_id].push(item);
                        } else {
                            noticeTable[item.query_id] = [item];
                        }
                    }
                });
            });
            const queries = temp.queries.map(item => {
                item.notices = noticeTable[item.query_id];
                return item;
            });
            temp.queries = queries;
            res.json(temp);
        })
        .catch(e => {
            console.log('error:', e);
            res.sendStatus(500);
        });
});

// トレーニングデータを削除する。
router.delete('/:environmentId/:collectionId/train/:queryId', (req, res) => {
    discovery.deleteTrainingData({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
        query_id: req.params.queryId
    })
        .then(v => {
            res.json(v);
        })
        .catch(e => {
            console.log('error:', e);
            res.sendStatus(500);
        });
});

// queryNotices を実行する。
router.get('/:environmentId/:collectionId/notices', (req, res) => {
    const count = req.query.count ? req.query.count : 10;
    discovery.queryNotices({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
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

// getCollection を実行する。
router.get('/:environmentId/:collectionId/status', (req, res) => {
    discovery.getCollection({
        environment_id: req.params.environmentId,
        collection_id: req.params.collectionId,
    })
        .then(v => {
            res.json(v);
        })
        .catch(e => {
            console.log('error:', e);
            res.sendStatus(500);
        });
});
