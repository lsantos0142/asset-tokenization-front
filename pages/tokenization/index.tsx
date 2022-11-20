import {
    Anchor,
    Breadcrumbs,
    Button,
    Card,
    Divider,
    Modal,
    NumberInput,
    Text,
    TextInput,
    Title,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
    IconCheck,
    IconCurrencyEthereum,
    IconInfoCircle,
    IconX,
} from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";

const Tokenization: NextPage = () => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState<boolean>(false);
    const router = useRouter();

    const createTokenizationProposalForm = useForm({
        initialValues: {
            effectiveOwner: user?.walletAddress,
            address: "",
            usableArea: undefined,
            registration: undefined,
            userId: "",
        },

        validate: {
            effectiveOwner: (value) => (!value ? "Campo Obrigatório" : null),
            address: (value) => (!value ? "Campo Obrigatório" : null),
            usableArea: (value) =>
                value && value > 0 ? null : "Campo Obrigatório",
            registration: (value) =>
                value && value > 0 ? null : "Campo Obrigatório",
        },
    });

    const handleCreateTokenizationProposal = (
        values: typeof createTokenizationProposalForm.values,
    ) => {
        values.userId = user.sub;
        createTokenizationProposalForm.reset();
        showNotification({
            id: "create_tokenization_proposal_" + values.registration,
            disallowClose: true,
            autoClose: false,
            title: <Text size="xl">Criando Proposta</Text>,
            message: <Text size="xl">Favor esperar até a conclusão</Text>,
            loading: true,
        });

        setTimeout(() => {
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/proposal/create`,
                    values,
                )
                .then((res) => {
                    updateNotification({
                        id:
                            "create_tokenization_proposal_" +
                            values.registration,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Proposta Criada</Text>,
                        message: (
                            <Text size="xl">Proposta criada com sucesso</Text>
                        ),
                    });

                    setShowModal(true);
                })
                .catch((e) => {
                    console.log(e);
                    updateNotification({
                        id:
                            "create_tokenization_proposal_" +
                            values.registration,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">Erro na Criação da Proposta</Text>
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
        { title: "Criar Proposta de Tokenização", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Modal
                centered
                size={540}
                opened={showModal}
                onClose={() => setShowModal(false)}
                title={
                    <Title size={23} order={3}>
                        Dados enviados com sucesso!
                    </Title>
                }
            >
                <Text size={22} className="my-5">
                    Os dados enviados serão validados pela plataforma e, caso
                    aceitos, você receberá o imóvel tokenizado associado à sua
                    carteira digital.
                </Text>
                <div className="text-center mt-1">
                    <Button
                        size="md"
                        onClick={() => router.push("/marketplace")}
                        color="dark"
                    >
                        Voltar
                    </Button>
                </div>
            </Modal>

            <Breadcrumbs>{items}</Breadcrumbs>

            <Divider my="xl" />

            <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex gap-3 align-items-center">
                    <IconCurrencyEthereum size={35} />
                    <Title order={2}>Tokenize o seu imóvel</Title>
                </div>
                <Text size={20}>
                    Insira os dados do seu imóvel para análise da plataforma.
                    Caso os dados sejam aprovados, você receberá em sua carteira
                    digital o imóvel tokenizado.
                </Text>
            </div>

            <Card withBorder className="p-4">
                <form
                    onSubmit={createTokenizationProposalForm.onSubmit(
                        (values) => handleCreateTokenizationProposal(values),
                    )}
                    className="d-flex flex-column gap-4"
                >
                    <div className="d-flex flex-wrap gap-4">
                        <TextInput
                            className="flex-grow-1"
                            withAsterisk
                            label="Endereço do Imóvel"
                            placeholder="Ex: Av. Prof. Luciano Gualberto, 380"
                            {...createTokenizationProposalForm.getInputProps(
                                "address",
                            )}
                        />
                        <NumberInput
                            className="flex-grow-1"
                            min={1}
                            withAsterisk
                            label={`Área Útil do Imóvel (m\xB2)`}
                            placeholder="Ex: 100"
                            {...createTokenizationProposalForm.getInputProps(
                                "usableArea",
                            )}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                        />
                    </div>

                    <div className="d-flex flex-wrap gap-4">
                        <NumberInput
                            className="flex-grow-1"
                            min={1}
                            withAsterisk
                            label="Número do Registro em Cartório"
                            placeholder="Ex: 27"
                            {...createTokenizationProposalForm.getInputProps(
                                "registration",
                            )}
                            stepHoldDelay={500}
                            stepHoldInterval={100}
                        />
                        <TextInput
                            className="flex-grow-1"
                            disabled
                            withAsterisk
                            label="Endereço da Carteira do Dono Efetivo"
                            {...createTokenizationProposalForm.getInputProps(
                                "effectiveOwner",
                            )}
                        />
                    </div>
                    <div className="d-flex gap-2 align-items-center mt-3">
                        <Button
                            variant="outline"
                            type="submit"
                            style={{ width: "fit-content" }}
                            disabled={!user?.walletAddress}
                        >
                            Enviar dados do imóvel
                        </Button>
                        {!user?.walletAddress && (
                            <Tooltip
                                label="Para tokenizar um imóvel, cadastre sua carteira digital na tela de dados do perfil"
                                color="black"
                                withArrow
                            >
                                <div>
                                    <IconInfoCircle color={"gray"} />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </form>
            </Card>
        </>
    );
};

export default Tokenization;
