/**
 * Sieg Client Models: Context
 *
 * @module context
 * @author JIEC
 */

'use strict';

// サーバー URL をセットする。
const serverUrl = location.hostname === 'localhost' ? 'http://localhost:3000/' : '/';

export default class {
  static SERVER = serverUrl;
}
