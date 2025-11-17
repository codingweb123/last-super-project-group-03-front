// components/GoodReviews/GoodReviews.tsx 

// Good luck.
// Jesus, forgive me for my sins.

// I forgive you
// Team Lead

"use client";

import { useState, useId } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import css from "./GoodReviews.module.css";
import MessageNoInfo from "../MessageNoInfo/MessageNoInfo";
import Modal from "../Modal/Modal";
import ReviewsList from "../ReviewsList/ReviewsList";
import { createFeedback } from "@/lib/api/clientApi";
import { FeedbackWithGoodIdObject } from "@/types/shop";

Yup.setLocale({
	string: {
		min: "Мінімум ${min} символ(а/ів).",
		max: "Максимум ${max} символ(а/ів).",
	},
	mixed: {
		required: "Це обов'язкове поле.",
		oneOf: "Виберіть одну із зірочок!"
	}
});

const validationSchema = Yup.object().shape({
	author: Yup.string().min(2).max(53).required(),
	description: Yup.string().max(500),
	rate: Yup.number().oneOf([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]).required()
});

type Rate = 0 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;

interface InitialValues extends Omit<FeedbackWithGoodIdObject, "_id" | "date" | "goodId" | "rate"> {
	rate: Rate
}

const initialValues: InitialValues = {
	author: "",
	description: "",
	rate: 0
};

interface Props {
	feedbacks: FeedbackWithGoodIdObject[],
	goodId: string
}

export default function GoodReviews({ feedbacks, goodId }: Props) {
	const formId: string = useId();
	const [isModal, setModal] = useState<boolean>(false);
	const [checkedStar, setCheckedStar] = useState<number>(0);

	const checkStars = (checkedStar: number, checkOn: number): string => {
		if (checkOn < checkedStar) return "-filled";
		else if (checkOn === checkedStar) return checkedStar % 2 === 1 ? "-filled" : "-half";
		return "";
	};

	const handleOpenModal = (): void => setModal(true);

	const handleCloseModal = (actions?: FormikHelpers<InitialValues>): void => {
		if (actions) actions.resetForm();
		setCheckedStar(0);
		setModal(false);
	};

	const handleSubmit = async (values: unknown, actions: FormikHelpers<InitialValues>): Promise<void> => {
		try {
			await createFeedback({
				...values as Omit<FeedbackWithGoodIdObject, "_id" | "date" | "goodId">,
				goodId: goodId
			});
			handleCloseModal(actions);
			toast.success("Відгук успішно залишено!")
		} catch {
			handleCloseModal(actions);
			toast.error("Щось пішло не так під час залишення відгука...");
		}
	};

	return (
		<>
			<div className={css.container}>
				<h2 className={css.h2}>Відгуки клієнтів</h2>
				<button className={css.openModalButton} type="button" onClick={handleOpenModal}>Залишити відгук</button>
			</div>
			{feedbacks.length
				?
				<>
					<ReviewsList feedbacks={feedbacks} leftBtnClass="goodFeedbackLeftBtn" rightBtnClass="goodFeedbackRightBtn" />
					<div className={css.sliderButtons}>
						<div className={`goodFeedbackLeftBtn ${css.goodFeedbackLeftBtn}`}>
							<svg width={24} height={24}>
								<use href="/icons.svg#i-arrow"></use>
							</svg>
						</div>
						<div className={`goodFeedbackRightBtn ${css.goodFeedbackRightBtn}`}>
							<svg width={24} height={24}>
								<use href="/icons.svg#i-arrow"></use>
							</svg>
						</div>
					</div>
				</>
				:
				<MessageNoInfo text="У цього товару ще немає відгуків" buttonText="Залишити відгук" onClick={handleOpenModal}/>}
			{isModal
				&&
				<Modal onClose={handleCloseModal} modalClass="feedbackModal">
					<svg className={css.cross} width={24} height={24} onClick={() => handleCloseModal()}>
						<use href="/icons.svg#i-cross"></use>
					</svg>
					<h3 className={css.h3}>Залишити відгук</h3>
					<Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
						<Form className={css.form}>
							<div className={css.fieldGroup}>
								<label htmlFor={`${formId}-author`}>Ваше імʼя</label>
								<Field id={`${formId}-author`} type="text" name="author" minLength="2" maxLength="53" placeholder="Ваше імʼя"/>
								<ErrorMessage className={css.error} name="author" component="p"/>
							</div>
							<div className={css.fieldGroup}>
								<label htmlFor={`${formId}-description`}>Відгук</label>
								<Field as="textarea" id={`${formId}-description`} name="description" maxLength="500" placeholder="Ваш відгук"/>
								<ErrorMessage className={css.error} name="description" component="p"/>
							</div>
							<div className={css.fieldGroup}>
								<ul className={css.ratingGroup}>
									{[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((star, i) => (
										<li key={star}>
											<Field id={`${formId}-rate${star}`} type="radio" name="rate" value={String(star)} onClick={() => setCheckedStar(i + 1)}/>
											<label htmlFor={`${formId}-rate${star}`}>
												<svg width={24} height={24}>
													<use href={`/icons.svg#i-star${checkStars(checkedStar, i + 1)}`}></use>
												</svg>
											</label>
										</li>))}
								</ul>
								<ErrorMessage className={css.error} name="rate" component="p"/>
							</div>
							<button className={css.submit} type="submit">Надіслати</button>
						</Form>
					</Formik>
				</Modal>}
		</>
	);
}