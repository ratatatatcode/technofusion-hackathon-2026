import Image from "next/image"

type UserProps = {
    name: string,
    points: number,
    // profilePicture: string,
}

export default function LeaderboardUser({name, points} : UserProps) {
    return (
        <div className="flex w-full items-center justify-evenly">
            <Image
                src={"/logo/logo.png"}
                width={50}
                height={50}
                alt="SS"
                className="shrink-0"
            />

            <h3 className="flex-1 text-center">{name}</h3>
            <h3 className="shrink-0">{points}</h3>
        </div>
    )
}