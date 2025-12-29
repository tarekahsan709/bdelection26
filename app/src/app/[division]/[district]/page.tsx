import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    division: string;
  }>;
}

export default async function DistrictPage({ params }: PageProps) {
  const { division } = await params;
  redirect(`/${division}`);
}
