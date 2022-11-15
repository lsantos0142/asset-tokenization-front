import {
    Anchor,
    Badge,
    Breadcrumbs,
    Card,
    Divider,
    Group,
    Text,
    Title,
    Button,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Ownership } from "../../types/Ownership";

const RentPayments: NextPage = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Pagamentos de aluguéis", href: "#" },
    ];
    const { user } = useContext(AuthContext);
    const [effectiveOwnerships, setEffectiveOwnerships] = useState<Ownership[]>(
        [],
    );

    const getAllOwnerships = useCallback(async () => {
        try {
            const { data } = await axios.get<Ownership[]>(
                `${process.env.BACK}/tokenized-asset/ownership/get-by-user/${user.sub}`,
            );

            setEffectiveOwnerships(data.filter((o) => o.isEffectiveOwner));
        } catch (e) {
            console.error(e);
        }
    }, [user]);

    useEffect(() => {
        getAllOwnerships();
    }, [getAllOwnerships]);

    return (
        <>
            <Breadcrumbs>
                {items.map((item, index) => (
                    <Link href={item.href} key={index} passHref>
                        <Anchor component="a">{item.title}</Anchor>
                    </Link>
                ))}
            </Breadcrumbs>

            <Divider my="xl" />
            <div className="d-flex flex-column gap-2 mb-5">
                <Title order={2}>Pagamentos de aluguéis</Title>
                <Text size={20}>
                    Registre os pagamentos de aluguéis dos imóveis de que você é
                    proprietário.
                </Text>
            </div>

            <div className="d-flex flex-wrap gap-4">
                {effectiveOwnerships.map((ownership) => (
                    <Card
                        key={ownership.id}
                        shadow="sm"
                        p="lg"
                        radius="lg"
                        withBorder
                        style={{ width: "400px" }}
                    >
                        <Group position="apart" className="mb-4">
                            <Text size={22} weight={500}>
                                {ownership.tokenizedAsset?.address}
                            </Text>
                            {ownership?.isEffectiveOwner && (
                                <Badge color="green" variant="light">
                                    Dono
                                </Badge>
                            )}
                        </Group>

                        <Group position="apart" my="xs">
                            <Text>Área Útil</Text>
                            <Text>
                                {ownership.tokenizedAsset?.usableArea} m
                                <sup>2</sup>
                            </Text>
                        </Group>

                        <Divider size="xs" />

                        <Group position="apart" my="xs">
                            <Text>Número do Registro</Text>
                            <Text>
                                {ownership.tokenizedAsset?.registration}
                            </Text>
                        </Group>

                        <Divider size="xs" />

                        <Group position="apart" my="xs">
                            <Text>Porcentagem de Posse</Text>
                            <Text>{ownership.percentageOwned * 100} %</Text>
                        </Group>
                        <div className="d-flex justify-content-center">
                            <Button
                                className="text-center mt-4"
                                variant="outline"
                                color={"blue"}
                                onClick={getAllOwnerships}
                            >
                                Registrar pagamento
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default RentPayments;
