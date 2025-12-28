'use client';

import { redirect,useParams } from 'next/navigation';

export default function DistrictPage() {
  const params = useParams();
  const division = params.division as string;

  // Redirect to division page
  redirect(`/${division}`);
}
