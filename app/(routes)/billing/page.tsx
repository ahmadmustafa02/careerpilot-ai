import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div>
        <h2 className='font-bold text-3xl text-center'>Chose your plan</h2>
        <p className='text-lg text-center'>Select subscription bundle to get all AI Tools access</p>
        
        <div className='mt-5'>
            <PricingTable  />
            </div>

    </div>
  )
}

export default Billing