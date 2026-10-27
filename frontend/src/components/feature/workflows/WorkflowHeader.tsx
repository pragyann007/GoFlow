"use client"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import axios from "axios"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'

const WorkflowHeader = () => {
    const [workflowName,setWorkflowName]= useState<string>("")

    const router = useRouter()

    const createWorkFow = async () => {

        try {
            const res = await api.post("/workflows", { name:workflowName })
            const data = res.data;

            console.log(data)
            toast.success("Workflow created..")
            router.push(`/dashboard/workflows/${data.workflow.id}`)

            
        } catch (error) {
            toast.error("Error creating workflow")
            
        }



    }
    return (
        <div >
            <div className='flex justify-between ' >
                <div>
                    <h4 className='text-md text-foreground' >My Workflows</h4>
                </div>
                <div>
                    <Dialog>
                        <DialogTrigger>

                            <Button className='flex gap-2 p-4 cursor-pointer ' >
                                <span><Plus /></span>
                                Create Workflow
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                    Give the name for you Workflow.
                                </DialogDescription>


                            </DialogHeader>

                            <Label>Workflow Name</Label>
                            <Input onChange={(e)=>setWorkflowName(e?.target.value)} type='text' placeholder='My Workflow'  />

                            <Button onClick={createWorkFow} variant={"outline"} >Create Workflow</Button>
                        </DialogContent>
                    </Dialog>


                </div>
            </div>
        </div>
    )
}

export default WorkflowHeader