import {
    Text,
    Badge,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Space,
    Title,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { Ownership } from "../types/Ownership";

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
                console.log(res.data);
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
                    Atualizar Imóveis
                </Button>
            </Group>

            <Space h="xl" />

            <Grid gutter={30}>
                {ownerships.map((ownership) => {
                    return (
                        <Grid.Col key={ownership.id} md={6} lg={4} xl={3}>
                            <Card shadow="sm" p="lg" radius="lg" withBorder>
                                <Group position="apart" mb="xs">
                                    <Text size={22} weight={500}>
                                        {ownership.tokenizedAsset.address}
                                    </Text>
                                    {ownership?.isEffectiveOwner ? (
                                        <Badge color="green" variant="light">
                                            Dono
                                        </Badge>
                                    ) : null}
                                </Group>

                                <Space h="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Área Útil</Text>
                                    <Text>
                                        {ownership.tokenizedAsset.usableArea} m
                                        <sup>2</sup>
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Número do Registro</Text>
                                    <Text>
                                        {ownership.tokenizedAsset.registration}
                                    </Text>
                                </Group>

                                <Divider size="xs" />

                                <Group position="apart" my="xs">
                                    <Text>Porcentagem de Posse</Text>
                                    <Text>
                                        {ownership.percentageOwned * 100} %
                                    </Text>
                                </Group>
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </>
    );
};

export default OwnershipsByUser;
