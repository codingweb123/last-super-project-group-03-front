"use client"

import css from "./MessageNoInfo.module.css"

interface Props {
	text: string
	buttonText: string
	onClick: () => void
}

export default function MessageNoInfo({ text, buttonText, onClick }: Props) {
	return (
		<div className={css.messageContainer}>
			<p>{text}</p>
			<button onClick={onClick}>{buttonText}</button>
		</div>
	)
}
