# 将 Hexo 博客部署到 RSS3

## 准备工作

您需要准备：

1. 一个私钥 (private key) 。理论上任何兼容以太坊的私钥都可以使用，但为了能更好地使用 RSS3 、体验我们的新产品和新分享，我想向大家推荐我们的 [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID) 项目。您可以在 [Chrome Web Store](https://chrome.google.com/webstore/detail/re-id/hcioafpcjhamfeiegnnahpjnmnlilkil) 获得比较稳定的发布版本。
2. NodeJS V14 及以上的版本。由于使用了 `?.` 操作符，在旧版 Node 上无法正常识别，您需要使用 NodeJS V14 及以上的版本才能正常部署。许多 CI/CD 默认的可能还是 V12 ，您应当可以修改相关的参数选项。例如在 CloudFlare Pages 中，您可以指定环境变量 `NODE_VERSION` 为 `16` 来使用 Node V16 。

如果部署到 IPFS 上，您还需要准备：

1. 一对 IPFS API 网关的密钥。我们官方提供了一对密钥（会在下文配置样例中呈现）方便您享受全新的 RSS3 世界。但是请记得，千万不要滥用这对 key 。
2. 能够独立渲染的页面。您可以通过使用浏览器直接打开 `hexo g` 生成完成后的页面，查看其能否正常渲染来检查样式、交互等是否存在问题。

## 注意事项

由于目前设计缺陷，每次需要先 `hexo g` 生成静态文件和临时缓存，再使用 `hexo d` 进行部署；部署后会删除临时缓存文件，因而存在相对严格的流程顺序。这个问题将在之后重构的时候得到解决。

## 开始部署

1. 获得一个私钥。

    私钥是标识您为一个 RSS3 persona 控制者的唯一标识。请记得一定要保管好它，不要公开。

    你可以使用 Re: ID 开启一个账户。这样，您就能获得一份可以使用在 RSS3 网络上的私钥与身份。

2. 安装 `hexo-deployer-rss3` 插件。

    根据您包管理工具的不同，您可以选择使用 npm 或是 yarn 进行对应的安装工作。

    ```bash
    npm install hexo-deployer-rss3
    ```

    或

    ```bash
    yarn add hexo-deployer-rss3
    ```

3. 调整站点部署配置。

    您需要为您的站点配置 rss3 部署器。根据 Hexo 文档中关于 [一键部署](https://hexo.io/zh-cn/docs/one-command-deployment) 的相关说明，您可以将这样的内容放置到您站点的配置文件中：

    ```yaml
    deploy: # 所有部署器的根配置块
    - type: rss3
      endpoint: https://hub.rss3.io # 一个 RSS3 Hub 的链接
      privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba # 您的私钥，64字节。
      ipfs: # ipfs 相关的配置
        deploy: true # 是否部署到 IPFS
        gateway: pinata # IPFS API 网关
        api: # IPFS 网关相关的验证内容
          key: d693df715d3631e489d6
          secret: ee8b74626f12b61c1a4bde3b8c331ad390567c86ba779c9b18561ee92c1cbff0
    ```

    请注意将上述的 `privateKey` 段中的私钥替换成您自己的内容。另外，如果您不需要部署到 IPFS ，那么您可以将 `ipfs/deploy` 设置为 false 。

4. 生成静态文件和缓存文件。

    ```bash
    hexo g # 或是 hexo generate ， 或是 npm run build 等指令均可。
    ```

    您可以使用浏览器直接打开您的静态文件，检查它们在单独的模式下是否能正确渲染。

5. 一键部署

    ```bash
    hexo d # 或是 hexo deploy
    ```

    稍等片刻，您应该就能看见您的博客内容被同步部署到 RSS3 网络上。
