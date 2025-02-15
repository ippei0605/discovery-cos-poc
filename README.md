# Watson Discovery & COS PoC

## はじめに
とあるシステムに IBM Discovery を組み込むため、関連技術の調査をします。Discovery に登録する文書本体は Cloud Object Storage に登録します。

## デモアプリ
https://discovery-cos-poc-ippei0605.mybluemix.net/

* 文書登録・削除
* 自然言語検索 (Passage, ハイライト表示)
  - PDF を表示した際にハイライトできるのは Firefox のみ (ブラウザの制約)
  - ハイライトの文字列 (<em> ダグ内の文字列) は CJK ではなく Kangxi に変換されている。(Discovery の問題) 一部文字がヒット一致しないため、内部で変換テーブルを用意した暫定対応する。
* Relevance 登録・検索


## 環境構築手順
### 準備
1. discovery-cos-poc アプリを PC にダウンロード (Download ZIP) して解凍してください。ディレクトリ名は discovery-cos-poc-master から discovery-cos-poc に変更してください。

### クライアントアプリ
1. クライアントアプリのホームに移動してください。
    ```
    $ cd client
    ```

1. モジュールをインストールしてください。
    ```
    $ npm i
    ```

1. アプリをビルドしてください。
    ```
    $ npm run build
    ```

### サーバーアプリ
1. サーバーアプリのホームに移動してください。
    ```
    $ cd server
    ```

1. [package.json](server/package.json) の `config` をご自身の環境に合わせて変更してください。

    | Property         | Default value               | Description |
    |:-----------------|:----------------------------|:------------|
    | api_endpoint     | https://api.ng.bluemix.net  | IBM Cloud のエンドポイント (米国南部) |
    | app_name         | discovery-cos-poc-ippei0605 | アプリ名 (米国南部でユニークなので変更してください) |
    | cos_name         | discovery-cos-poc-cos       | Cloud Object Storage のインスタンス名 (変更しなくても大丈夫です) |
    | cos_alias_name   | discovery-cos-poc-cos-alias | Cloud Object Storage のエイリアス名 (変更しなくても大丈夫です) |
    | discovery_name   | discovery-cos-poc-discovery | Discovery のインスタンス名 (変更しなくても大丈夫です) |
    | bucket_name      | bucket-ippei0605-0001       | Cloud Object Storage の Bucket 名 (グローバルでユニークなので変更してください)
    | environment_name | my_environment              | Discovery の Environment (変更しなくても大丈夫です) |
    | collection_name  | my_collection               | Discovery の Collection (変更しなくても大丈夫です) |

1. [manifest.yml](server/manifest.yml) をご自身の環境に合わせて変更してください。

    | Property   | Default value               | Description |
    |:-----------|:----------------------------|:------------|
    | host       | discovery-cos-poc-ippei0605 | ホスト名     |
    | name       | discovery-cos-poc-ippei0605 | アプリ名     |
    | domain     | mybluemix.net               | 米国南部     |
    | services   | discovery-cos-poc-cos-alias, discovery-cos-poc-discovery | バインドするサービスインスタンス名 |

    > package.json で設定した値に合わせてください。

1. IBM Cloud にログインしてください。
    ```
    $ npm run login
    ```

    > 上記コマンドでe-mail, パスワードの入力、アカウント、組織、スペースの選択ができるはずです。
    > 上手くいかない場合は直接 `ibmcloud` コマンドでログインしてください。


1. モジュールをインストールしてください。
    ```
    $ npm i --ignore-scripts
    ```

    > ここではローカルで postinstall スクリプトを起動させないようにオプションを指定。

1. アプリをビルドしてください。
    ```
    $ npm run build
    ```

1. サービスを作成してください。
    ```
    $ npm run service_create
    ```

    > 削除コマンドは用意してません。(バインドやキーがあると削除できず、両者の状態を特定するのが難しいため。)

1. アプリをプッシュしてください。
    ```
    $ npm run push
    ```

    > IBM Cloud 側で `postinstall.js` が実行され、Discovery と Cloud Object Storage を初期化します。
    > 処理が失敗する場合は、`package.json` の設定値を見直し、IBM Cloud のダッシュボードからアプリ、サービスインスタンス、サービスエイリアエスを削除してください。サービスの作成から再実行してください。

1. アプリを起動してください。
    ```
    $ npm run page
    ```

## まとめ
* Discovery と Cloud Object Storage により PDF の検索アプリを作成できました。(Relevance 対応)
* Discovery の日本語のハイライトを加工する場合は、文字コード (Kangxi) の問題で工夫が必要です。
* Cloud Object Storage へのアクセスは次の3通りの方法があります。
  - コマンドライン (curl, 初回 apikey で IAM token を要求し、その後は IAM token でコマンドを実行)
    - https://console.bluemix.net/docs/services/cloud-object-storage/cli/curl.html#using-curl-
  - クライアントライブラリ と apikey によるアクセス (本アプリはこちらの方法で実装しました。)
  - 直接アクセス
    - Bucket および Object の ACL を共に `public-read` にすることで、ブラウザから次のようにアクセスすることができます。
      - https://s3-api.us-geo.objectstorage.softlayer.net/bucket-ippei0605-0001/_watsonsummit2017_session_list.pdf
    - ACL 設定のサンプルコード [server/acl.js](./server/acl.js)


## 参考
* Regular Expression Test Drive (Highlightの <em> タグ除去に正規表現を使用)
    - http://regex-testdrive.com/ja/
* Unicode/コード表
    - http://www.bugbearr.jp/?Unicode%2F%E3%82%B3%E3%83%BC%E3%83%89%E8%A1%A8
* 社内の部会で説明した資料
    - [docs/部会_20180726.pptx](./docs/部会_20180726.pptx)

## おまけ
久々なので、 vlu-cli の手順を記録しておきます。
vlu-cli を更新します。

```
$ sudo npm update -g vue-cli
```

プロジェクトをデフォルト設定で作成します。
```
$ vue init webpack client

? Project name client
? Project description A Vue.js project
? Author Ippei SUZUKI <i.suzuki@jiec.co.jp>
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests Yes
? Pick a test runner jest
? Setup e2e tests with Nightwatch? Yes
? Should we run `npm install` for you after the project has been created? (recommended) npm

   vue-cli · Generated "client".
```

client ディレクトリーに移動して、README.md に従って、 `npm run build` まで実行すれば、 `Welcome to Your Vue.js App` をいうページが表示できます。


さあ、プログラムを始めよう。