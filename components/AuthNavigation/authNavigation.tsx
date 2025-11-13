import Link from "next/link"
import c from "./authNavigation.module.css"

type Props = {
    route: string
}

export default function AuthNavigation({route}: Props) {
    return(
        <nav className={c.navigation_list}>
            <ul className={c.list_links_authorisation}>
                <li>
                    <Link href="/register" className={`${c.link_authorisation} ${route == '/register' && c.active_link}`}>Реєстрація</Link>
                </li>
                <li>
                    <Link href="/login" className={`${c.link_authorisation} ${route == '/login' && c.active_link}`}>Вхід</Link>
                </li>
            </ul>
        </nav>
    )
}