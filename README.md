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
* 作成中


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