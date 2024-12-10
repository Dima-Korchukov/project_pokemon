import { Routes, Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Suspense, lazy } from "react";
import Login from "./pages/login/login";
import Loader from "./components/generall/loader";

const BattleScreen = lazy(() => import("./pages/battleScreen/BattleScreen"));
const PokemonList = lazy(() => import("./pages/pokemonList/PokemonList"));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/pokemon-list"
          element={
            <PrivateRoute>
              <PokemonList />
            </PrivateRoute>
          }
        />
        <Route
          path="/battle/:id"
          element={
            <Suspense fallback={<Loader />}>
              <BattleScreen />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppRouter;
