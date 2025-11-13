import c from "./authHeader.module.css"

import Link from "next/link"

export default function authHeader(){
    return(
        <header className={c.header_registration}>
            <div className="container">
                <Link href="/">
                    <svg width="84" height="36">
                        <use href="/icons.svg#i-logo"></use>    
                    </svg>  
                </Link>  
            </div>
        </header>
    )
}