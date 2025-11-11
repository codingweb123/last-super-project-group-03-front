"use client";

import { useId } from 'react';

import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';

import * as Yup from "yup";

import css from "./UserInfoForm.module.css";

import { editMe } from '@/lib/api/clientApi';

import { OrderUserData } from '@/types/shop';

const initialValues: OrderUserData = {
	firstName: "",
	lastName: "",
	phone: "",
	city: "",
	postalOffice: 1
};

Yup.setLocale({
	string: {
		min: "Мінімум ${min} символ(а/ів).",
		max: "Максимум ${max} символ(а/ів)."
	},
	mixed: {
		required: "Це обов'язкове поле."
	}
});

const validationSchema = Yup.object().shape({
	firstName: Yup.string()
		.trim()
		.min(2)
		.max(32)
		.required(),
	lastName: Yup.string()
		.trim()
		.min(2)
		.max(32)
		.required(),
	phone: Yup.string()
		.trim()
		.max(19)
		.matches(/\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}/, "Номер телефону не валідний формату «+38 (0__) ___-__-__».")
		.required(),
	city: Yup.string()
		.trim()
		.required(),
	postalOffice: Yup.number()
		.min(1, "Мінімум одна не негативна цифра та не нуль.")
		.required()
});

export default function UserInfoForm() {
	const formId: string = useId();

	const handleInputNumber = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		const value: string = e.currentTarget.value;
		const digits: string = value.replace(/\D/g, "");
		const match: string[] | null = digits.match(/(\d{0,2}0)(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);

		let newValue: string = "+38 (0";

		if (!match) {
			e.currentTarget.value = newValue;
			return;
		}

		if (match[2]) newValue += `${match[2]}`;

		if (match[3]) newValue += `) ${match[3]}`;

		if (match[4]) newValue += `-${match[4]}`;

		if (match[5]) newValue += `-${match[5]}`;

		e.currentTarget.value = newValue;
	};

	const handleSubmit = async (values: OrderUserData, actions: FormikHelpers<OrderUserData>): Promise<void> => {
		// Parses phone.
		values.phone =
			values.phone
				.replace(" (", "")
				.replace(") ", "")
				.replace(/-/g, "");
		
		await editMe(values);
		actions.resetForm();
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			<Form className={css.form}>
				<div className={css.groupedGroups}>
					<div className={css.fieldGroup}>
						<label htmlFor={`${formId}-firstName`}>Імʼя*</label>
						<Field className={css.field} id={`${formId}-firstName`} type="text" name="firstName" placeholder="Ваше імʼя" minLength="2" maxLength="32"/>
						<ErrorMessage className={css.error} name="firstName" component="p"/>
					</div>
					<div className={css.fieldGroup}>
						<label htmlFor={`${formId}-lastName`}>Прізвище*</label>
						<Field className={css.field} id={`${formId}-lastName`} type="text" name="lastName" placeholder="Ваше прізвище" minLength="2" maxLength="32"/>
						<ErrorMessage className={css.error} name="lastName" component="p"/>
					</div>
				</div>

				<div className={css.fieldGroup}>
					<label htmlFor={`${formId}-phone`}>Номер телефону*</label>
					<Field className={css.field} id={`${formId}-phone`} type="tel" name="phone" placeholder="+38 (0__) ___-__-__" maxLength="19" pattern="\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}" onInput={handleInputNumber}/>
					<ErrorMessage className={css.error} name="phone" component="p"/>
				</div>

				<div className={css.groupedGroups}>
					<div className={css.fieldGroup}>
						<label htmlFor={`${formId}-city`}>Місто доставки*</label>
						<Field className={css.field} id={`${formId}-city`} type="text" name="city" placeholder="Ваше місто"/>
						<ErrorMessage className={css.error} name="city" component="p"/>
					</div>
					<div className={css.fieldGroup}>
						<label htmlFor={`${formId}-postalOffice`}>Номер відділення Нової Пошти*</label>
						<Field className={css.field} id={`${formId}-postalOffice`} type="number" name="postalOffice" placeholder="1" min="1"/>
						<ErrorMessage className={css.error} name="postalOffice" component="p"/>
					</div>
				</div>
				<button className={css.button} type="submit">Зберегти зміни</button>
			</Form>
		</Formik>
	);
}
