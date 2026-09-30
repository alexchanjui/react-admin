// src/router/routes.ts
import type { RouteObject } from "react-router";

import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";
import Users from "../pages/Settings/Users";
import Roles from "../pages/Settings/Roles";

const routes: RouteObject[] = [
  {
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "settings/users",
        Component: Users
      },
      {
        path: "settings/roles",
        Component: Roles
      }
    ]
  }
];

export default routes;
