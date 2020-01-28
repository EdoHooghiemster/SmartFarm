import Dashboard from "views/Dashboard.jsx";
import Login from "views/Login.jsx";
import Register from "views/Register.jsx";
import UserProfile from "views/UserProfile.jsx";
import Feed from "views/Feed.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/feed",
    name: "Planten Feed",
    icon: "pe-7s-bell",
    component: Feed,
    layout: "/admin"
  },
  {
    hideInMenu: true,
    path: "/login",
    name: "Login",
    icon: "pe-7s-rocket",
    component: Login,
    layout: "/admin"
  },
  {
    hideInMenu: true,
    path: "/register",
    name: "Register",
    icon: "pe-7s-rocket",
    component: Register,
    layout: "/admin"
  }

];

export default dashboardRoutes;
