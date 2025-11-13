import CreateOrderForm from "@/components/CreateOrderForm/CreateOrderForm"
<<<<<<< HEAD
=======
import GoodsOrderList from "@/components/GoodsOrderList/GoodsOrderList"
>>>>>>> 05f72e36483c4e4bec34920ff4bf3dda1585f792
import css from "./CreateOrder.module.css"

export default function CreateOrder() {
	return (
<<<<<<< HEAD
		<>
			<CreateOrderForm />
		</>
=======
		<section className={`section ${css.order}`}>
			<div className="container">
				<h1>Оформити замовлення</h1>
				<div className={css.blocks}>
					<div className={css.orders}>
						<h2>Товари</h2>
						<GoodsOrderList />
					</div>
					<div className={css.form}>
						<h2>Особиста інформація</h2>
						<CreateOrderForm />
					</div>
				</div>
			</div>
		</section>
>>>>>>> 05f72e36483c4e4bec34920ff4bf3dda1585f792
	)
}
