import type { NextPage } from "next"
import { Button } from "@/components/ui/button"

const LoginPage : NextPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="flex flex-col w-1/4 h-auto gap-4">
                <h2 className="text-center">Login</h2>
                <div className="flex flex-col gap-1">
                    <label>Email</label>
                    <input type="text" className="border border-black p-1"/>
                </div>
                <div className="flex flex-col gap-1">
                    <label>Password</label>
                    <input type="password" className="border border-black p-1"/>
                </div>
                {/* THE COLORS ARE TEMPORARY PLEASE CHANGE THEM INTO WHAT THE COLOR PALLET ON THE THEMES */}
                <Button type="submit" variant="default" size="lg" className="bg-red-600 hover:bg-red-800 cursor-pointer text-white">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default LoginPage