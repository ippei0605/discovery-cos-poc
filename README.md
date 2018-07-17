# Watson Discovery & COS PoC

## はじめに
とあるシステムに IBM Discovery を組み込むため、関連技術の調査をします。Discovery に登録する文書本体は Cloud Object Storage に登録します。

## デモアプリ
https://discovery-cos-poc.mybluemix.net/

* 文書登録
* 文書削除
* 自然言語検索


## 残課題
* Relevance 登録および検索への影響確認
* UI ページング

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

1. アプリをプッシュしてください。
    ```
    $ npm run push
    ```

1. アプリを起動してください。
    ```
    $ npm run page
    ```


## 参考
* http://regex-testdrive.com/ja/

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