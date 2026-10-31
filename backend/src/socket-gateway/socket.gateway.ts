import { SubscribeMessage, WebSocketGateway,OnGatewayConnection,OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import type {Server,Socket} from "socket.io"

@WebSocketGateway({cors:{
  origin:"http://localhost:3000"
}})
export class SocketGateway implements OnGatewayConnection,OnGatewayDisconnect {

  @WebSocketServer()
  server:Server

  
  emitToUserRoom(
    workflowId:string,eventName:string,data:any
  ){

    this.server.to(`room_${workflowId}`).emit(eventName,data);

  }



  handleConnection(client: Socket, ...args: any[]) {

    const workflowId = client.handshake.query.workflowId as string ; 

    if(workflowId){
      client.join(`room_${workflowId}`)
      console.log(`Socket client joined room ${client.id}`)
      client.emit("connection-status",{status:"connected"})


    }
    else {
      console.log(`Client connected without a userId. Disconnecting...`);
      client.disconnect();
    }
    
  }
handleDisconnect(client: any) {
  console.log(`Client disconnected: ${client.id}`);
  
}
 



}
