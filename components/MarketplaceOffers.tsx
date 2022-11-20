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
    Center,
    Image,
} from "@mantine/core";
import { IconHome2, IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { filterList } from "../helpers/FilterList";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { Offer } from "../types/Offer";

type MarketplaceOffersProps = {};

const MarketplaceOffers: NextPage<MarketplaceOffersProps> = ({}) => {
    const { user } = useContext(AuthContext);

    const router = useRouter();

    const [offers, setOffers] = useState<Offer[]>([]);

    const getAllAvailableOffers = useCallback(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/offer/get-all?status=AVAILABLE`,
            )
            .then((res) => {
                setOffers(
                    res.data.filter((o: Offer) => {
                        return o?.ownership?.user?.id !== user?.sub;
                    }),
                );
            })
            .catch((e) => {
                console.log(e.response?.data?.message);
            });
    }, [user]);

    useEffect(() => {
        getAllAvailableOffers();
    }, [getAllAvailableOffers]);

    const handleOpenOfferDetail = (id: string) => {
        router.push(`marketplace/${id}`);
    };

    return (
        <>
            <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex gap-3 align-items-center">
                    <IconHome2 size={35} />
                    <Title order={2}>Marketplace</Title>
                </div>
                <div className="d-flex justify-content-between">
                    <Text size={20}>
                        Visualize diferentes ofertas de imóveis tokenizados
                        disponíveis para venda e adquira o seu em sua carteira
                        digital.
                    </Text>
                    <Button
                        variant="outline"
                        color={"blue"}
                        onClick={getAllAvailableOffers}
                    >
                        <IconRefresh />
                    </Button>
                </div>
            </div>
            {!!offers?.length ? (
                <Grid gutter={30}>
                    {offers.map((offer) => {
                        return (
                            <Grid.Col key={offer.id} md={6} lg={4} xl={3}>
                                <Card shadow="sm" p="lg" radius="lg" withBorder>
                                    <Card.Section className="mt-1 mb-5">
                                        <Center>
                                            <Image
                                                width={150}
                                                height={150}
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
                                    </Card.Section>

                                    <Text size={22} weight={500}>
                                        {
                                            offer?.ownership?.tokenizedAsset
                                                ?.address
                                        }
                                    </Text>

                                    <Badge
                                        color="green"
                                        variant="light"
                                        mt="md"
                                        sx={
                                            offer.isEffectiveTransfer
                                                ? { visibility: "visible" }
                                                : { visibility: "hidden" }
                                        }
                                    >
                                        Transferência de Posse
                                    </Badge>

                                    <Space h="xs" />

                                    <Group position="apart" my="xs">
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

                                    <Group position="apart" my="xs">
                                        <Text>Valor da Oferta</Text>
                                        <Text>
                                            {formatNumber.format(offer.amount)}
                                        </Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Porcentagem de Posse</Text>
                                        <Text>{offer.percentage * 100} %</Text>
                                    </Group>

                                    <Divider size="xs" />

                                    <Group position="apart" my="xs">
                                        <Text>Vendedor</Text>
                                        <Text>
                                            {offer?.ownership?.user?.username}
                                        </Text>
                                    </Group>
                                    <div className="d-flex mt-5">
                                        <Button
                                            className="text-center"
                                            variant="outline"
                                            color={"green"}
                                            onClick={() =>
                                                handleOpenOfferDetail(offer.id)
                                            }
                                        >
                                            Adquirir
                                        </Button>
                                    </div>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            ) : (
                <>
                    <Space h="xs" />
                    <Text className="mt-5 text-center" size={23}>
                        Ainda não existe nenhuma oferta disponível no
                        Marketplace.
                    </Text>
                </>
            )}
        </>
    );
};

export default MarketplaceOffers;
