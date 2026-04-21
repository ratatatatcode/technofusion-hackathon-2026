import { ReactNode } from "react";

// ADD MORE PROPS IF NEEDED
type FormProps = {
    title: string,
    children: ReactNode,
};

export function AuthForm({ title, children}: FormProps) {
    return (
        <div className="flex flex-col w-1/4 h-auto gap-4">
            <h1 className="font-bold text-center">{title}</h1>
            <hr className="w-full border" />
            {children}
        </div>
    )
}