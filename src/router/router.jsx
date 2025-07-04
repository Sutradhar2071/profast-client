import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/register/Register";
import Coverage from "../pages/coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import AddParcelPage from "../pages/AddParcelPage/AddParcelPage";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/dashboard/MyParcels/MyParcels";
import Payment from "../pages/dashboard/Payment/Payment";
import PaymentHistory from "../pages/dashboard/PaymentHistory/PaymentHistory";
import TrackPackage from "../pages/dashboard/TrackPackage/TrackPackage";
import BeARider from "../pages/BeARider/BeARider";
import PendingRider from "../pages/dashboard/PendingRider/PendingRider";
import ActiveRider from "../pages/dashboard/ActiveRider/ActiveRider";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/coverage",
        Component: Coverage,
      },
      {
        path: "/rider",
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
      },
      {
        path: "/addParcel",
        element: (
          <PrivateRoute>
            <AddParcelPage></AddParcelPage>
          </PrivateRoute>
        ),
        loader: () => fetch("./warehouses.json"),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "payment/:parcelId",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackPackage,
      },
      {
        path: "pending-riders",
        Component: PendingRider,
      },
      {
        path: "active-riders",
        Component: ActiveRider,
      },
    ],
  },
]);
