import WorkflowNavBar from '@/components/feature/workflows/WorkflowNavBar'
import React from 'react'

export const instant = false

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='h-[95%] '  >
        <WorkflowNavBar/>
     
       {children}
      
       

    </div>
  )
}

export default layout