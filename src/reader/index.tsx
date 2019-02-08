import { formatRelative } from 'date-fns'
import * as React from 'react'
import { Post } from '../models'
import './styles.scss'

interface ReaderProps {
  posts: Post[]
}

const formatName = (id: string, name: string) => `${name}-${id.slice(0, 6)}`

export const Reader: React.SFC<ReaderProps> = ({ posts }) => {
  if (!posts) {
    return <div>SOMETHING WENT WRONG 😭</div>
  }

  if (posts.length === 0) {
    return (
      <div className="reader">No posts found :/ Will you be the first?</div>
    )
  }

  return (
    <div className="reader">
      {posts.map((post) => (
        <div className="reader__post">
          <Username name={post.username} userID={post.userID} />
          <span className="reader__message">{post.message}</span>
          <span className="reader__time">
            {formatRelative(new Date(post.createdAt), new Date())}
          </span>
        </div>
      ))}
    </div>
  )
}

Reader.displayName = 'Reader'

const Username: React.SFC<{ name: string; userID: string }> = ({
  name,
  userID
}) => (
  <span className="reader__user">
    {formatName(userID, name)}
    <span className="tooltip">{formatName(userID, name)}</span>
  </span>
)
