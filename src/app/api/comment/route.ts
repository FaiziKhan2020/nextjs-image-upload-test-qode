import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST (req: Request){
    try {
        const session:any = await getServerSession(authOptions) as unknown;
        if(!session) throw Error("Unauthorized")

        const { comment, postId } = (await req.json()) as {
          comment: string;
          postId: string
        };
        console.log('Session: ', session)
        await prisma.comment.create({
            data:{
                comment,
                commentBy: session.user.name,
                postId
            }
        })
    
    
        return NextResponse.json({
          status:true
        });
      } catch (error: any) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: error.message,
          }),
          { status: 500 }
        );
      }
}