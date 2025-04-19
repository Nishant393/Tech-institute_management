import React from 'react'
import image from "../../public/404-removebg-preview.png"
const NotFound = () => {
  return (
    <div className='flex flex-col w-full justify-center ' >
      {/* <div className='' > */}
        <h1 className='bona-nova-sc-regular-italic bona-nova-sc-bold  bona-nova-sc-regular text-black m-auto '  > Oops something ! </h1>
        <h1 className='bona-nova-sc-regular-italic m-auto bona-nova-sc-bold  bona-nova-sc-regular text-black '  > went wong</h1>
        <div>
          <img src={image} className='m-auto' alt="" srcset="" />
        </div>
      {/* </div> */}
    </div>
  )
}

export default NotFound