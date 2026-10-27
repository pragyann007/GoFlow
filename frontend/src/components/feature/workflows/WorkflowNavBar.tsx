"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { MoonIcon, Plus, SunIcon } from 'lucide-react'
import React from 'react'
import {useTheme} from "next-themes"
import ListNodeSheet from './ListNodeSheet'

const WorkflowNavBar = () => {
    const {setTheme,resolvedTheme} = useTheme()
    console.log("theme",resolvedTheme)
    const changeTheme = ()=>{
        setTheme(resolvedTheme=="dark"?"light":"dark")

    }
    return (
        <div className='w-full h-20   ' >
            <div className='w-full h-full border-1 border-slate-800 flex justify-between items-center p-4 ' >
                <div className='flex gap-4 '  >
                    <SidebarTrigger className="h-8 w-8 cursor-pointer" />
                    <Input className='border-none focus:border-none' defaultValue={"My Workflow"} />
                </div>

                <div className='' >

                    <Button variant={"outline"} onClick={changeTheme} >
                        {
                            resolvedTheme=="dark" ?  <MoonIcon/> : <SunIcon/>
 
                        }
                    </Button>
                    <ListNodeSheet>

                        <Button className={"flex gap-2 "} >
                            <Plus />
                            Add Node
                        </Button>

                    </ListNodeSheet>

                </div>


            </div>
        </div>
    )
}

export default WorkflowNavBar