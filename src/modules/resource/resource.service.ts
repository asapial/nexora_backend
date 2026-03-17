import { prisma } from "../../lib/prisma"

const uploadResource=async (resourcePayload:any)=>{

     const result= await prisma.resource.create({
        data:resourcePayload
     })

     return result;



}




export const resourceService={
uploadResource
}