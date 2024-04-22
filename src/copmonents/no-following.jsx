import React from 'react'
import { ImNotification } from "react-icons/im";

const NoFollowing = () => {
  return (
    <div className='flex flex-col mt-8 gap-3 justify-center items-center'>
    <h1 className=' text-4xl font-semibold'>OOPS!!!</h1>
    <div>
    <ImNotification className=' text-9xl text-gray-200' />
    </div>
  <h1 className='text-xl font-semibold'>No active followings</h1>
  <p className='text-xl font-semibold text-center'>You do not have any active followings currently or is not accessible.</p>
  {/* You can add additional content or links here */}
</div>
  )
}

export default NoFollowing