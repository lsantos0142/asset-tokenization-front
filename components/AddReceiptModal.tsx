import { Button, Group, Modal, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { Offer } from "../types/Offer";

interface IAddReceiptModalProps {
    selectedOffer?: Offer;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    getUserOffers: () => void;
}

export function AddReceiptModal({
    selectedOffer,
    showModal,
    setShowModal,
    getUserOffers,
}: IAddReceiptModalProps) {
    const modalForm = useForm({
        initialValues: {
            receipt: selectedOffer?.receipt ?? "",
        },
        validate: {
            receipt: (value) => (!value ? "Campo Obrigatório" : null),
        },
    });

    useEffect(() => {
        if (!selectedOffer) return;
        modalForm.setFieldValue("receipt", selectedOffer.receipt ?? "");
    }, [selectedOffer]);

    const addReceipt = useCallback(
        async (values: typeof modalForm.values) => {
            showNotification({
                id: "register_rent_payment_" + values.receipt,
                disallowClose: true,
                autoClose: false,
                title: (
                    <Text size="xl">Adicionando comprovante de pagamento</Text>
                ),
                message: <Text size="xl">Favor esperar até a conclusão</Text>,
                loading: true,
            });

            await axios
                .post(
                    `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/offer/add-receipt`,
                    { ...values, offerId: selectedOffer?.id },
                )
                .then((res) => {
                    updateNotification({
                        id: "register_rent_payment_" + values.receipt,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconCheck size={16} />,
                        color: "green",
                        title: <Text size="xl">Sucesso!</Text>,
                        message: <Text size="xl">Comprovante adicionado.</Text>,
                    });
                    setShowModal(false);
                    modalForm.reset();
                    getUserOffers();
                })
                .catch((e) => {
                    updateNotification({
                        id: "register_rent_payment_" + values.receipt,
                        disallowClose: true,
                        autoClose: 5000,
                        icon: <IconX size={16} />,
                        color: "red",
                        title: (
                            <Text size="xl">
                                Erro no registro do comprovante.
                            </Text>
                        ),
                        message: (
                            <Text size="xl">{e.response?.data?.message}</Text>
                        ),
                    });
                    console.error(e);
                });
        },
        [modalForm, selectedOffer, setShowModal, getUserOffers],
    );

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => {
                    setShowModal(false);
                    modalForm.reset();
                }}
                title={
                    <Title order={3}>
                        {`Adicionar comprovante de pagamento à compra do imóvel ${selectedOffer?.ownership?.tokenizedAsset?.registration}`}
                    </Title>
                }
            >
                <form
                    className="mt-5"
                    onSubmit={modalForm.onSubmit((values) =>
                        addReceipt(values),
                    )}
                >
                    <div className="d-flex flex-column gap-5">
                        <TextInput
                            withAsterisk
                            label="Comprovante de pagamento"
                            {...modalForm.getInputProps("receipt")}
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
                                Adicionar
                            </Button>
                        </Group>
                    </div>
                </form>
            </Modal>
        </>
    );
}
