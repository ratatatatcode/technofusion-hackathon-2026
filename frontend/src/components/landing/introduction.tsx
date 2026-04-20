import Image from "next/image";

export default function IntroductionComponent() {
  return (
    <div className="relative w-full md:w-[60%] h-auto flex flex-col items-center justify-center">
      <p className="text-lg font-semibold">INTRODUCING</p>
      <h1>Campus Quest</h1>
      <h2 className="text-2xl text-secondary">
        MISSION AND REAL LIFE APPLICATION
      </h2>
      <Image
        src={"/logo/logo.png"}
        height={100}
        width={100}
        alt="Campus Quest Logo"
        className="absolute right-48 bottom-16 jumping-logo"
      />
    </div>
  );
}
