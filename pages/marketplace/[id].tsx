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
    MediaQuery,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { filterList } from "../../helpers/FilterList";
import formatCPF from "../../helpers/FormatCPF";
import { formatNumber } from "../../helpers/FormatCurrencyBRL";
import { Offer } from "../../types/Offer";

const OfferDetails: NextPage = () => {
    const { user } = useContext(AuthContext);

    const router = useRouter();
    const { id } = router.query;

    const [offer, setOffer] = useState<Offer>();

    const getOfferById = useCallback(() => {
        if (typeof id !== "undefined") {
            axios
                .get(
                    `${process.env.BACK}/tokenized-asset/offer/get-by-id/${id}`,
                )
                .then((res) => {
                    setOffer(res.data);
                })
                .catch((e) => {
                    console.log(e.response?.data?.message);
                });
        }
    }, [id]);

    useEffect(() => {
        getOfferById();
    }, [getOfferById]);

    const handleAcceptOffer = () => {
        showNotification({
            id: "accept_offer_" + offer?.id,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Aceitando Oferta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .put(`${process.env.BACK}/tokenized-asset/offer/accept`, {
                    userId: user.sub,
                    offerId: offer?.id,
                })
                .then((res) => {
                    updateNotification({
                        id: "accept_offer_" + offer?.id,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Oferta Aceita</Text>,
                        message: (
                            <Text size="xl">Oferta aceita com sucesso</Text>
                        ),
                    });
                })
                .catch((e) => {
                    console.log(e);
                    updateNotification({
                        id: "accept_offer_" + offer?.id,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: <Text size="xl">Erro no Aceite da Oferta</Text>,
                        message: (
                            <Text size="xl">{e.response?.data?.message}</Text>
                        ),
                    });
                });
        }, 2000);
    };

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
                    <Grid.Col lg={5} xl={4}>
                        <MediaQuery
                            query="(max-width: 1200px) and (min-width: 650px)"
                            styles={{
                                width: "50%",
                                marginInline: "auto",
                            }}
                        >
                            <Stack justify="center">
                                <Center>
                                    <Image
                                        height="100%"
                                        fit="contain"
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
                                <Button
                                    color="green"
                                    variant="outline"
                                    onClick={handleAcceptOffer}
                                >
                                    Aceitar Oferta
                                </Button>
                            </Stack>
                        </MediaQuery>
                    </Grid.Col>
                    <Grid.Col lg={7} xl={8}>
                        <Stack>
                            <Text size={25} weight={500}>
                                {offer?.ownership?.tokenizedAsset?.address}
                            </Text>

                            <Badge
                                color="green"
                                variant="light"
                                mt="md"
                                sx={
                                    offer?.isEffectiveTransfer
                                        ? {
                                              visibility: "visible",
                                              width: "fit-content",
                                          }
                                        : { visibility: "hidden" }
                                }
                            >
                                Transferência de Posse
                            </Badge>

                            <Space h="xs" />

                            <Title order={3}>Dados da Oferta:</Title>

                            <Group position="apart">
                                <Text>Porcentagem à Venda</Text>
                                <Text>{offer?.percentage! * 100} %</Text>
                            </Group>

                            <Divider size="xs" />

                            <Group position="apart">
                                <Text>Valor da Oferta</Text>
                                <Text>
                                    {formatNumber.format(offer?.amount!)}
                                </Text>
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
