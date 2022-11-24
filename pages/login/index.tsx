import {
    Affix,
    Alert,
    Anchor,
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Group,
    PasswordInput,
    TextInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons";
import axios from "axios";
import jwtDecode from "jwt-decode";
import type { NextPage } from "next";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

const Login: NextPage = () => {
    const router = useRouter();

    const { login } = useContext(AuthContext);

    const [error, setError] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    const signupForm = useForm({
        initialValues: {
            name: "",
            username: "",
            password: "",
            cpf: "",
        },

        validate: {},
    });

    const loginForm = useForm({
        initialValues: {
            username: "",
            password: "",
        },

        validate: {},
    });

    const handleSignup = (values: typeof signupForm.values) => {
        axios
            .post(`${process.env.NEXT_PUBLIC_BACK}/auth/signup`, {
                name: values.name,
                username: values.username,
                password: values.password,
                cpf: values.cpf,
            })
            .then((res) => {
                if (res.status === 200) {
                    login(jwtDecode(res.data.accessToken), res.data);
                    router.push("/marketplace");
                }
            })
            .catch((e) => {
                if (e.response?.data?.statusCode == 400) {
                    if (e.response?.data?.message === "Unauthorized") {
                        setError("Digite um usuário e senha");
                    } else {
                        console.log(e.response?.data?.message);
                        setError(
                            Array.prototype.join.call(
                                e.response?.data?.message,
                                "\r\n",
                            ),
                        );
                    }
                    setShow(true);
                } else if (e.response.status == 409) {
                    setError(e.response?.data?.message);
                    setShow(true);
                } else {
                    alert(e.response?.data?.message);
                }
            });
    };

    const handleLogin = (values: typeof loginForm.values) => {
        axios
            .post(`${process.env.NEXT_PUBLIC_BACK}/auth/login`, {
                username: values.username,
                password: values.password,
            })
            .then((res) => {
                if (res.status === 200) {
                    login(jwtDecode(res.data.accessToken), res.data);
                    router.push("/marketplace");
                }
            })
            .catch((e) => {
                if (e.response?.data?.statusCode == 401) {
                    if (e.response?.data?.message === "Unauthorized") {
                        setError("Digite um usuário e senha");
                    } else {
                        setError(e.response?.data?.message);
                    }
                    setShow(true);
                } else {
                    alert(e.response?.data?.message);
                }
            });
    };

    const items = [
        { title: "Home", href: "/" },
        { title: "Registar ou Fazer Login", href: "#" },
    ].map((item, index) => (
        <Link href={item.href} key={index} passHref>
            <Anchor component="a">{item.title}</Anchor>
        </Link>
    ));

    return (
        <>
            <Title order={2} align="center" mt={"1rem"}>
                Fazer Login
            </Title>
            <Box sx={{ maxWidth: 400 }} mx="auto">
                <form
                    onSubmit={loginForm.onSubmit((values) =>
                        handleLogin(values),
                    )}
                >
                    <TextInput
                        my={"lg"}
                        withAsterisk
                        label="Usuário"
                        placeholder="Digite seu usuário"
                        {...loginForm.getInputProps("username")}
                    />

                    <PasswordInput
                        my={"lg"}
                        withAsterisk
                        label="Senha"
                        placeholder="Digite sua senha"
                        {...loginForm.getInputProps("password")}
                    />

                    <Group position="right" my="xl">
                        <Button variant="outline" type="submit">
                            Fazer Login
                        </Button>
                    </Group>
                </form>
            </Box>
            <Divider my="xl" label="OU" labelPosition="center" />

            <Title order={2} align="center">
                Registrar
            </Title>
            <Box sx={{ maxWidth: 400 }} mx="auto">
                <form
                    onSubmit={signupForm.onSubmit((values) =>
                        handleSignup(values),
                    )}
                >
                    <TextInput
                        my={"lg"}
                        withAsterisk
                        label="Nome"
                        placeholder="Digite seu nome"
                        {...signupForm.getInputProps("name")}
                    />

                    <TextInput
                        my={"lg"}
                        withAsterisk
                        label="Usuário"
                        placeholder="Digite seu usuário"
                        {...signupForm.getInputProps("username")}
                    />

                    <TextInput
                        my={"lg"}
                        withAsterisk
                        label="CPF"
                        placeholder="Digite seu CPF"
                        {...signupForm.getInputProps("cpf")}
                    />

                    <PasswordInput
                        my={"lg"}
                        withAsterisk
                        label="Senha"
                        placeholder="Digite sua senha"
                        {...signupForm.getInputProps("password")}
                    />

                    <Group position="right" my="xl">
                        <Button variant="outline" type="submit">
                            Registrar
                        </Button>
                    </Group>
                </form>
            </Box>

            <Affix position={{ bottom: "2rem", right: "2rem" }}>
                <Alert
                    withCloseButton
                    sx={{ whiteSpace: "pre" }}
                    closeButtonLabel="Fechar alerta"
                    onClose={() => setShow(false)}
                    hidden={!show}
                    variant="filled"
                    icon={<IconAlertCircle size={16} />}
                    title="Erro!"
                    color="red"
                >
                    {error}
                </Alert>
            </Affix>
        </>
    );
};

export default Login;
