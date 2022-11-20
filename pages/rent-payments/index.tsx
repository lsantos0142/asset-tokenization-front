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
import { IconReceipt, IconRefresh } from "@tabler/icons";
import axios from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { OwnershipCard } from "../../components/OwnershipCard";
import { ReadRentPaymentsModal } from "../../components/ReadRentPaymentsModal";
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
    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [showReadModal, setShowReadModal] = useState<boolean>(false);

    const getAllOwnerships = useCallback(async () => {
        try {
            const { data } = await axios.get<Ownership[]>(
                `${process.env.NEXT_PUBLIC_BACK}/tokenized-asset/ownership/get-by-user/${user.sub}`,
            );

            setEffectiveOwnerships(data);
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
                getAllOwnerships={getAllOwnerships}
                setShowModal={setShowRegisterModal}
                showModal={showRegisterModal}
                selectedOwnership={selectedOwnership}
            />

            <ReadRentPaymentsModal
                setShowModal={setShowReadModal}
                showModal={showReadModal}
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
                <div className="d-flex gap-3 align-items-center">
                    <IconReceipt size={35} />
                    <Title order={2}>Pagamentos de aluguéis</Title>
                </div>
                <div className="d-flex justify-content-between">
                    <Text size={20}>
                        Visualize os pagamentos de aluguéis dos seus imóveis ou
                        registre novos pagamentos dos imóveis em que você é
                        proprietário efetivo.
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
                {effectiveOwnerships.map((ownership) => (
                    <OwnershipCard key={ownership.id} ownership={ownership}>
                        <div className="d-flex mt-4 justify-content-between">
                            <Button
                                className="text-center"
                                variant="outline"
                                color={"green"}
                                onClick={() => {
                                    setShowRegisterModal(true);
                                    setSelectedOwnership(ownership);
                                }}
                                disabled={!ownership.isEffectiveOwner}
                            >
                                Registrar
                            </Button>
                            <Button
                                className="text-center"
                                variant="outline"
                                color={"green"}
                                onClick={() => {
                                    setShowReadModal(true);
                                    setSelectedOwnership(ownership);
                                }}
                            >
                                Visualizar
                            </Button>
                        </div>
                    </OwnershipCard>
                ))}
            </div>
        </>
    );
};

export default RentPayments;
