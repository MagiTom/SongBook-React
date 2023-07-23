module.exports = {
    pathPrefix: '/english',
    plugins: [
      {
        resolve: `gatsby-theme-guitar-book`,
        options: {
          ...themeOptions,
          root: __dirname,
          baseDir: 'apps/english',
          subtitle: 'English Songs',
          siteName: 'Guitar Book',
          pageTitle: 'Guitar Book',
          description: 'Track and play best guitar songs for camping',
          githubRepo: 'jozwiaczek/guitar-book',
          menuTitle: 'Songs Types',
          gaTrackingId: 'UA-122299419-2',
          baseUrl: 'https://guitar-book.netlify.app/',
          logoLink: 'https://guitar-book.netlify.app//',
          contentDir: 'content',
          twitterHandle: 'jozwiaczek',
          youtubeUrl: 'https://www.youtube.com/c/JakubJ%C3%B3%C5%BAwiak/featured',
          navConfig: {
            'Polish Songs 🇵🇱': {
                url: 'https://guitar-book.netlify.app/',
                description:
                  'Navigate to guitar book with polish songs'
              },
              'English Songs 🇺🇸': {
                url: 'https://guitar-book.netlify.app/english',
                description:
                  'Navigate to guitar book with english songs'
              },
              'Shanties Songs 🏴‍': {
                url: 'https://guitar-book.netlify.app/shanties',
                description:
                  "Navigate to guitar book with shanties"
              }
          },
          sidebarCategories: {
            null: ['index'],
            'George Ezra': [
              'blame-it-on-me',
              'listening-to-the-men'
            ],
            'Other Guitar Books': [
              '[Polish 🇵🇱](https://guitar-book.netlify.app)',
              '[Shanties 🏴‍](https://guitar-book.netlify.app/shanties)'
            ],
          }
        }
      }
    ]
  };