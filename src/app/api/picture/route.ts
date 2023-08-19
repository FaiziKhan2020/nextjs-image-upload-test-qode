import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST (req: Request){
    try {
        const session:any = await getServerSession(authOptions) as unknown;
        if(!session) throw Error("Unauthorized")

        const { imageUrl } = (await req.json()) as {
          imageUrl: string;
        };
        console.log('Session: ', session)
        await prisma.post.create({
            data:{
                imageUrl,
                userId: session.user['id']
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
export async function GET (req: Request){
    try {
        const session:any = await getServerSession(authOptions) as unknown;
        if(!session) throw Error("Unauthorized")
        console.log('Session: ', session)
        const posts = await prisma.post.findMany({
            where:{
                userId: session.user.id
            },
            include:{
                Comment: true
            }
        })
    
    
        return NextResponse.json({
          posts
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