import { AuthForm } from "./AuthForm";
import { Button } from "../ui/button";

export default function LoginForm() {
    return (
        <AuthForm title="Login">
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
        </AuthForm>
    )
}