import { redirect } from 'next/navigation';

export default async function WebhookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = await params.then((params) => params.id);
  redirect(`/webhook/${id}/events`);
}
