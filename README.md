# hexo-deployer-rss3

RSS3 deployer plugin for Hexo.

## 🎁 Install

``` sh
npm install hexo-deployer-rss3
```

or

``` sh
yarn add hexo-deployer-rss3
```

## 💎 Before start...

1. What means for `privateKey` field in config ?

    It's the only thing marking you as the full controller of a RSS3 profile. Remember to take good care of it. 
    
    Theoretically you can use any ETH-compatible private keys, but we prefer you to generate one using [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID).
    
    This way, you can also get what you've published clearly in a simple way.

2. What if I don't have any IPFS gateway accounts ?
  
    You can manually choose whether publish to IPFS or not by changing `deploy` field.
    
    We also provide one pair of api key for you to enjoy RSS3, which has been provided in below demo.
    
    We do not promise any accessibility of files Larger than 50 MB. DO NEVER abuse it.

    Only the post html file itself could be deployed to IPFS currently. 
    Please confirm if your theme can render correctly in single-file mode (like open generated html files after `hexo g`) 
    before enabling the `ipfs/deploy` option.


## ⚙️ Config

Add hexo-deployer-rss3 specified configurations info your site's `_config.yml` file.

``` yaml
deploy:
- type: rss3
  endpoint: https://hub.rss3.io
  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba
  ipfs:
    deploy: true
    gateway: pinata
    api:
      key: d693df715d3631e489d6
      secret: ee8b74626f12b61c1a4bde3b8c331ad390567c86ba779c9b18561ee92c1cbff0
```
