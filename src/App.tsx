import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex-none">
        <Header />
      </header>
      <main className="flex-1 bg-[--bg-app]">
        <Outlet />
      </main>
      <footer className="flex-none">
        <Footer />
      </footer>
    </div>
  );
}

export default App;
