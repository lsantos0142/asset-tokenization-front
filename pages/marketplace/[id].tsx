import {
    Anchor,
    Breadcrumbs,
    Card,
    Divider,
    Group,
    Space,
    Title,
    Text,
    Image,
    Center,
    Button,
    Stack,
    Grid,
    Badge,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { filterList } from "../../helpers/FilterList";
import formatCPF from "../../helpers/FormatCPF";
import { Offer } from "../../types/Offer";

const OfferDetails: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [offer, setOffer] = useState<Offer>();

    const getOfferById = useCallback(() => {
        axios
            .get(`${process.env.BACK}/tokenized-asset/offer/get-by-id/${id}`)
            .then((res) => {
                console.log(res.data);
                setOffer(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    }, [id]);

    useEffect(() => {
        getOfferById();
    }, [getOfferById]);

    const items = [
        { title: "Home", href: "/" },
        { title: "Marketplace", href: "/marketplace/" },
        { title: offer?.id, href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={2}>Oferta #{offer?.id}</Title>

            <Space h="xl" />

            <Card shadow="sm" p="xl" radius="lg" withBorder>
                <Grid gutter={50}>
                    <Grid.Col lg={5}>
                        <Stack>
                            <Center>
                                <Image
                                    height="40vh"
                                    width="40vh"
                                    alt="Casa"
                                    src="/house.png"
                                    withPlaceholder
                                    style={{
                                        filter: filterList[
                                            Math.floor(
                                                Math.random() *
                                                    filterList.length,
                                            )
                                        ],
                                    }}
                                />
                            </Center>
                            <Button color="green" variant="outline">
                                Comprar Agora
                            </Button>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col lg={7}>
                        <Stack>
                            <Group position="apart" mb="xs">
                                <Text size={25} weight={500}>
                                    {offer?.ownership?.tokenizedAsset?.address}
                                </Text>
                                {offer?.isEffectiveTransfer ? (
                                    <Badge color="green" variant="light">
                                        Transferência de Posse
                                    </Badge>
                                ) : null}
                            </Group>

                            <Space h="xs" />

                            <Title order={3}>Dados do Imóvel:</Title>

                            <Group position="apart">
                                <Text>Área Útil</Text>
                                <Text>
                                    {
                                        offer?.ownership?.tokenizedAsset
                                            ?.usableArea
                                    }{" "}
                                    m<sup>2</sup>
                                </Text>
                            </Group>

                            <Divider size="xs" />

                            <Group position="apart">
                                <Text>Número do Registro</Text>
                                <Text>
                                    {
                                        offer?.ownership?.tokenizedAsset
                                            ?.registration
                                    }
                                </Text>
                            </Group>

                            <Divider size="xs" />

                            <Link
                                href={`https://goerli.etherscan.io/address/${offer?.ownership?.tokenizedAsset?.contractAddress}`}
                            >
                                <Group
                                    position="apart"
                                    sx={{ cursor: "pointer" }}
                                >
                                    <Text>Endereço do Imóvel Tokenizado</Text>
                                    <Text>
                                        {
                                            offer?.ownership?.tokenizedAsset
                                                ?.contractAddress
                                        }
                                    </Text>
                                </Group>
                            </Link>

                            <Space h="xs" />

                            <Title order={3}>Dados do Vendedor:</Title>

                            <Group position="apart">
                                <Text>Nome</Text>
                                <Text>{offer?.ownership?.user?.name!}</Text>
                            </Group>

                            <Divider size="xs" />

                            <Group position="apart">
                                <Text>Usuário</Text>
                                <Text>{offer?.ownership?.user?.username!}</Text>
                            </Group>

                            <Divider size="xs" />

                            <Group position="apart">
                                <Text>CPF</Text>
                                <Text>
                                    {offer?.ownership?.user?.cpf
                                        ? formatCPF(
                                              offer?.ownership?.user?.cpf!,
                                          )
                                        : null}
                                </Text>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        </>
    );
};

export default OfferDetails;
