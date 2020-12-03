/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div className="w-full min-h-screen max-h-full max-w-full overflow-hidden bg-gray-100 dark:bg-gray-900 font-sans text-base flex flex-col md:justify-center items-center">
        <main>{children}</main>
        <footer className="w-full bg-gray-700 dark:bg-black text-center fixed bottom-0 py-2 text-white">
          Built by <a href="https://twitter.com/abishek_py">@abishek_py</a>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
