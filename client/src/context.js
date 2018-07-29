/**
 * Sieg Client Models: Context
 *
 * @module context
 * @author JIEC
 */

'use strict';

// モジュールを読込む。
import axios from 'axios';

// サーバー URL をセットする。
const serverUrl = location.hostname === 'localhost' ? 'http://localhost:3000/' : '/';

// Axios インスタンスを作成する。
const api = axios.create({
  baseURL: serverUrl,
  timeout: 30000
});

export default class {
  static serverUrl = serverUrl;
  static api = api;
  static cosCreds = {
    apikey: 'KcTm3vmsUflex7UehNGj5i6LrEI2VWMudI0Jh77FwJzW',
    resource_instance_id: 'crn:v1:bluemix:public:cloud-object-storage:global:a/48984e66e3b9b429a0cfe14d0637f075:8df05bdf-5007-48b5-ba33-1e7257f255f1::'
  };
}
