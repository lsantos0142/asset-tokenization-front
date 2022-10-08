import axios from "axios";
import jwtDecode from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({} as any);

export default AuthContext;

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>();
    const [authTokens, setAuthTokens] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

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

    useEffect(() => {
        if (loading) {
            refresh();
        }
        const fiveMinutes = 1000 * 60 * 5;
        let interval = setInterval(() => {
            if (authTokens) {
                refresh();
            }
        }, fiveMinutes);
        return () => clearInterval(interval);
    }, [authTokens, loading]);

    const login = (user: any, authTokens: any) => {
        setUser(user);
        setAuthTokens(authTokens);
        localStorage.setItem("TOKENS", JSON.stringify(authTokens));
    };

    const logout = () => {
        if (authTokens?.refreshToken) {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens?.accessToken}`,
            };

            axios
                .post(
                    `${process.env.BACK}/auth/logout`,
                    {},
                    { headers: headers },
                )
                .then((res) => {
                    setUser(null);
                    setAuthTokens(null);
                    localStorage.removeItem("TOKENS");
                })
                .catch((e) => {
                    setUser(null);
                    setAuthTokens(null);
                    localStorage.removeItem("TOKENS");
                });
        }
    };

    const refresh = () => {
        if (authTokens?.refreshToken) {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens?.refreshToken}`,
            };

            axios
                .post(
                    `${process.env.BACK}/auth/refresh`,
                    {},
                    { headers: headers },
                )
                .then((res) => {
                    if (res.status === 200) {
                        setUser(jwtDecode(res.data.accessToken));
                        setAuthTokens(res.data);
                        localStorage.setItem(
                            "TOKENS",
                            JSON.stringify(res.data),
                        );
                    }
                })
                .catch((e) => {
                    logout();
                });
        }

        if (loading) {
            setLoading(false);
        }
    };

    let contextData = {
        user,
        login,
        logout,
        refresh,
    };
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
