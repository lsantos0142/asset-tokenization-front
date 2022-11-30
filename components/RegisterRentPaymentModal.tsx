import { Button, Group, Modal, NumberInput, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback } from "react";
import { TokenizedAsset } from "../types/TokenizedAsset";

interface IRegisterRentPaymentModalProps {
    selectedAsset?: TokenizedAsset;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

export function RegisterRentPaymentModal({
    selectedAsset,
    showModal,
    setShowModal,
}: IRegisterRentPaymentModalProps) {
    const createOfferForm = useForm({
        initialValues: {
            amount: 0,
        },
        validate: {
            amount: (value) => (!value ? "Campo Obrigatório" : null),
        },
    });

    const createRentPayment = useCallback(
        async (values: typeof createOfferForm.values) => {
            const payload = {
                ...values,
                tokenizedAssetId: selectedAsset?.id,
                contractAddress: selectedAsset?.contractAddress,
            };

            showNotification({
                id: "register_rent_payment_" + values.amount,
                disallowClose: true,
                autoClose: false,
                title: <Text size="xl">Registrando Pagamento do Aluguel</Text>,
                message: <Text size="xl">Favor esperar até a conclusão</Text>,
                loading: true,
            });

            setShowModal(false);

            await axios
                .post(
                    `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/rent-payment/create`,
                    payload,
                )
                .then((res) => {
                    updateNotification({
                        id: "register_rent_payment_" + values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Sucesso!</Text>,
                        message: (
                            <Text size="xl">
                                Pagamento de aluguel registrado.
                            </Text>
                        ),
                    });
                    createOfferForm.reset();
                })
                .catch((e) => {
                    updateNotification({
                        id: "register_rent_payment_" + values.amount,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">
                                Erro no Registro de Pagamento de Aluguel
                            </Text>
                        ),
                        message: (
                            <Text size="xl">{e.response?.data?.message}</Text>
                        ),
                    });
                    console.error(e);
                });
        },
        [createOfferForm, selectedAsset, setShowModal],
    );

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => {
                    setShowModal(false);
                    createOfferForm.reset();
                }}
                title={
                    <Title order={3}>
                        {`Registrar pagamento de aluguel do imóvel ${selectedAsset?.registration}`}
                    </Title>
                }
            >
                <form
                    className="mt-5"
                    onSubmit={createOfferForm.onSubmit((values) =>
                        createRentPayment(values),
                    )}
                >
                    <div className="d-flex flex-column gap-5">
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
                            label="Valor pago (R$)"
                            placeholder="Ex: R$ 100,000.00"
                            {...createOfferForm.getInputProps("amount")}
                        />

                        <Group position="apart">
                            <Button
                                variant="outline"
                                color="gray"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="outline"
                                color="green"
                                type="submit"
                            >
                                Registrar
                            </Button>
                        </Group>
                    </div>
                </form>
            </Modal>
        </>
    );
}
