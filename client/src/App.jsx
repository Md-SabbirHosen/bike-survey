import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DownloadSurvey from "./pages/DownloadSurvey";
import RootLayout from "./pages/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/download-survey",
        element: <DownloadSurvey />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
