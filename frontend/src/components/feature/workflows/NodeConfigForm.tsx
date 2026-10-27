import { IFNodeProperty } from '@/types/workflow'
import React from 'react'
import * as z from "zod"
import { useForm, Controller } from "react-hook-form"

// const fieldsSchema = z.array(
//   z.object({
//     displayName:z.string(),
//     name:z.string(),
//     placeholder:z.string(),
//     options:z.array(z.string).optional()
//   })
// )


const NodeConfigForm = ({fields}:{fields:IFNodeProperty[]}) => {
    
  return (
    <div>{
        fields.map((field)=>(
            <div>
                <h1>{field.displayName}</h1>
            </div>
        ))
    }</div>
  )
}

export default NodeConfigForm