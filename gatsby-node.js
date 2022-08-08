const { join, resolve } = require('path')

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '~components': join(__dirname, 'src/components'),
        '~pages': join(__dirname, 'src/pages'),
        '~images': join(__dirname, 'src/images'),
        '~constants': join(__dirname, 'src/constants'),
        '~designSystem': join(__dirname, 'src/designSystem'),
        '~lib': join(__dirname, 'src/lib'),
      },
    },
  })
}

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: 'babel-preset-gatsby',
    options: {
      reactRuntime: 'automatic',
    },
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const grapqlRes = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: { fileAbsolutePath: { regex: "/index/" }, frontmatter: { title: { ne: "DUMMY" } } }
      ) {
        edges {
          node {
            id
            fileAbsolutePath
            frontmatter {
              title
              permalink
            }
          }
        }
      }
    }
  `)

  const posts = grapqlRes.data.allMarkdownRemark.edges

  // [Create each blog post page]
  posts.forEach(post => {
    createPage({
      path: post.node.frontmatter.permalink,
      component: resolve('./src/templates/BlogPost.tsx'),
      context: {
        id: post.node.id,
      },
    })
  })

  // Create paginated blog list pages
  const postsPerPage = 6
  const pageCount = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: pageCount }).forEach((_, i) => {
    const isFirstPage = i === 0
    const currentPageNumber = i + 1
    createPage({
      path: isFirstPage ? '/' : `/page/${currentPageNumber}`,
      component: resolve('./src/templates/BlogList.tsx'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        pageCount,
        currentPageNumber,
      },
    })
  })
}
