import { prisma } from "../../lib/prisma"
import { iCreateCluster } from "./cluster.type"

const createCluster=async ( clusterPayload:iCreateCluster)=>{


    const createCluster= await prisma.cluster.create({
        data:clusterPayload
    })

    return createCluster;
}




export const clusterService={

    createCluster
}