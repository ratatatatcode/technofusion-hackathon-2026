import SignupForm from "@/components/auth/SignupForm"
import type { NextPage } from "next"

const SignupPage : NextPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignupForm />
        </div>
    )
}

export default SignupPage 