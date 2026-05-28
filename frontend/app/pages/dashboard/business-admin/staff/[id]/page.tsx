import StaffDetailPage from "@/components/business-admin/staff/StaffDetailPage";

export default async function StaffDetailsRoute({
	params,
}: {
	params: { id: string } | Promise<{ id: string }>;
}) {
	const resolvedParams = await params;

	return <StaffDetailPage staffId={resolvedParams.id} />;
}
