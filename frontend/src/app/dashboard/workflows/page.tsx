import WorkflowBody from '@/components/feature/workflows/WorkflowBody'
import WorkflowHeader from '@/components/feature/workflows/WorkflowHeader'
import React from 'react'

const page = () => {
  return (
    <div  className='p-12 flex flex-col gap-4 ' >

      <WorkflowHeader/>
      <WorkflowBody/>

      
      

    </div>
  )
}

export default page