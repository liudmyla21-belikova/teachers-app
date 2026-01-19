import { Link } from "react-router-dom";
import css from "./Header.module.css";
import { useState } from "react";
import Modal from "../Modal/Modal";
import AuthForm from "../AuthForm/AuthForm";
import LoginForm from "../LoginForm/LoginForm";
import { useAuth } from "../../auth/useAuth";
import Loader from "../Loader/Loader";

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <header className={css.header}>
      <div className={css.headerContainer}>
        <nav className={css.nav}>
          <Link to="/" className={css.logo}>
            <svg width={28} height={28}>
              <use href="/sprite.svg#ukraine" />
            </svg>
            <span> LearnLingo</span>
          </Link>
          <div className={css.navBox}>
            <Link to="/">Home</Link>
            <Link to="/teachers">Teachers</Link>
            {isAuthenticated && <Link to="/favorites">Favorites</Link>}
          </div>
        </nav>
        <div className={css.auth}>
          {isAuthenticated ? (
            <button className={css.logout} onClick={logout}>
              Log out
            </button>
          ) : (
            <>
              <button
                className={css.login}
                onClick={() => setIsLoginOpen(!isLoginOpen)}
              >
                <svg width={20} height={20} className={css.icon}>
                  <use href="/sprite.svg#log-in-01" />
                </svg>
                <p>Log in</p>
              </button>
              <button
                className={css.reg}
                onClick={() => setIsAuthOpen(!isAuthOpen)}
              >
                Registration
              </button>
            </>
          )}
        </div>
      </div>
      {isAuthOpen && (
        <Modal
          onClose={() => setIsAuthOpen(false)}
          children={<AuthForm onClose={() => setIsAuthOpen(false)} />}
        />
      )}
      {isLoginOpen && (
        <Modal
          onClose={() => setIsLoginOpen(!isLoginOpen)}
          children={<LoginForm onClose={() => setIsLoginOpen(false)} />}
        />
      )}
    </header>
  );
}
