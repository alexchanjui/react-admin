// src/layouts/DefaultLayout.tsx
import { Outlet } from "react-router";

const DefaultLayout = () => {
  return (
    <div>
      <header>Header</header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
