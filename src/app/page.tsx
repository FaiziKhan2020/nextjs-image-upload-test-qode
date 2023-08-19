import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  let session: Session | null | undefined = await getServerSession(authOptions);

  if (!session || !session.user) { redirect('/login') }else{redirect('/dashboard')}

  return (
          <p>
            Welcome to NextJS
          </p>
  );
}

async function getSession(){

}
