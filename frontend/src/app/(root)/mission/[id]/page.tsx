import MissionComponent from '@/components/mission/mission';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Mission({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="mt-30 flex items-center justify-center">
      <MissionComponent id={id} />
    </div>
  );
}
