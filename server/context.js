/**
 * Discovery COS PoC Server: コンテキスト
 * @module context
 * @author Ippei SUZUKI
 */

'use strict';

// Bucket name (_ はダメらしい)
const BUCKET_NAME = 'bucket-ippei0605';

// Environment name
const ENVIRONMENT_NAME = 'my_environment';

//  Collection name
const COLLECTION_NAME = 'my_collection';

// モジュールを読込む。
const
    cfenv = require('cfenv'),
    vcapServices = require('vcap_services'),
    cosCreds = vcapServices.getCredentials('cloud-object-storage'),
    discoveryCreds = vcapServices.getCredentials('discovery');

// 環境変数を取得する。
const appEnv = cfenv.getAppEnv();

module.exports = {
    PORT: appEnv.port,
    URL: appEnv.url,
    COS_CREDS: cosCreds,
    DISCOVERY_CREDS: discoveryCreds,
    BUCKET_NAME: BUCKET_NAME,
    ENVIRONMENT_NAME: ENVIRONMENT_NAME,
    COLLECTION_NAME: COLLECTION_NAME
};