import type { Metadata } from "next"
import { Inter, Nunito_Sans } from "next/font/google"
import { SEO } from "@/config/config"
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Header from "@/components/AuthHeader/authHeader"
import Footer from "@/components/AuthFooter/authFooter"
import "modern-normalize"
import "../(main)/globals.css"
import "./authGlobals.css"

const inter = Inter({
	display: "swap",
	weight: ["400", "500", "600"],
	variable: "--font-inter",
	subsets: ["latin"],
})

const nunito_Sans = Nunito_Sans({
	display: "swap",
	weight: ["400"],
	variable: "--font-nunito-sans",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: SEO.Title,
	description: SEO.Description,
	keywords: SEO.Keywords,
	openGraph: {
		title: SEO.Title,
		description: SEO.Description,
		type: "website",
		siteName: SEO.SiteName,
		images: [
			{
				width: 1200,
				height: 630,
				url: SEO.Cover,
				alt: SEO.Title,
			},
		],
	},
	twitter: {
		title: SEO.Title,
		description: SEO.Description,
		card: "summary_large_image",
		creator: "FlowDevs",
		images: [
			{
				width: 1200,
				height: 630,
				url: SEO.Cover,
				alt: SEO.Title,
			},
		],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" />
			</head>
			<body className={`${inter.variable} ${nunito_Sans.variable}`}>
				<TanStackProvider>
					<Header/>
                    <main>
                        {children}
                    </main>
                    <Footer/>
					<ReactQueryDevtools />
				</TanStackProvider>
			</body>
		</html>
	)
}
