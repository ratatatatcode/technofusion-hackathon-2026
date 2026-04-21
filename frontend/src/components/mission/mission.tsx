import Image from 'next/image';
import { SampleProblem } from '@/data/sampleProblem';
import BadgeComponent from '../shared/badge';

export default function MissionComponent({ id }: { id: string }) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center rounded-md border-2 px-8 py-4 md:w-[50%]">
      <h1>CAMPUS QUEST</h1>
      <h2 className="text-secondary mb-2 text-2xl">{`#${id} ${SampleProblem.title}`}</h2>
      <Image
        src={'/assets/on-mission.png'}
        height={100}
        width={100}
        alt="Campus Quest Logo"
        className="absolute -top-10 left-2"
      />

      <p className="whitespace-pre-line">{SampleProblem.scenario}</p>
      <br />
      <p>{SampleProblem.problem}</p>
      <br />

      <p className="self-start text-xs">Deadline: {SampleProblem.deadline}</p>
      <br />
      <div className="flex gap-2 self-start">
        {SampleProblem.tags.map((tag, idx) => (
          <BadgeComponent key={idx} tag={tag} />
        ))}
      </div>
    </div>
  );
}
