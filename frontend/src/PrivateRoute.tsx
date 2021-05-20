import { ComponentType, useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Token from "./auth/Token/Token";
import useToken from "./auth/Token/useToken";

export interface PrivateRouteProps {
    path: string;
    Component: ComponentType;
}

const PrivateRoute: React.JSXElementConstructor<PrivateRouteProps> = ({
    path, Component
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
    const [isTokenLoad, setIsTokenLoad] = useState<Boolean>(false);

    const { token } = useToken();

    useEffect(() => {
        if (token === undefined) {
            console.log("Undefined " + path)
            // El caso de undefined es que no se sabe
            //setIsLoggedIn(false)
        } else if (token === null) {
            console.log("Null")
            setIsLoggedIn(false)
            setIsTokenLoad(true);
        } else {
            console.log("Con datos")
            setIsLoggedIn(true)
            setIsTokenLoad(true);
        }
        return () => { }
    }, [token])

    return (
        <Route
            path={path}
            render={() => {
                return isLoggedIn || !isTokenLoad ? <Component /> : <Redirect to="/login"></Redirect>;
            }}
        ></Route>
    );
}

export default PrivateRoute;