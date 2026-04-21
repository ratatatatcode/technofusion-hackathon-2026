import { AuthForm } from "./AuthForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

export default function LoginForm() {
    return (
        <AuthForm title="Login">
            <form action="" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="text" className="border border-black p-1"/>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Password</Label>
                    <Input type="password" className="border border-black p-1"/>
                </div>
                {/* THE COLORS ARE TEMPORARY PLEASE CHANGE THEM INTO WHAT THE COLOR PALLET ON THE THEMES */}
                <Button type="submit" variant="default" size="lg" className="w-full bg-red-600 hover:bg-red-800 cursor-pointer text-white">
                    Login
                </Button>
                <Label className="flex flex-row justify-center">
                    {"Don't"} have an account?
                    <Link href="/signup" className="text-center text-green-500">Signup.</Link>
                </Label>
            </form>
        </AuthForm>
    )
}