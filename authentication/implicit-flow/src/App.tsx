import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { Callback } from "./Callback";
import { Logout } from "./Logout";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "logout",
    element: <Logout />,
  },
  // {
  //   path: "admin",
  //   element: (
  //     <PrivateRoute>
  //       <Admin />
  //     </PrivateRoute>
  //   ),
  // },
  {
    path: "callback",
    element: <Callback />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
