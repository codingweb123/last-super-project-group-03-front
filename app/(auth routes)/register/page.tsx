"use client";

import css from "./RegisterPage.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";

import AuthNavigation from "@/components/AuthNavigation/authNavigation";

export default function RegisterPage() {

type OrderFormValues = {
  name:string;
  phone:string;
  password:string;
}

const initialValues: OrderFormValues = {
  name: "",
  phone: "",
  password: ""
}

  return (
    <div className="container">
      <section className={css.registration_section}>
        <AuthNavigation route="/register"/>
        <h1>Реєстрація</h1>
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Form>
            <label >
              Ім'я
              <Field type="text" name="username" placeholder="Ваше ім'я"></Field>
            </label>
          </Form>
        </Formik>
      </section>
    </div>
  );
}
