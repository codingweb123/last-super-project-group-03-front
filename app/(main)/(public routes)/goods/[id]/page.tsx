import {
  QueryClient,
  HydrationBoundary,
  dehydrate
} from "@tanstack/react-query";

import GoodPageClient from "./GoodPage.client";

import { getSingleGood } from "@/lib/api/clientApi";

interface Props {
	params: Promise<{ id: string }>
}

export default async function GoodPage({ params }: Props) {
	const { id } = await params;

	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
        queryKey: ["good", id],
        queryFn: () => getSingleGood(id)
	});
	
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<GoodPageClient id={id}/>
		</HydrationBoundary>
	);
}
