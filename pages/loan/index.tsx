import {
    Select,
    Anchor,
    Text,
    Breadcrumbs,
    Divider,
    Space,
    Title,
    Group,
    Card,
    Grid,
    Badge,
    Button,
    Modal,
    Stack,
    NumberInput,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import "dayjs/locale/pt-br";
import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Ownership } from "../../types/Ownership";
import { User } from "../../types/User";
import { DatePicker } from "@mantine/dates";

type SelectData = {
    value: string;
    label: string;
};

const Loan: NextPage = () => {
    const { user } = useContext(AuthContext);

    const [ownerships, setOwnerships] = useState<Ownership[]>([]);
    const [allUsers, setAllUsers] = useState<SelectData[]>([]);
    const [selectedOwnershipId, setSelectedOwnershipId] = useState<string>("");
    const [openedModal, setOpenedModal] = useState<boolean>(false);

    const selectedOwnership = ownerships.find(
        (o) => o?.id === selectedOwnershipId,
    );

    const getAllOwnerships = useCallback(() => {
        axios
            .get(
                `${process.env.BACK}/tokenized-asset/ownership/get-by-user/${user?.sub}`,
            )
            .then((res) => {
                setOwnerships(res.data);
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    }, [user]);

    useEffect(() => {
        getAllOwnerships();
    }, [getAllOwnerships]);

    const getAllUsers = () => {
        axios
            .get(`${process.env.BACK}/users`)
            .then((res) => {
                setAllUsers(
                    res.data
                        .filter(
                            (u: User) => u.walletAddress && u.id !== user.sub,
                        )
                        .map((u: User) => {
                            return { value: u.id, label: u.username };
                        }),
                );
            })
            .catch((e) => {
                console.log(e.response.data.message);
            });
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const createCollateralForm = useForm({
        initialValues: {
            bankUserId: null,
            sellerUserId: user.sub,
            collateralShares: 0.0,
            expirationDate: new Date(),
            contractAddress:
                selectedOwnership?.tokenizedAsset?.contractAddress!,
        },

        validate: {
            bankUserId: (value) => (!value ? "Campo Obrigatório" : null),
            sellerUserId: (value) => (!value ? "Campo Obrigatório" : null),
            collateralShares: (value) => (!value ? "Campo Obrigatório" : null),
            expirationDate: (value) => (!value ? "Campo Obrigatório" : null),
            contractAddress: (value: any) =>
                !value ? "Campo Obrigatório" : null,
        },
    });

    useEffect(() => {
        createCollateralForm.setFieldValue(
            "contractAddress",
            selectedOwnership?.tokenizedAsset?.contractAddress!,
        );
    }, [selectedOwnershipId]);

    const handleCreateCollateral = (
        values: typeof createCollateralForm.values,
    ) => {
        let body = {
            contractAddress:
                selectedOwnership?.tokenizedAsset?.contractAddress!,
            collateralShares: values.collateralShares / 100,
            expirationDateISOString: values?.expirationDate.toISOString(),
            sellerUserId: user.sub,
            bankUserId: values.bankUserId,
        };

        setOpenedModal(false);
        createCollateralForm.reset();

        showNotification({
            id:
                "create_collateral_" +
                body.contractAddress +
                "_" +
                body.expirationDateISOString,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Cadastrando Empréstimo</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .post(
                    `${process.env.BACK}/tokenized-asset/collateral/create`,
                    body,
                )
                .then((res) => {
                    updateNotification({
                        id:
                            "create_collateral_" +
                            body.contractAddress +
                            "_" +
                            body.expirationDateISOString,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Empréstimo Criado</Text>,
                        message: (
                            <Text size="xl">Empréstimo criado com sucesso</Text>
                        ),
                    });
                })
                .catch((e) => {
                    console.log(e);
                    updateNotification({
                        id:
                            "create_collateral_" +
                            body.contractAddress +
                            "_" +
                            body.expirationDateISOString,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">Erro na Criação do Empréstimo</Text>
                        ),
                        message: (
                            <Text size="xl">{e.response.data.message}</Text>
                        ),
                    });
                });
        }, 2000);
    };

    const items = [
        { title: "Home", href: "/" },
        { title: "Empréstimo", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={openedModal}
                onClose={() => setOpenedModal(false)}
                title={
                    <Title order={3}>
                        Cadastrar Empréstimo do Imóvel{" "}
                        {selectedOwnership?.tokenizedAsset?.registration}
                    </Title>
                }
            >
                <form
                    onSubmit={createCollateralForm.onSubmit((values) =>
                        handleCreateCollateral(values),
                    )}
                >
                    <Stack spacing="md">
                        <TextInput
                            disabled
                            withAsterisk
                            label="Endereço do imóvel tokenizado"
                            placeholder="Ex: 0x7E2CdEcA4cC308B5253118d7dC99B124EB3a0556"
                            {...createCollateralForm.getInputProps(
                                "contractAddress",
                            )}
                        />

                        <DatePicker
                            minDate={new Date()}
                            locale="pt-br"
                            placeholder="Escolha uma data"
                            label="Data de expiração do empréstimo"
                            defaultValue={new Date()}
                            dropdownPosition="bottom-start"
                            {...createCollateralForm.getInputProps(
                                "expirationDate",
                            )}
                        />

                        <Select
                            label="Nome de usuário do banco"
                            placeholder="Escolha um banco"
                            data={allUsers}
                            searchable
                            clearable
                            maxDropdownHeight={400}
                            nothingFound="Nenhum banco encontrado"
                            {...createCollateralForm.getInputProps(
                                "bankUserId",
                            )}
                        />

                        <NumberInput
                            min={0.1}
                            max={selectedOwnership?.percentageOwned! * 100}
                            step={1}
                            precision={1}
                            withAsterisk
                            label="Porcentagem utilizada como garantia (%)"
                            placeholder="Ex: 27"
                            {...createCollateralForm.getInputProps(
                                "collateralShares",
                            )}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
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
                            Cadastrar Empréstimo
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <Title order={2}>Cadastrar Empréstimo</Title>

            <Space h="xl" />

            <Group position="apart">
                <Title order={3}>Selecione o Imóvel Tokenizado</Title>
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
                            <Card
                                shadow="sm"
                                p="lg"
                                radius="lg"
                                withBorder
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    setOpenedModal(true);
                                    createCollateralForm.reset();
                                    setSelectedOwnershipId(ownership?.id);
                                }}
                            >
                                <Text size={22} weight={500}>
                                    {ownership.tokenizedAsset?.address}
                                </Text>
                                <Badge
                                    color="green"
                                    variant="light"
                                    mt="md"
                                    sx={
                                        ownership?.isEffectiveOwner
                                            ? { visibility: "visible" }
                                            : { visibility: "hidden" }
                                    }
                                >
                                    Dono
                                </Badge>

                                <Space h="xs" />

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

export default Loan;
