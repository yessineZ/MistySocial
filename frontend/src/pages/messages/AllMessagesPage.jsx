import React from 'react'

import Conversations from '../Conversations/Conversations'
import MessageContainer from './MessageContainer'

const AllMessagesPage = () => {
  return (
    <div className='flex flex-row w-full min-w-8 '>
      
      <Conversations/>
      <MessageContainer/>

    
    </div>
  )
}

export default AllMessagesPage

