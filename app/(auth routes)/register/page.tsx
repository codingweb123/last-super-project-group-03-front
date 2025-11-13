"use client";

import css from "./RegisterPage.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import AuthNavigation from "@/components/AuthNavigation/authNavigation";

export default function RegisterPage() {
  return (
    <div className="container">
      <section className={css.registration_section}>
        <AuthNavigation route="/register"/>
      </section>
    </div>
  );
}
