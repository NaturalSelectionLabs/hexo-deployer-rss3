# hexo-deployer-rss3

RSS3 deployer plugin for Hexo.

## 📝 Docs

English [简体中文](https://github.com/NaturalSelectionLabs/hexo-deployer-rss3/tree/develop/docs/zh_CN/start.md)

For Hexo generators' using instructions, you can refer to [One-Command Deployment - Hexo](https://hexo.io/docs/one-command-deployment.html) 

## 🎁 Install

``` sh
npm install hexo-deployer-rss3
```

or

``` sh
yarn add hexo-deployer-rss3
```

You may need Node v16 or later to run it, older versions cannot recognize `?.` and thus would cause `Unexpected token` error.

## 💎 Before start...

1. What means for `privateKey` field in config ?

    It's the only thing marking you as the full controller of a RSS3 persona. Remember to take good care of it. 
    
    Theoretically you can use any ETH-compatible private keys, but we prefer you to generate one using [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID).
    
    This way, you can also get what you've published clearly in a simple way.

2. What if I don't have any IPFS gateway accounts ?
  
    You can manually choose whether publish to IPFS or not by changing `ipfs/deploy` field.
    
    We also provide one pair of api key for you to enjoy RSS3, which has been provided in below demo.
    
    We do not promise any accessibility of files Larger than 50 MB. DO NEVER abuse it.

    Only the post html file itself could be deployed to IPFS currently. 
    Please confirm if your theme can render correctly in single-file mode (like open generated html files after `hexo g`) 
    before enabling the `ipfs/deploy` option.


## ⚙ Config

Add hexo-deployer-rss3 specified configurations info your site's `_config.yml` file.

``` yaml
deploy: # definitation root for all deployers
- type: rss3
  endpoint: https://hub.rss3.io # link to a RSS3 hub
  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba # your private key, 64 chars
  ipfs: # ipfs specified configurations
    deploy: true # deploy to IPFS
    gateway: pinata # IPFS API gateway
    api: # IPFS gateway related auth credentials
      key: d693df715d3631e489d6
      secret: ee8b74626f12b61c1a4bde3b8c331ad390567c86ba779c9b18561ee92c1cbff0
```
