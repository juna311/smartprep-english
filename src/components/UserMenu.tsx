export default function UserMenu() {
    return (
        <nav className="flex items-center gap-4">
            <ul className="flex gap-4">
                <li>
                    <a href="/login">Login</a>
                </li>
                <li>
                    <a href="/signup">Signup</a>
                </li>
            </ul>
        </nav>
    )
}