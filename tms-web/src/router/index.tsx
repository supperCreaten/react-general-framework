import AuthRouteGuard from "./AuthRouteGuard";
import { GenerateRoute } from "./baseRoutes";
import RouteNProgress from "./RouteNProgress";

export default function Router() {
  return (
    <>
      <RouteNProgress />
      <AuthRouteGuard>
        <GenerateRoute />
      </AuthRouteGuard>
    </>
  );
}
