import React, { memo } from 'react'

const TopList = memo(() => {
  return (
    <h1>排行榜</h1>
  )
})

TopList.displayName = 'TopList'

export const Component = TopList

export default TopList