interface NavProps {
    className?: string;
  }


export default function Nav({ className }: NavProps) {
    return (
        <nav className={`flex justify-center gap-4 ${className || ''}`}>
            <ul className="flex gap-4">
                <li>
                    <a href="/grammar">Grammar</a>
                </li>
                <li>
                    <a href="/vocab">Vocabulary</a>
                </li>
                <li>
                    <a href="/practice">Practice</a>
                </li>
            </ul>
        </nav>
    )
}