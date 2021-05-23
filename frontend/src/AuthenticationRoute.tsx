import { ComponentType, useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import useToken from "./auth/Token/useToken";

export interface AuthenticationRouteProps {
    path: string;
    Component: ComponentType;
}

const AuthenticationRoute: React.JSXElementConstructor<AuthenticationRouteProps> = ({
    path, Component
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);

    const { token } = useToken();

    useEffect(() => {
        if (token === undefined) {
            console.log("Undefined " + path)
            // El caso de undefined es que no se sabe
            //setIsLoggedIn(false)
        } else if (token === null) {
            console.log("Null")
            setIsLoggedIn(false)
        } else {
            console.log("Con datos")
            setIsLoggedIn(true)
        }
        return () => { }
    }, [token])

    return (
        <Route
            path={path}
            render={() => {
                return isLoggedIn ? <Redirect to="/" /> : <Component />;
            }}
        ></Route>
    );
}

export default AuthenticationRoute;