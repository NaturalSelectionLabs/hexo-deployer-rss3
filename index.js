/* global hexo */
'use strict';

hexo.extend.generator.register('rss3', require('./lib/generator'));
hexo.extend.deployer.register('rss3', require('./lib/deployer'));
