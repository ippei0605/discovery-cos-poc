/**
 * Discovery COS PoC Server: ルーティング
 * @module routes/index
 * @author Ippei SUZUKI
 * @see {@link https://www.npmjs.com/package/ibm-cos-sdk}
 */

'use strict';

/**
 * エンドポイントを設定する。
 * @type {string}
 * @see {@link https://console.bluemix.net/docs/services/cloud-object-storage/basics/endpoints.html#select-regions-and-endpoints}
 */
const ENDPOINT = 's3-api.us-geo.objectstorage.softlayer.net';

/**
 * ストレージクラスを設定する。(エンドポイントにより選択できるストレージクラスが異なる。)
 * @type {string}
 * @see {@link https://console.bluemix.net/docs/services/cloud-object-storage/basics/classes.html#use-storage-classes}
 */
const STORAGE_CLASS = 'us-standard';

// モジュールを読込む。
const
    express = require('express'),
    fs = require('fs'),
    multer = require('multer'),
    AWS = require('ibm-cos-sdk'),
    context = require('../context');

// ルーターを作成する。
const router = express.Router();
module.exports = router;

// ファイルアップロードを設定する。
const upload = multer({
    "dest": "upload/"
});

// COS オブジェクトを作成する。
const cos = new AWS.S3({
    endpoint: ENDPOINT,
    apiKeyId: context.APIKEY,
    serviceInstanceId: context.RESOURCE_INSTANCE_ID
});

// Bucket の一覧を表示する。
router.get('/', (req, res) => {
    res.sendStatus(500);
});