import Logo from './Logo';
import UserMenu from './UserMenu';
import Nav from './Nav';
import SearchBar from './SearchBar';

export default function Header() {
  return (
        <div className="w-full border-b">
            <div className="mx-auto max-w-7xl px-4 md:px-6 h-20 grid grid-cols-[auto_1fr_auto] items-center gap-4">
                <Logo className="block max-h-full h-16 w-auto shrink-0"/>
                <Nav className="justify-self-center" />
                <div className="flex items-center gap-3 justify-self-end">
                    <SearchBar className="hidden md:flex w-64 lg:w-80" />
                    <UserMenu />
                </div>
            </div>
        </div>
  )
}