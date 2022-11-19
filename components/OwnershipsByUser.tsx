import { Button, Group, Space, Text, Title } from "@mantine/core";
import { IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Ownership } from "../types/Ownership";
import { OwnershipCard } from "./OwnershipCard";

const OwnershipsByUser: NextPage = () => {
    const [ownerships, setOwnerships] = useState<Ownership[]>([]);
    const { user } = useContext(AuthContext);

    const getAllOwnerships = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/ownership/get-by-user/${user?.sub}`,
            )
            .then((res) => {
                setOwnerships(res.data);
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    }, [user]);

    useEffect(() => {
        getAllOwnerships();
    }, [getAllOwnerships]);

    return (
        <>
            <div className="d-flex flex-column gap-2 mt-4 mb-5">
                <Title order={3}>Imóveis Tokenizados</Title>
                <div className="d-flex gap-3 align-items-center justify-content-between">
                    <Text size={20}>
                        Visualize os imóveis tokenizados que você possui em sua
                        carteira digital.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getAllOwnerships}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>

            {!ownerships?.length ? (
                <Text size={20} className="my-3 text-center">
                    Você ainda não possui imóveis tokenizados.
                </Text>
            ) : (
                <div className="d-flex flex-wrap gap-4">
                    {ownerships.map((ownership) => {
                        return (
                            <OwnershipCard
                                key={ownership.id}
                                ownership={ownership}
                            />
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default OwnershipsByUser;
