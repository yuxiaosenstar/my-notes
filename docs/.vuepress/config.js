module.exports = {
  title: '前端工程师成长路线',
  description: '博客 分享 读后感 成长规划',
  dest: './dist',
  base: '/my-notes/',
  theme: 'reco',
  themeConfig: {
    sidebar: [
      {
        title: 'js数组',
        children: ['/array/', '/array/methods'],
      },
      '/task/',
      '/permission/',
      '/tree/',
      '/element/',
      '/mockjs/',
      '/hooks/',
      '/vue/',
      '/capture/',
    ],
    // 假定 GitHub。也可以是一个完整的 GitLab 网址
    repo: 'https://github.com/yuxiaosenstar/my-notes',
  },
}
