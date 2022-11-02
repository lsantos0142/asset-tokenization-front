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
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { filterList } from "../helpers/FilterList";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { Offer } from "../types/Offer";

type MarketplaceOffersProps = {};

const MarketplaceOffers: NextPage<MarketplaceOffersProps> = ({}) => {
    const router = useRouter();

    const [offers, setOffers] = useState<Offer[]>([]);

    const getAllAvailableOffers = () => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/offer/get-all?status=AVAILABLE`,
            )
            .then((res) => {
                console.log(res.data);
                setOffers(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    };

    useEffect(() => {
        getAllAvailableOffers();
    }, []);

    const handleOpenOfferDetail = (id: string) => {
        router.push(`marketplace/${id}`);
    };

    return (
        <>
            <Group position="apart">
                <Title order={2}>Marketplace</Title>
                <Button
                    variant="outline"
                    color={"blue"}
                    onClick={getAllAvailableOffers}
                >
                    Atualizar Ofertas
                </Button>
            </Group>

            <Space h="xl" />

            <Grid gutter={30}>
                {offers.map((offer) => {
                    return (
                        <Grid.Col
                            key={offer.id}
                            md={6}
                            lg={4}
                            xl={3}
                            onClick={() => handleOpenOfferDetail(offer.id)}
                        >
                            <Card
                                shadow="sm"
                                p="lg"
                                radius="lg"
                                withBorder
                                sx={{ cursor: "pointer" }}
                            >
                                <Card.Section p="1em">
                                    <Center>
                                        <Image
                                            width={100}
                                            height={100}
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
                                <Group position="apart" mb="xs">
                                    <Text size={22} weight={500}>
                                        {
                                            offer?.ownership?.tokenizedAsset
                                                ?.address
                                        }
                                    </Text>
                                    {offer.isEffectiveTransfer ? (
                                        <Badge color="green" variant="light">
                                            Transferência de Posse
                                        </Badge>
                                    ) : null}
                                </Group>

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
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </>
    );
};

export default MarketplaceOffers;
