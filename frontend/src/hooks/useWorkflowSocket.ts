
import { useWorkflowStore } from '@/store/useWorkflowStore'
import React,{useState,useRef,useEffect} from 'react'
import {io, Socket} from "socket.io-client"



export const EVENT_STATUS="node-status"

export const EVENT_OUTPUT="node-output"




const useWorkflowSocket = (workflowId:string) => {

    const socketRef = useRef<Socket|null>(null)
    const setNodeStatus = useWorkflowStore((state)=>state.setNodeStatus)
    const setNodeOutput = useWorkflowStore((state)=>state.setNodeOutputs)

    useEffect(()=>{
        if(!workflowId) return ;


        socketRef.current = io("http://localhost:3001", { query: { workflowId } })
        const socket = socketRef.current ; 

        socket.on("connect",()=>{
            console.log("socket connected",socket.id)
        })
        socket.on(EVENT_STATUS, (payload: { status: string; nodeId: string; error?: string }) => {
            setNodeStatus(payload.nodeId, payload.status);
        });

        // 3. Listen for node execution outputs
        socket.on(EVENT_OUTPUT, (payload: { nodeId: string; output: any }) => {
            setNodeOutput(payload.nodeId, payload.output);
        });


        return ()=>{
            socket.disconnect()
        }
    },[workflowId,setNodeStatus,setNodeOutput])
 
}

export default useWorkflowSocket