const moment = require('moment')

module.exports = {
  title: '前端工程师成长路线',
  description: '博客 分享 读后感 成长规划',
  dest: './dist',
  base: '/my-notes/',
  theme: 'reco',
  sidebar: 'auto',
  head: [
    [
      'meta',
      {
        name: 'description',
        itemprop: 'description',
        content: '前端工程师成长路线',
      },
    ],
    ['meta', { itemprop: 'name', content: '前端工程师成长路线' }],
  ],
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          moment.locale(lang)
          return moment(timestamp).format('YYYY-MM-DD HH:mm:SS')
        },
      },
    ],
  ],
  themeConfig: {
    sidebar: [
      '/mysql/',
      '/css/',
      '/array/',
      '/array/methods',
      '/task/',
      '/permission/',
      '/tree/',
      '/element/',
      '/mockjs/',
      '/hooks/',
      '/vue/',
      '/capture/',
    ],
    lastUpdated: '上次更新时间',
    // 假定 GitHub。也可以是一个完整的 GitLab 网址
    repo: 'https://github.com/yuxiaosenstar/my-notes',
  },
}
