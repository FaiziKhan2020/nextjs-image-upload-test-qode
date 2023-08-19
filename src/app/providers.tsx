"use client";

import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'
type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>
    <ChakraProvider>
    {children}
    </ChakraProvider>
    </SessionProvider>;
};
