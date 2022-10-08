import axios from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useEffect, useState } from "react";

interface AuthContextProps {
    login: (user: any, authTokens: any) => void;
    logout: () => void;
    user: any;
}

const AuthContext = createContext({} as AuthContextProps);

export default AuthContext;

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>();
    const [authTokens, setAuthTokens] = useState<any>();

    useEffect(() => {
        if (localStorage.getItem("TOKENS")) {
            setUser(
                jwtDecode(
                    JSON.parse(localStorage.getItem("TOKENS") as string)
                        .accessToken,
                ),
            );
            setAuthTokens(JSON.parse(localStorage.getItem("TOKENS") as string));
        }
    }, []);

    const login = (user: any, authTokens: any) => {
        setUser(user);
        setAuthTokens(authTokens);
        localStorage.setItem("TOKENS", JSON.stringify(authTokens));
    };

    const logout = () => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens.accessToken}`,
        };

        axios
            .post(`${process.env.BACK}/auth/logout`, {}, { headers: headers })
            .then((res) => {
                setUser(null);
                setAuthTokens(null);
                localStorage.removeItem("TOKENS");
            })
            .catch((e) => {
                console.log(e);
                alert(e.response.data.message);
            });
    };

    let contextData = {
        user,
        login,
        logout,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};
