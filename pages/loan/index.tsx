import {
    Anchor,
    Breadcrumbs,
    Button,
    Divider,
    Group,
    Modal,
    NumberInput,
    Select,
    Space,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconBook, IconCheck, IconRefresh, IconX } from "@tabler/icons";
import axios from "axios";
import "dayjs/locale/pt-br";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { OwnershipCard } from "../../components/OwnershipCard";
import AuthContext from "../../context/AuthContext";
import { Ownership } from "../../types/Ownership";
import { User } from "../../types/User";

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
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const selectedOwnership = ownerships.find(
        (o) => o?.id === selectedOwnershipId,
    );

    const getAllOwnerships = useCallback(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/ownership/get-by-user/${user?.sub}`,
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

    const getAllUsers = () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_BACK}/users`)
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
                console.log(e.response?.data?.message);
            });
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const createCollateralForm = useForm({
        initialValues: {
            bankUserId: null,
            sellerUserId: user?.sub,
            collateralShares: 0.0,
            expirationDate: new Date(),
            contractAddress: "",
        },

        validate: {
            bankUserId: (value) => (!value ? "Campo Obrigatório" : null),
            sellerUserId: (value) => (!value ? "Campo Obrigatório" : null),
            collateralShares: (value) =>
                !value
                    ? "Campo Obrigatório"
                    : value > selectedOwnership?.availablePercentage! * 100
                    ? "Porcentagem maior do que a disponível para operações"
                    : null,
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
    }, [selectedOwnershipId, openedModal]);

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
                body.expirationDateISOString +
                body.collateralShares,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Cadastrando Empréstimo</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/collateral/create`,
                    body,
                )
                .then((res) => {
                    setShowSuccessModal(true);
                    updateNotification({
                        id:
                            "create_collateral_" +
                            body.contractAddress +
                            "_" +
                            body.expirationDateISOString +
                            body.collateralShares,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Empréstimo Criado</Text>,
                        message: (
                            <Text size="xl">Empréstimo criado com sucesso</Text>
                        ),
                    });
                    getAllOwnerships();
                })
                .catch((e) => {
                    console.log(e);
                    updateNotification({
                        id:
                            "create_collateral_" +
                            body.contractAddress +
                            "_" +
                            body.expirationDateISOString +
                            body.collateralShares,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">Erro na Criação do Empréstimo</Text>
                        ),
                        message: (
                            <Text size="xl">{e.response?.data?.message}</Text>
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
                onClose={() => {
                    setOpenedModal(false);
                    createCollateralForm.reset();
                }}
                title={
                    <Title order={3}>
                        Cadastrar imóvel{" "}
                        {selectedOwnership?.tokenizedAsset?.registration} como
                        garantia de empréstimo
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
                            firstDayOfWeek="sunday"
                            withAsterisk
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
                            withAsterisk
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
                            Cadastrar Garantia
                        </Button>
                    </Group>
                </form>
            </Modal>

            <Modal
                centered
                size={540}
                opened={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={
                    <Title size={23} order={3}>
                        Dados enviados com sucesso!
                    </Title>
                }
            >
                <Text size={22} className="my-5">
                    A garantia será criada e associada a sua carteira digital
                    assim que os dados forem validados pelo administrador.
                </Text>
                <div className="text-center mt-1">
                    <Button
                        size="md"
                        onClick={() => setShowSuccessModal(false)}
                        color="dark"
                    >
                        Confirmar
                    </Button>
                </div>
            </Modal>

            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex gap-3 align-items-center">
                    <IconBook size={35} />
                    <Title order={2}>Criar garantia de empréstimo</Title>
                </div>
                <div className="d-flex justify-content-between">
                    <Text size={20}>
                        Selecione o imóvel que deseja associar a uma garantia de
                        empréstimo.
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

            {!!ownerships?.length ? (
                <div className="d-flex flex-wrap gap-4">
                    {ownerships.map((ownership) => {
                        return (
                            <OwnershipCard
                                key={ownership.id}
                                ownership={ownership}
                            >
                                <div className="d-flex mt-4">
                                    <Button
                                        className="text-center"
                                        variant="outline"
                                        color={"green"}
                                        onClick={() => {
                                            setOpenedModal(true);
                                            setSelectedOwnershipId(
                                                ownership?.id,
                                            );
                                        }}
                                    >
                                        Cadastrar garantia
                                    </Button>
                                </div>
                            </OwnershipCard>
                        );
                    })}
                </div>
            ) : (
                <>
                    <Space h="xs" />
                    <Text className="mt-5 text-center" size={23}>
                        Você não possui nenhum imóvel para dar como garantia.
                    </Text>
                </>
            )}
        </>
    );
};

export default Loan;
