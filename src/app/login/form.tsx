"use client";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Logo } from '../../components/Logo'
import { PasswordField } from '../../components/PasswordField'
import { ChangeEvent, useState } from 'react';
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ email: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);

      console.log(res);
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

  };


  return(
    <Stack spacing="8">
    <Stack spacing="6">
      <Logo />
      <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
        <Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>
        <Text color="fg.muted">
          Don't have an account? <Link href="/register">Sign up</Link>
        </Text>
      </Stack>

      {error && (
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Error in Sign In</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      )}
    </Stack>
    <Box
      py={{ base: '0', sm: '8' }}
      px={{ base: '4', sm: '10' }}
      bg={{ base: 'transparent', sm: 'bg.surface' }}
      boxShadow={{ base: 'none', sm: 'md' }}
      borderRadius={{ base: 'none', sm: 'xl' }}
    >
      <Stack spacing="6">
      <form onSubmit={onSubmit}>
        <Stack spacing="5">
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input value={formValues.email}
          onChange={handleChange} id="email" type="email" name='email' />
          </FormControl>
          <PasswordField value={formValues.password}
          onChange={handleChange} name='password'/>
        </Stack>
        <HStack height={'10px'} justify="space-between">
        </HStack>
        <Stack spacing="6">
          <Button disabled={loading} type='submit'>Sign in</Button>
        </Stack>
        </form>
      </Stack>
    </Box>
  </Stack>
  )
};
