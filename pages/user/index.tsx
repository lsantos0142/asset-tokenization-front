import { Button } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const User: NextPage = () => {
    const router = useRouter();

    const { user, logout, refresh } = useContext(AuthContext);

    return (
        <>
            <Button
                onClick={() => {
                    logout(), router.push("/login");
                }}
            >
                Logout
            </Button>

            <Button
                onClick={() => {
                    refresh();
                }}
            >
                Refresh
            </Button>
        </>
    );
};

export default User;
