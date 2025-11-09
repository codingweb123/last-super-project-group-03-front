"use client";

import css from "./ProfilePage.module.css";

import { useRouter } from "next/navigation";

import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo";

import UserInfoForm from "@/components/UserInfoForm/UserInfoForm";

import { OrdersList } from "./page";

interface ProfileClientProps {
    ordersList: OrdersList[]
}

export default function ProfileClient({ ordersList }: ProfileClientProps) {
    const router = useRouter();
    return (
        <div className="container">
            <h1 className={css.h1}>Кабінет</h1>
            <div className={css.cabinetContainer}>
                <div className={css.infoContainer}>
                    <h2 className={css.h2}>Особиста інформація</h2>
                    <UserInfoForm/>
                </div>
                <div className={css.ordersContainer}>
                    <h2 className={`${css.h2} ${css.ordersTitle}`}>Мої замовлення</h2>
                    {
                        ordersList.length
                            ?
                            <div className={css.orders}>
                                <ul>
                                    {ordersList.map(({date, orderNum}) => 
                                        <li className={css.order} key={orderNum}>
                                            <p className={css.date}>{date}</p>
                                            <p className={css.orderNum}>№{orderNum}</p>
                                        </li>
                                    )}
                                </ul>
                                <ul>
                                    {ordersList.map(({orderNum, sum}) =>
                                        <li className={css.order} key={orderNum}>
                                            <p>Сума:</p>
                                            <p className={css.sum}>{sum} грн</p>
                                        </li>
                                    )}
                                </ul>
                                <ul className={css.statusGroup}>
                                    {ordersList.map(({orderNum, status }) => {
                                        let ukrStatus: "У процесі" | "Комплектується" | "Виконано" | "Скасовано";
                                        switch (status) {
                                            case "processing":
                                                ukrStatus = "У процесі";
                                                break;
                                            case "packing":
                                                ukrStatus = "Комплектується";
                                                break;
                                            case "success":
                                                ukrStatus = "Виконано";
                                                break;
                                            default:
                                                ukrStatus = "Скасовано";
                                        }
                                            return  <li className={css.order} key={orderNum}>
                                                        <p>Статус:</p>
                                                        <p className={css.status}>{ukrStatus}</p>
                                                    </li>
                                    })}
                                </ul>
                            </div>
                            :
                            <MessageNoInfo text="У вас ще не було жодних замовлень! Мершій до покупок!" buttonText="До покупок" onClick={() => router.push("/goods")} />
                    }
                </div>
            </div>
            <button className={css.logout} type="button">Вийти з кабінету</button>
        </div>
    );
}
