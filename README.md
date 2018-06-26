# Watson Discovery & COS PoC


久々なので、 vlu-cli を更新します。
```
sudo npm update -g vue-cli
```

プロジェクトを作成します。
```
vue init webpack client
```

デフォルト設定で作成します。
```
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