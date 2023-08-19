import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const uploadFunction = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: uploadFunction({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
        // Set permissions and file types for this FileRoute
        .middleware(async (req) => {
            console.log('Here its')
            const session = await getServerSession(authOptions);

            // If you throw, the user will not be able to upload
            if (!session) throw new Error("Unauthorized");
            console.log('Done1 ', session)
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.email };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log('Now uploading, ')
        }),

    // Takes a 4 2mb images and/or 1 256mb video
    mediaPost: uploadFunction({
        image: { maxFileSize: "2MB", maxFileCount: 1 }
    })
        .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;