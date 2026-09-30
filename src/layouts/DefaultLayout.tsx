// src/layouts/DefaultLayout.tsx
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import classes from "./DefaultLayout.module.css";

const DefaultLayout = () => {
  return (
    <div className={classes.layout}>
      <Navbar />

      <div className={classes.content}>
        <header className={classes.header}>Header</header>

        <main className={classes.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
