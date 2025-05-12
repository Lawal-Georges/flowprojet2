import { SignUp } from '@clerk/nextjs'
import AuthWrapper from '../../components/AuthWrapper'; // Adjust the path as needed

export default function Page() {
  return (
    <AuthWrapper>
       <SignUp/>
        </AuthWrapper>
     
  )
}