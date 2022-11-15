import { Badge, Card, Divider, Group, Text } from "@mantine/core";
import { Ownership } from "../types/Ownership";

interface OwnershipCardProps {
    children?: React.ReactNode;
    ownership: Ownership;
}
export function OwnershipCard({ children, ownership }: OwnershipCardProps) {
    return (
        <Card
            key={ownership.id}
            shadow="sm"
            p="lg"
            radius="lg"
            withBorder
            style={{ width: "400px" }}
        >
            <Group position="apart" className="mb-4">
                <Text size={22} weight={500}>
                    {ownership.tokenizedAsset?.address}
                </Text>
                {ownership?.isEffectiveOwner && (
                    <Badge color="green" variant="light">
                        Dono
                    </Badge>
                )}
            </Group>

            <Group position="apart" my="xs">
                <Text>Área Útil</Text>
                <Text>
                    {ownership.tokenizedAsset?.usableArea} m<sup>2</sup>
                </Text>
            </Group>

            <Divider size="xs" />

            <Group position="apart" my="xs">
                <Text>Número do Registro</Text>
                <Text>{ownership.tokenizedAsset?.registration}</Text>
            </Group>

            <Divider size="xs" />

            <Group position="apart" my="xs">
                <Text>Porcentagem de Posse</Text>
                <Text>{ownership.percentageOwned * 100} %</Text>
            </Group>
            {children}
        </Card>
    );
}
