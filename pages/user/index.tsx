import { Button } from "@mantine/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const User: NextPage = () => {
    const router = useRouter();

    const { user, logout } = useContext(AuthContext);

    return (
        <>
            <Button
                color={"red"}
                onClick={() => {
                    logout(), router.push("/login");
                }}
            >
                Logout
            </Button>
        </>
    );
};

export default User;
