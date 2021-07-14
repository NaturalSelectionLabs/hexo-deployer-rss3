# 將 Hexo 博客部署到 RSS3

## 準備工作

您需要準備：

1. 一個私鑰 (private key) 。理論上任何兼容以太坊的私鑰都可以使用，但為了能更好地使用 RSS3 、體驗我們的新產品和新分享，我想向大家推薦我們的 [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID) 項目。您可以在 [Chrome Web Store](https://chrome.google.com/webstore/detail/re-id/hcioafpcjhamfeiegnnahpjnmnlilkil) 獲得比較穩定的發布版本。
2. NodeJS V14 及以上的版本。由於使用了 `?.` 操作符，在舊版 Node 上無法正常識別，您需要使用 NodeJS V14 及以上的版本才能正常部署。許多 CI/CD 默認的可能還是 V12 ，您應當可以修改相關的參數選項。例如在 CloudFlare Pages 中，您可以指定環境變量 `NODE_VERSION` 為 `16` 來使用 Node V16 。

如果部署到 IPFS 上，您還需要準備：

1. 一對 IPFS API 網關的密鑰。我們官方提供了一對密鑰（會在下文配置樣例中呈現）方便您享受全新的 RSS3 世界。但是請記得，千萬不要濫用這對 key 。
2. 能夠獨立渲染的頁面。您可以通過使用瀏覽器直接打開 `hexo g` 生成完成後的頁面，查看其能否正常渲染來檢查樣式、交互等是否存在問題。

## 註意事項

由於目前設計缺陷，每次需要先 `hexo g` 生成靜態文件和臨時緩存，再使用 `hexo d` 進行部署；部署後會刪除臨時緩存文件，因而存在相對嚴格的流程順序。這個問題將在之後重構的時候得到解決。

## 開始部署

1. 獲得一個私鑰。

    私鑰是標識您為一個 RSS3 persona 控製者的唯一標識。請記得一定要保管好它，不要公開。

    你可以使用 Re: ID 開啟一個賬戶。這樣，您就能獲得一份可以使用在 RSS3 網絡上的私鑰與身份。

2. 安裝 `hexo-deployer-rss3` 插件。

    根據您包管理工具的不同，您可以選擇使用 npm 或是 yarn 進行對應的安裝工作。

    ```bash
    npm install hexo-deployer-rss3
    ```

    或

    ```bash
    yarn add hexo-deployer-rss3
    ```

3. 調整站點部署配置。

    您需要為您的站點配置 rss3 部署器。根據 Hexo 文檔中關於 [一鍵部署](https://hexo.io/zh-cn/docs/one-command-deployment) 的相關說明，您可以將這樣的內容放置到您站點的配置文件中：

    ```yaml
    deploy: # 所有部署器的根配置塊
    - type: rss3
      endpoint: https://hub.rss3.io # 一個 RSS3 Hub 的鏈接
      privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba # 您的私鑰，64字節。
      ipfs: # ipfs 相關的配置
        deploy: true # 是否部署到 IPFS
        gateway: pinata # IPFS API 網關
        api: # IPFS 網關相關的驗證內容
          key: d693df715d3631e489d6
          secret: ee8b74626f12b61c1a4bde3b8c331ad390567c86ba779c9b18561ee92c1cbff0
    ```

    請註意將上述的 `privateKey` 段中的私鑰替換成您自己的內容。另外，如果您不需要部署到 IPFS ，那麽您可以將 `ipfs/deploy` 設置為 false 。

4. 生成靜態文件和緩存文件。

    ```bash
    hexo g # 或是 hexo generate ， 或是 npm run build 等指令均可。
    ```

    您可以使用瀏覽器直接打開您的靜態文件，檢查它們在單獨的模式下是否能正確渲染。

5. 一鍵部署

    ```bash
    hexo d # 或是 hexo deploy
    ```

    稍等片刻，您應該就能看見您的博客內容被同步部署到 RSS3 網絡上。
