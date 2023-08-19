'use client'
import "@uploadthing/react/styles.css";
import { supabase } from "@/lib/supabase";
import { Box, Button, Text, Card, CardHeader, CardBody, CardFooter, Image, Stack, Divider,Heading, ButtonGroup, Input  } from "@chakra-ui/react";
import { UploadButton } from "@uploadthing/react";
import { use, useEffect, useState } from "react";
import { OurFileRouter } from "../api/uploadthing/core"
import { signOut } from "next-auth/react";
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Object[]>([])
  const [comments, setComments] = useState<Object>({});
  

  function handleComments(value,postId){
      let comment = {};
      comment[postId] = value;
      setComments(comment)
  }

  useEffect(()=>{
    async function fetchSession(){
      const status = await getSession()
      if(status === 'fail'){
        window.location.href = '/login'
      }else{
        setLoading(false)
      }
    }

    fetchSession()
  })

  async function handleSendComment(){
    let payload:{postId: string; comment:string;} ={postId:'',comment:''}
    payload.postId = Object.keys(comments)[0];
    payload.comment = comments[payload.postId];
    await postComment(payload)
    setComments({})
    const data = await fetchPosts()
    setPosts(data)
  }

  useEffect(()=>{
    async function fetchData(){
      const data = await fetchPosts()
      setPosts(data)
    }

    fetchData()
  },[])


  async function postPicture(imageUrl:string){
    const res:any = await fetch("/api/picture", {
      method: "POST",
      body: JSON.stringify({imageUrl}),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await fetchPosts()
    setPosts(data)
  }

  if(loading) return null;
  return (
    <Box>
      <Box textAlign={'end'} width={'100%'} marginTop={'30px'}>
        <Button marginRight={'20px'} onClick={()=>{
          signOut();
          window.location.href = '/login'
        }} value={"Logout"} colorScheme="red">Logout </Button>
            <UploadButton<OurFileRouter>
                endpoint="imageUploader"
                onClientUploadComplete={async (res) => {
                    if (res) {
                        //send the image to backend api
                        await postPicture(res[0].url)
                    }
                }}
                onUploadError={(error: Error) => {
                    console.log('Error in uploading: ', error)
                }}
            />


      </Box>
      <Box display={'grid'} justifyContent={'center'} marginTop={'30px'} width={'100%'} height={'100%'}>
        <>
                {
                  posts && posts.length ? posts.map((post:any)=>(
                    <Card maxW='lg' marginTop={'30px'}>
                      <CardBody>
                        <Image
                          src={post.imageUrl}
                          alt='Post'
                          borderRadius='lg'
                        />
                        {console.log('PC: ', post.Comment)}
                        {
                          post.Comment.map((comment)=>(
                            <Stack mt='6' spacing='3'>
                            <Heading size='md'>{comment.commentBy}</Heading>
                            <Text>
                              {comment.comment}
                            </Text>
                          </Stack>
                          ))
                        }
                      </CardBody>
                      <Divider />
                      <CardFooter>
                          <Input value={comments[`${post.id}`] as string ??''} onChange={(eve)=>handleComments(eve.target.value, post.id)} />
                          <Button onClick={()=>handleSendComment()} variant='solid' colorScheme='blue'>
                            Comment
                          </Button>
                      </CardFooter>
                    </Card>
                  )) :  (<></>)
                }
          </>
      </Box>
    </Box>
  )
}

async function fetchPosts(){
  const res = await (await fetch('/api/picture')).json()
  return res.posts;
}

async function postComment(data){
  return await fetch('/api/comment',{
    method:'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  })
}

async function getSession(){
  const res = await (await fetch('/api/session')).json();
  return res.status
}