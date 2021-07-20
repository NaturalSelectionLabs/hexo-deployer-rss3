# hexo-deployer-rss3

Hexo 的 RSS3 部署插件.

## 📝 文檔

- [English](https://github.com/NaturalSelectionLabs/hexo-deployer-rss3/blob/develop/README.md) 
- [简体中文](https://github.com/NaturalSelectionLabs/hexo-deployer-rss3/tree/develop/docs/zh_CN/start.md) 
- 正體中文

關於 Hexo 部署器的使用方法，您可以參見 Hexo 的 [一鍵部署](https://hexo.io/zh-cn/docs/one-command-deployment) 文檔。

詳細的使用教程可以參見 [將 Hexo 博客部署到 RSS3](./guide.md)

## 🎁 安裝

``` sh
npm install hexo-deployer-rss3
```

或

``` sh
yarn add hexo-deployer-rss3
```

您需要 Node v14 或更新的版本來運行它，舊版本無法辨認 `?.` ，因而會導致 `Unexpected token` 錯誤。詳情請參見 [可選鏈操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 。

## 💎 在開始之前...

1. 配置文件中的 `privateKey` 是什麽 ?

   這是標識您為一個 RSS3 persona 控製者的唯一標識。請記得一定要保管好它。

   理論上您可以使用任何兼容以太坊網絡的私鑰，但我們推薦您使用 [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID) 來生成。

   這樣，您也可以簡單清楚地看到您發送的內容。

2. 如果我沒有 IPFS 網關的賬戶怎麽辦 ?

   您可以通過修改 `ipfs/deploy` 選項來選擇是否將內容發送到 IPFS 網絡。

   為了方便您體驗 RSS3 ，我們在以下的配置樣例中提供了一份可以方便您使用的 API 密鑰對。

   但是我們並不保證任何大於 50 MB的文件的可訪問性，請勿濫用珍貴的資源。

   目前只有文章的 html 文件會被部署到 IPFS 上，所以在開啟 `ipfs/deploy` 選項前，請確認您的主題能夠在單文件模式下（例如雙擊打開生成的文件）。


## ⚙ 配置

將下列 hexo-deployer-rss3 特定的配置項添加到您站點的 `_config.yml` 文件中。

``` yaml
deploy: # 所有部署器的根配置塊
- type: rss3
  endpoint: https://hub.rss3.io # 一個 RSS3 Hub 的鏈接
  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba # 您的私鑰，64字節。
  ipfs: # ipfs 相關的配置
    deploy: true # 是否部署到 IPFS
    gateway: pinata # IPFS API 網關
    api: # IPFS 網關相關的驗證內容
      key: 74791336243c5c676fe0
      secret: 2c46a3249a3f4dce9b4fafd55304985ef14abdcd44a4f06fb0f3a4133e80c1d0
```
