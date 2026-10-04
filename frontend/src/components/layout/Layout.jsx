import { Link, NavLink, Outlet } from 'react-router-dom';

const navClass = ({ isActive }) =>
  `text-lg tracking-[0.04em] transition hover:text-paper ${isActive ? 'text-paper underline underline-offset-4' : 'text-paper/70'}`;

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <a href="#main" className="btn sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
      Skip to content
    </a>
    <header className="no-print">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-4 px-4 py-5">
        <nav className="flex items-center gap-5" aria-label="Main">
          <NavLink to="/" end className={navClass}>All characters</NavLink>
          <Link to="/characters/new" className="btn">New sheet</Link>
        </nav>
      </div>
    </header>

    <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10">
      <Outlet />
    </main>

    <footer className="no-print px-4 py-5 text-center text-xs tracking-wide text-paper/60">
      <p>
        Game terms from the{' '}
        <a className="underline hover:text-paper" href="https://dnd.wizards.com/resources/systems-reference-document" target="_blank" rel="noreferrer">
          SRD 5.1
        </a>{' '}
        (CC BY 4.0) by Wizards of the Coast. Dice icon from{' '}
        <a className="underline hover:text-paper" href="https://game-icons.net" target="_blank" rel="noreferrer">game-icons.net</a> (CC BY 3.0).
        Unofficial fan project.
      </p>
    </footer>
  </div>
);

export default Layout;
