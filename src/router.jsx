import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "./App";
import AllArticles from "./Pages/AllArticles";
import Auth from "./Pages/Auth";
import ProtectedRoute from "./Components/ProtectedRoute";
import NotFound from "./Pages/NotFound";
import MyArticles from "./Pages/MyArticles";
import Profile from "./Pages/Profile";
import Article from "./Pages/Article";

const protectedRoutes = [
  {
    path: "/my-articles",
    element: <MyArticles />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<AllArticles />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/article/:id" element={<Article />} />
        {protectedRoutes.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          );
        })}
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);
export default router;
