import React from 'react'
import ContentLoader from 'react-content-loader'

const AuthorsList = props => (
  <ContentLoader
    viewBox="0 0 600 1200"
    height={1200}
    width={600}
    
    {...props}
  >
    <circle cx="60" cy="87" r="38.3" />
    <rect x="120" y="29.5" width="270" height="17" />
    <rect x="120" y="64.7" width="450" height="17" />
    <rect x="120" y="97.8" width="370" height="17" />
    <rect x="120" y="132.3" width="345" height="17" />

    <circle cx="60" cy="243.5" r="38.3" />
    <rect x="120" y="199.9" width="270" height="17" />
    <rect x="120" y="235" width="450" height="17" />
    <rect x="120" y="268.2" width="370" height="17" />
    <rect x="120" y="302.6" width="345" height="17" />

    <circle cx="60" cy="412.7" r="38.3" />
    <rect x="120" y="369" width="270" height="17" />
    <rect x="120" y="404.2" width="450" height="17" />
    <rect x="120" y="437.3" width="370" height="17" />
    <rect x="120" y="471.8" width="345" height="17" />
  </ContentLoader>
)

AuthorsList.metadata = {
  name: 'BYIRINGIRO Emmanuel', // My name
  github: 'emmbyiringiro', // Github username
  description: ' Authors/posts list style ', // Loader description
  filename: 'AuthorsList', // filename of your loader
}

export default AuthorsList