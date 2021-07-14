## Deploy Hexo Blog to RSS3

## Preparation

You need to prepare.

1. a private key. Theoretically any Ethernet-compatible private key will work, but to get the most out of RSS3 and experience our new product and sharing, I'd like to recommend our [Re: ID](https://github.com/NaturalSelectionLabs/Re-ID) project. You can get a more stable release at [Chrome Web Store](https://chrome.google.com/webstore/detail/re-id/hcioafpcjhamfeiegnnahpjnmnlilkil).
2. NodeJS V14 and above. Due to the use of the `?.` operator, which is not recognized on older Node versions, you will need to use NodeJS V14 and above to deploy properly. Many CI/CDs may still default to V12, and you should be able to change the relevant parameter options. For example, in CloudFlare Pages, you can specify the environment variable `NODE_VERSION` as `16` to use Node V16.

If deploying to IPFS, you will also need to prepare

1. a pair of keys for the IPFS API gateway. We provide an official pair of keys (presented in the sample configuration below) for you to enjoy the new world of RSS3. But remember, don't misuse the key pair. 2.
Pages that can be rendered independently. You can check if there are any problems with style, interaction, etc. by opening the finished page of `hexo g` directly in your browser and seeing if it renders properly.

## Caution

Due to a design flaw, you need to first generate static files and temporary cache with `hexo g`, and then deploy with `hexo d`; the temporary cache files will be deleted after deployment, so there is a relatively strict process sequence. This issue will be addressed in a later refactoring.

## Start deployment

Get a private key.

    The private key is a unique identifier that identifies you as the controller of an RSS3 persona. Please remember to keep it safe and do not make it public.

    You can open an account using your Re: ID. This will give you a copy of the private key and identity that you can use on the RSS3 network. 2.

2. Install the `hexo-deployer-rss3` plugin.

    Depending on your package management tool, you can choose to use either npm or yarn for the installation.

    ```bash
    npm install hexo-deployer-rss3
    ```

    or

    ```bash
    yarn add hexo-deployer-rss3
    ```

3. Adjust the site deployment configuration.

    You need to configure the rss3 deployer for your site. According to the Hexo documentation for [one-click deployment](https://hexo.io/zh-cn/docs/one-command-deployment), you can place something like this in your site's configuration file.

    ```yaml
    deploy: # The root configuration block for all deployers
    - type: rss3
      endpoint: https://hub.rss3.io # A link to the RSS3 Hub
      privateKey: 47e18d6c386898b424025cd9db446f779ef24ad33a26c499c87bb3d9372540ba # Your private key, 64 bytes.
      ipfs: # ipfs-related configuration
        deploy: true # Whether to deploy to IPFS
        gateway: pinata # IPFS API gateway
        api: # IPFS gateway-related authentication content
          key: d693df715d3631e489d6
          secret: ee8b74626f12b61c1a4bde3b8c331ad390567c86ba779c9b18561ee92c1cbff0
    ```

    Please note to replace the private key in the `privateKey` paragraph above with your own content. Alternatively, if you do not need to deploy to IPFS, then you can set `ipfs/deploy` to false.

4. Generate static files and cache files.

    ```bash
    hexo g # or hexo generate, or npm run build can be used.
    ```

    You can use your browser to open your static files directly and check if they render correctly in standalone mode. 5.

5. One-click deployment

    ```bash
    hexo d # or hexo deploy
    ```

    Wait a few moments and you should see your blog content being deployed to the RSS3 network in parallel.
