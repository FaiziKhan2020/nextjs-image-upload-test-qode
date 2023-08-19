'use client'
import { Container } from "@chakra-ui/react";
import { RegisterForm } from "./form";

export default function LoginPage() {
  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <RegisterForm/>
    </Container>
  );
}
