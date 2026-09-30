// src/router/routes.ts
import type { RouteObject } from "react-router";

import DefaultLayout from "@/layouts/DefaultLayout";
import Home from "@/pages/Home";

const routes: RouteObject[] = [
  {
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
];

export default routes;
