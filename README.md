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

## ⚙️ Config

``` yaml
deploy:
- type: rss3
  endpoint: https://hub.rss3.io
  privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba
  ipfs:
    deploy: true
    gateway: pinata
    api:
      key: 1234567890abcdefghij
      secret: 700f8359e6b463c04c617f275e9aae7e037ea3889ad58eed51218d9bb9e8c6ff
```
