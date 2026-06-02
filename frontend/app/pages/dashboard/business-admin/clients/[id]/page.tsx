import ClientDetailPage from "@/components/business-admin/client/ClientDetailPage";

export default async function ClientDetailsRoute({
	params,
}: {
	params: { id: string } | Promise<{ id: string }>;
}) {
	const resolvedParams = await params;

	return <ClientDetailPage clientId={resolvedParams.id} />;
}
