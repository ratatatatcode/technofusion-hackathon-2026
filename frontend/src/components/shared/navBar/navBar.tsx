import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="bg-background fixed top-0 z-50 flex h-15 w-full items-center justify-evenly">
      <div className="flex w-30 items-center justify-center">
        <Image
          src={'/logo/logo.png'}
          height={50}
          width={50}
          alt="Campus Quest Logo"
          className="translate-x-0.5 rotate-10"
        />
        <p className="text-primary text-md font-extrabold">CAMPUS QUEST</p>
      </div>
      <ul className="flex gap-8 font-semibold">
        <li>
          <Link href="/">HOME</Link>
        </li>
        <li>
          <Link href="/mission">MISSION</Link>
        </li>
        <li>
          <Link href="/leaderboard">LEADERBOARD</Link>
        </li>
      </ul>
      <div className="flex w-30 items-center justify-center">
        <div className="bg-primary h-7.5 w-7.5 rounded-full"></div>
      </div>
    </nav>
  );
}
