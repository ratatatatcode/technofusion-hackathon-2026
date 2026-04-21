import LoginForm from "@/components/auth/LoginForm"
import type { NextPage } from "next"

const LoginPage : NextPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoginForm />
        </div>
    )
}

export default LoginPage