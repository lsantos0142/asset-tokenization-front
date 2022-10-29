import { Anchor, Breadcrumbs, Button, Divider, Group } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    const [walletAddress, setWalletAddress] = useState("");

    const requestAccount = async () => {
        if ((window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
                console.log(accounts[0]);
            } catch (error) {
                console.log("Error Connecting");
            }
        } else {
            console.log("No metamask");
        }
    };

    const items = [{ title: "Home", href: "#" }].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Breadcrumbs>{items}</Breadcrumbs>
            <Divider my="xl" />
            <Group>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque
                vel iusto nam deleniti. Dolores corporis dolorum, nihil, dolore
                minima in autem ad, possimus ipsam quod tenetur ab! Inventore
                suscipit accusantium quos culpa ad expedita in sint? Nostrum
                excepturi fuga porro earum quos delectus voluptatum, quidem
                dolores distinctio tempora eius, voluptas repudiandae et
                pariatur natus soluta quisquam reiciendis cumque illum, ullam
                suscipit. Perferendis sint veniam architecto aperiam quae minus
                nobis vero quas tempore incidunt consequuntur temporibus dicta
                officiis velit dolorum vitae saepe laboriosam error ipsam
                mollitia, accusamus sit! Voluptas eaque mollitia, delectus minus
                eos nostrum facere! Similique ducimus quidem debitis possimus.
                <Button onClick={requestAccount}>
                    {walletAddress !== ""
                        ? "Metamask Conectada"
                        : "Conectar Metamask Teste"}
                </Button>
            </Group>
        </>
    );
};

export default Home;
