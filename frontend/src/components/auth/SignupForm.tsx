import { AuthForm } from "./AuthForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function SignupForm() {
    return (
        <AuthForm title="Signup">
            <form action="">
                <div className="flex flex-col gap-2">
                    <Label>First Name</Label>
                    <Input type="text" className="border border-black p-1"/>
                </div><div className="flex flex-col gap-2">
                    <Label>Last Name</Label>
                    <Input type="text" className="border border-black p-1"/>
                </div><div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="text" className="border border-black p-1"/>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Password</Label>
                    <Input type="password" className="border border-black p-1"/>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" className="border border-black p-1"/>
                </div>
                {/* THE COLORS ARE TEMPORARY PLEASE CHANGE THEM INTO WHAT THE COLOR PALLET ON THE THEMES */}
                <Button type="submit" variant="default" size="lg" className="w-full bg-green-600 hover:bg-green-800 cursor-pointer text-white">
                    Signup
                </Button>
            </form>
        </AuthForm>
    )
}