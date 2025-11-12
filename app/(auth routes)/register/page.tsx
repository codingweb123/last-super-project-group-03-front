"use client";

import css from "./RegisterPage.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  return (
    <div className="container">
      <nav>
        <ul>
          <li>
            <Link href="/login">Вхід</Link>
          </li>
          <li>
            <Link href="/register">Реєстрація</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
