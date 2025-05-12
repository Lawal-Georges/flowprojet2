import AuthWrapper from '../../components/AuthWrapper';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
   return (
      <AuthWrapper>
         <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </AuthWrapper>
   );
}
