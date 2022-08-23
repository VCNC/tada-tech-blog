module.exports = {
  siteMetadata: {
    title: 'TADA Tech Blog',
    siteUrl: 'https://blog-tech.tadatada.com',
    author: {
      name: 'TADA Tech Team',
      email: 'dev@vcnc.co.kr',
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-W2REEG4KJW'],
        pageConfig: {
          head: true,
          origin: 'https://blog-tech.tadatada.com/',
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: './static/images/ic_favicon_tada.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `./_posts`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 720,
              linkImagesToOriginal: false,
              backgroundColor: 'transparent',
            },
          },
          {
            resolve: 'gatsby-remark-table-of-contents',
            options: {
              exclude: 'Table of Contents',
              tight: false,
              ordered: false,
              fromHeading: 2,
              toHeading: 6,
              className: 'table-of-contents',
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
              escapeEntities: {},
            },
          },
          'gatsby-remark-copy-linked-files',
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        outputPath: `src/gatsby-types.d.ts`,
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `avif`, `webp`],
          placeholder: `none`,
          quality: 70,
          backgroundColor: `transparent`,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              siteUrl
              site_url: siteUrl
              author {
                name
                email
              }
            }
          }
        }
        `,
        setup: options => {
          return {
            custom_elements: [
              {
                author: [
                  {
                    name: options.query.site.siteMetadata.author.name,
                  },
                  {
                    email: options.query.site.siteMetadata.author.email,
                  },
                ],
              },
            ],
            ...options,
          }
        },
        feeds: [
          {
            title: 'TADA Tech Blog RSS Feed',
            output: 'rss.xml',
            query: `
            {
              allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
                nodes {
                  frontmatter {
                    title
                    date
                    description
                    permalink
                    authors {
                      name
                      link
                    }
                  }
                  html
                }
              }
            }
            `,
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                const { title, date, description, permalink } = node.frontmatter
                return Object.assign(
                  {},
                  {
                    title,
                    date,
                    description,
                    url: `${site.siteMetadata.siteUrl}${permalink}`,
                    guid: `${site.siteMetadata.siteUrl}${node.frontmatter.permalink}`,
                    custom_elements: [{ 'content:encoded': node.html }],
                  }
                )
              })
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `vcncengineeringblog`,
      },
    },
  ],
}
