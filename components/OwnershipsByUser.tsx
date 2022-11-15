import { Button, Group, Space, Text, Title } from "@mantine/core";
import { IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Ownership } from "../types/Ownership";
import { OwnershipCard } from "./OwnershipCard";

type OwnershipsByUserProps = {
    userId?: string;
};

const OwnershipsByUser: NextPage<OwnershipsByUserProps> = ({ userId }) => {
    const [ownerships, setOwnerships] = useState<Ownership[]>([]);

    const getAllOwnerships = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/ownership/get-by-user/${userId}`,
            )
            .then((res) => {
                setOwnerships(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    }, [userId]);

    useEffect(() => {
        getAllOwnerships();
    }, [getAllOwnerships]);

    return (
        <>
            <Group position="apart">
                <Title order={2}>Imóveis Tokenizados</Title>
                <Button
                    variant="outline"
                    color={"blue"}
                    onClick={getAllOwnerships}
                >
                    <IconRefresh />
                </Button>
            </Group>

            <Space h="xl" />
            {!ownerships?.length ? (
                <Text>Você ainda não possui imóveis tokenizados.</Text>
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
