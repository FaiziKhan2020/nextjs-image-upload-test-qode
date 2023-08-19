'use client'
import { Link, Text } from '@chakra-ui/react'

export default function AccessDenied () {
  return (
    <>
      <h1>Access Denied</h1>
        <Text color="fg.muted">
          You have landed on a protected page <Link href="/login">Please signIn to access that</Link>
        </Text>
    </>
  )
}