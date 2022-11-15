import {
    Anchor,
    Badge,
    Breadcrumbs,
    Button,
    Card,
    Divider,
    Group,
    Text,
    Title,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { OwnershipCard } from "../../components/OwnershipCard";
import { RegisterRentPaymentModal } from "../../components/RegisterRentPaymentModal";
import AuthContext from "../../context/AuthContext";
import { Ownership } from "../../types/Ownership";

const RentPayments: NextPage = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Pagamentos de aluguéis", href: "#" },
    ];
    const { user } = useContext(AuthContext);
    const [effectiveOwnerships, setEffectiveOwnerships] = useState<Ownership[]>(
        [],
    );

    const [selectedOwnership, setSelectedOwnership] = useState<Ownership>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const getAllOwnerships = useCallback(async () => {
        try {
            const { data } = await axios.get<Ownership[]>(
                `${process.env.BACK}/tokenized-asset/ownership/get-by-user/${user.sub}`,
            );

            setEffectiveOwnerships(data.filter((o) => o.isEffectiveOwner));
        } catch (e) {
            console.error(e);
        }
    }, [user]);

    useEffect(() => {
        getAllOwnerships();
    }, [getAllOwnerships]);

    return (
        <>
            <RegisterRentPaymentModal
                setShowModal={setShowModal}
                showModal={showModal}
                selectedOwnership={selectedOwnership}
            />

            <Breadcrumbs>
                {items.map((item, index) => (
                    <Link href={item.href} key={index} passHref>
                        <Anchor component="a">{item.title}</Anchor>
                    </Link>
                ))}
            </Breadcrumbs>

            <Divider my="xl" />
            <div className="d-flex flex-column gap-3 mb-5">
                <Title order={2}>Pagamentos de aluguéis</Title>
                <Text size={20}>
                    Registre os pagamentos de aluguéis dos imóveis de que você é
                    proprietário.
                </Text>
            </div>

            <div className="d-flex flex-wrap gap-4">
                {effectiveOwnerships.map((ownership) => (
                    <OwnershipCard key={ownership.id} ownership={ownership}>
                        <div className="d-flex mt-4">
                            <Button
                                className="text-center"
                                variant="outline"
                                color={"green"}
                                onClick={() => {
                                    setShowModal(true);
                                    setSelectedOwnership(ownership);
                                }}
                            >
                                Registrar pagamento
                            </Button>
                        </div>
                    </OwnershipCard>
                ))}
            </div>
        </>
    );
};

export default RentPayments;
