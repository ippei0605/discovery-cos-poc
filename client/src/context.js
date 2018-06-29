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
}
