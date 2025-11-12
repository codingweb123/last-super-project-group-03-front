import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";

import ProfileClient from "./ProfilePage.client";

//#region Imitation of DB.

interface Products {
    id: string,
    amount: number,
    size: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL",
    color: "white" | "black" | "grey" | "blue" | "green" | "red" | "pastel"
}

interface UserData {
    firstName: string,
    lastName: string,
    phone: string,
    city: string,
    postalOffice: number
}

export interface OrdersList {
    _id: string,
    products: Products[],
    sum: number,
    userId: string,
    date: string,
    orderNum: number,
    comment: string,
    status: "processing" | "packing" | "success" | "declined",
    userData: UserData
}

const ordersList: OrdersList[] = [
  {
    _id: "ord_001",
    products: [
      { id: "prd_101", amount: 1, size: "M", color: "black" },
      { id: "prd_205", amount: 2, size: "L", color: "blue" },
    ],
    sum: 3498,
    userId: "usr_001",
    date: "29.08.2025",
    orderNum: 1235960,
    comment: "Please pack items carefully.",
    status: "processing",
    userData: {
      firstName: "John",
      lastName: "Doe",
      phone: "+380501234567",
      city: "Kyiv",
      postalOffice: 17,
    },
  },
  {
    _id: "ord_005",
    products: [
      { id: "prd_622", amount: 2, size: "XXL", color: "white" },
      { id: "prd_209", amount: 1, size: "L", color: "blue" },
    ],
    sum: 4299,
    userId: "usr_001",
    date: "14.09.2025",
    orderNum: 1235964,
    comment: "No comment.",
    status: "packing",
    userData: {
      firstName: "John",
      lastName: "Doe",
      phone: "+380501234567",
      city: "Kyiv",
      postalOffice: 17,
    },
  },
];

//#endregion

export default async function ProfilePage() {
    const queryClient = new QueryClient();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProfileClient ordersList={ordersList}/>
        </HydrationBoundary>
    );
}
