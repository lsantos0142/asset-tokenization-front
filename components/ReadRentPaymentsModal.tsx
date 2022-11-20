import {
    Button,
    Group,
    LoadingOverlay,
    Modal,
    NumberInput,
    Table,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { formatNumber } from "../helpers/FormatCurrencyBRL";
import { Ownership } from "../types/Ownership";
import { RentPayment } from "../types/RentPayment";

interface IRegisterRentPaymentModalProps {
    selectedOwnership?: Ownership;
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

export function ReadRentPaymentsModal({
    selectedOwnership,
    showModal,
    setShowModal,
}: IRegisterRentPaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);

    const getRentPayments = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await axios.get<RentPayment[]>(
                `${process.env.BACK}/tokenized-asset/rent-payment/get-by-ownership/${selectedOwnership?.id}`,
            );

            setRentPayments(data);
        } catch (e) {
            showNotification({
                title: "Erro!",
                message: "Não foi possível registrar pagamento de aluguel",
                color: "red",
                icon: <IconX />,
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [selectedOwnership]);

    useEffect(() => {
        if (!selectedOwnership?.id) return;
        getRentPayments();
    }, [getRentPayments, selectedOwnership]);

    return (
        <>
            <Modal
                size="auto"
                centered
                opened={showModal}
                onClose={() => setShowModal(false)}
                title={
                    <Title order={3}>
                        {`Pagamentos de aluguel do imóvel ${selectedOwnership?.tokenizedAsset?.registration}`}
                    </Title>
                }
            >
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <Table striped className="mt-4" horizontalSpacing="xl">
                    <thead>
                        <tr>
                            <th>Data do pagamento</th>
                            <th>% do total</th>
                            <th>Valor recebido</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentPayments.map((rp) => (
                            <tr key={rp.id}>
                                <td>{rp.paymentDate}</td>
                                <td>{rp.percentage * 100} %</td>
                                <td> {formatNumber.format(rp.amount)}</td>
                            </tr>
                        ))}
                        {!rentPayments?.length && (
                            <tr>
                                <td className="p-5" colSpan={3}>
                                    Ainda não há nenhum pagamento de aluguel
                                    registrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Modal>
        </>
    );
}
