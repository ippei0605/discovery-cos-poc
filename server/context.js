/**
 * Discovery COS PoC Server: コンテキスト
 * @module context
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    cfenv = require('cfenv'),
    vcapServices = require('vcap_services'),
    cosCreds = vcapServices.getCredentials('cloud-object-storage'),
    discoveryCreds = vcapServices.getCredentials('discovery');

// 環境変数を取得する。
const appEnv = cfenv.getAppEnv();

// ポートをセットする。無い (ローカル環境の) 場合は 3000 をセットする。
const port = process.env.PORT || 3000;

// URL を取得する。
const url = process.env.PORT === undefined ? `http://localhost:${port}` : appEnv.url;

module.exports = {
    PORT: port,
    URL: url,
    COS_CREDS: cosCreds,
    DISCOVERY_CREDS: discoveryCreds,
    BUCKET_NAME: process.env.npm_package_config_bucket_name,
    ENVIRONMENT_NAME: process.env.npm_package_config_environment_name,
    COLLECTION_NAME: process.env.npm_package_config_collection_name
};