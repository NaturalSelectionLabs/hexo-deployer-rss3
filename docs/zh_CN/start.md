# hexo-deployer-rss3

Hexo 的 RSS3 部署插件.

## 📝 文档

- [English](https://github.com/NaturalSelectionLabs/hexo-deployer-rss3/blob/develop/README.md) 
- 简体中文 
- [正體中文](https://github.com/NaturalSelectionLabs/hexo-deployer-rss3/tree/develop/docs/zh_TW/start.md)

关于 Hexo 部署器的使用方法，您可以参见 Hexo 的 [一键部署](https://hexo.io/zh-cn/docs/one-command-deployment) 文档。

详细的使用教程可以参见 [将 Hexo 博客部署到 RSS3](./guide.md)

## 🎁 安装

``` sh
npm install hexo-deployer-rss3
```

或

``` sh
yarn add hexo-deployer-rss3
```

您需要 Node v14 或更新的版本来运行它，旧版本无法辨认 `?.` ，因而会导致 `Unexpected token` 错误。详情请参见 [可选链操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 。

## 💎 在开始之前...

1. 配置文件中的 `privateKey` 是什么 ?

   这是标识您为一个 RSS3 persona 控制者的唯一标识。请记得一定要保管好它。

   理论上您可以使用任何兼容以太坊网络的私钥，但我们推荐您使用 [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID) 来生成。

   这样，您也可以简单清楚地看到您发送的内容。

2. 如果我没有 IPFS 网关的账户怎么办 ?

   您可以通过修改 `ipfs/deploy` 选项来选择是否将内容发送到 IPFS 网络。

   为了方便您体验 RSS3 ，我们在以下的配置样例中提供了一份可以方便您使用的 API 密钥对。

   但是我们并不保证任何大于 50 MB的文件的可访问性，请勿滥用珍贵的资源。

   目前只有文章的 html 文件会被部署到 IPFS 上，所以在开启 `ipfs/deploy` 选项前，请确认您的主题能够在单文件模式下（例如双击打开生成的文件）。


## ⚙ 配置

将下列 hexo-deployer-rss3 特定的配置项添加到您站点的 `_config.yml` 文件中。

``` yaml
deploy: # 所有部署器的根配置块
- type: rss3
  endpoint: https://hub.rss3.io # 一个 RSS3 Hub 的链接
  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba # 您的私钥，64字节。
  ipfs: # ipfs 相关的配置
    deploy: true # 是否部署到 IPFS
    gateway: pinata # IPFS API 网关
    api: # IPFS 网关相关的验证内容
      key: 74791336243c5c676fe0
      secret: 2c46a3249a3f4dce9b4fafd55304985ef14abdcd44a4f06fb0f3a4133e80c1d0
```
