import LeaderboardUser from "./leaderboardUser"
import Image from "next/image"

export default function LeaderboardComponent() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
            <div className="flex flex-row justify-evenly w-full">
                <h1 className="text-center">Leaderboard</h1>
                <Image 
                    src={'/logo/leaderboardIcon.png'}
                    width={60}
                    height={50}
                    alt="leaderboardIcon"
                />
            </div>
            <div className="flex w-full h-[70vh] flex-col items-center justify-start border-4 border-red-800 p-5 rounded-xl overflow-y-auto">
                {/* THESE ARE TEST DATA PLEASE CREATE A LOOP THAT FETCHES ALL DATA FROM DB */}
                <LeaderboardUser name="John Doe Macapagal" points={1202} />
                <LeaderboardUser name="John Endrick Babao" points={894} />
                <LeaderboardUser name="Carle Francis Medina" points={840} />
                <LeaderboardUser name="Vincent Maxmimus Capili" points={802} />
                <LeaderboardUser name="Angela Arroyo" points={786} />
                <LeaderboardUser name="Alexander Guille Penuliar" points={769} />
                <LeaderboardUser name="Shawn Mendez Capistrano" points={670} />
                <LeaderboardUser name="Jude Smith Santos" points={420} />
            </div>
        </div>
    )
}