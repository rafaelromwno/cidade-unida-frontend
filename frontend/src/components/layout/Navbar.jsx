import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "/logotipo-sem-borda.svg";
import useAuthentication from "@/hooks/UseAuthentication";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuthentication();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao sair. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Evita rolagem do fundo com menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="bg-azul text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img className="h-14" src={Logo} alt="Logo" />
        </Link>

        {/* Menu Responsivo */}
        {isMobile ? (
          <>
            {/* Botão menu mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none z-50"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Menu mobile animado */}
            <div
              className={`fixed top-20 left-0 w-full bg-azul z-40 transition-transform duration-300 ease-in-out transform ${
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
            >
              <div className="flex flex-col px-6 py-4 space-y-4">
                <MobileMenu
                  onClickItem={() => setIsOpen(false)}
                  user={user}
                  onLogout={handleLogout}
                  isLoggingOut={isLoggingOut}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <DesktopMenu
              user={user}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
