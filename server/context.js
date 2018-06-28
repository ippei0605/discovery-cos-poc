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

module.exports = {
    PORT: appEnv.port,
    URL: appEnv.url,
    COS_CREDS: cosCreds,
    DISCOVERY_CREDS: discoveryCreds
};