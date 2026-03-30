import { PriceApprovalStatus } from "../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

const getFeaturedCourse= async ()=>{

    const featuredCourse= await prisma.course.findMany({
        where:{
            isFeatured:true,
            priceApprovalStatus:PriceApprovalStatus.APPROVED
        },
        include:{
            _count:{
                select:{
                    enrollments:true,
                    missions:true
                }
            }
        },
        take:6,
        orderBy:{
            createdAt:"desc"
        }

    })

    return featuredCourse;
}



export const homePageService={
getFeaturedCourse
}