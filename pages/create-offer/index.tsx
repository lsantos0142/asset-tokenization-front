import {
    Anchor,
    Breadcrumbs,
    Button,
    Card,
    Checkbox,
    Divider,
    Group,
    Modal,
    NumberInput,
    Space,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCash, IconCheck, IconRefresh, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { OwnershipCard } from "../../components/OwnershipCard";
import AuthContext from "../../context/AuthContext";
import { Ownership } from "../../types/Ownership";

const CreateOffer: NextPage = () => {
    const { user } = useContext(AuthContext);

    const [ownerships, setOwnerships] = useState<Ownership[]>([]);
    const [selectedOwnershipId, setSelectedOwnershipId] = useState<string>("");
    const [openedModal, setOpenedModal] = useState<boolean>(false);

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

    const createOfferForm = useForm({
        initialValues: {
            percentage: 0.0,
            amount: 0,
            isEffectiveTransfer: false,
            ownershipId: "",
        },

        validate: {
            percentage: (value) =>
                !value
                    ? "Campo Obrigatório"
                    : value > selectedOwnership?.percentageOwned! * 100
                    ? "Porcentagem maior do que a que possui"
                    : null,
            amount: (value) => (!value ? "Campo Obrigatório" : null),
        },
    });

    const handleCreateOffer = (values: typeof createOfferForm.values) => {
        values.ownershipId = selectedOwnershipId;
        values.percentage = values.percentage / 100;
        setOpenedModal(false);
        createOfferForm.reset();

        showNotification({
            id: "create_offer_" + values.ownershipId + "_" + values.amount,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Criando Proposta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .post(
                    `${process.env.BACK}/tokenized-asset/offer/create`,
                    values,
                )
                .then((res) => {
                    updateNotification({
                        id:
                            "create_offer_" +
                            values.ownershipId +
                            "_" +
                            values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Oferta Criada</Text>,
                        message: (
                            <Text size="xl">Oferta criada com sucesso</Text>
                        ),
                    });
                })
                .catch((e) => {
                    console.log(e);
                    updateNotification({
                        id:
                            "create_offer_" +
                            values.ownershipId +
                            "_" +
                            values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: <Text size="xl">Erro na Criação da Oferta</Text>,
                        message: (
                            <Text size="xl">{e.response?.data?.message}</Text>
                        ),
                    });
                });
        }, 1000);
    };

    const items = [
        { title: "Home", href: "/" },
        { title: "Criar Oferta", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    const selectedOwnership = ownerships.find(
        (o) => o?.id === selectedOwnershipId,
    );

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={openedModal}
                onClose={() => setOpenedModal(false)}
                title={
                    <Title order={3}>
                        Criar oferta do imóvel{" "}
                        {selectedOwnership?.tokenizedAsset?.registration}
                    </Title>
                }
            >
                <form
                    onSubmit={createOfferForm.onSubmit((values) =>
                        handleCreateOffer(values),
                    )}
                >
                    <Stack spacing="md">
                        <NumberInput
                            min={0.1}
                            max={selectedOwnership?.percentageOwned! * 100}
                            step={1}
                            precision={1}
                            withAsterisk
                            label="Porcentagem Ofertada (%)"
                            placeholder="Ex: 27"
                            {...createOfferForm.getInputProps("percentage")}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                        />

                        <NumberInput
                            min={0.1}
                            hideControls
                            precision={2}
                            parser={(value: string) =>
                                value.replace(/R\$\s?|(,*)|(\.*)/g, "")
                            }
                            formatter={(value: string) =>
                                !Number.isNaN(parseFloat(value))
                                    ? `R$ ${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ",",
                                      )
                                    : "R$ "
                            }
                            withAsterisk
                            label="Valor da Oferta (R$)"
                            placeholder="Ex: R$ 100,000.00"
                            {...createOfferForm.getInputProps("amount")}
                        />

                        <Checkbox
                            ml="auto"
                            labelPosition="left"
                            label="Deseja Transferir a Posse do Imóvel?"
                            color="green"
                            size="md"
                            {...createOfferForm.getInputProps(
                                "isEffectiveTransfer",
                            )}
                        />
                    </Stack>

                    <Space h="xl" />

                    <Group position="apart">
                        <Button
                            variant="outline"
                            color="gray"
                            onClick={() => setOpenedModal(false)}
                        >
                            Cancelar
                        </Button>

                        <Button variant="outline" color="green" type="submit">
                            Criar Oferta
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex gap-3 align-items-center">
                    <IconCash size={35} />
                    <Title order={2}>Criar oferta</Title>
                </div>
                <div className="d-flex justify-content-between">
                    <Text size={20}>
                        Selecione o imóvel que deseja ofertar no Markeplace.
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
            <div className="d-flex flex-wrap gap-4">
                {ownerships.map((ownership) => {
                    return (
                        <OwnershipCard key={ownership.id} ownership={ownership}>
                            <div className="d-flex mt-4">
                                <Button
                                    className="text-center"
                                    variant="outline"
                                    color={"green"}
                                    onClick={() => {
                                        setOpenedModal(true);
                                        createOfferForm.reset();
                                        setSelectedOwnershipId(ownership?.id);
                                    }}
                                >
                                    Criar oferta
                                </Button>
                            </div>
                        </OwnershipCard>
                    );
                })}
            </div>
        </>
    );
};

export default CreateOffer;
