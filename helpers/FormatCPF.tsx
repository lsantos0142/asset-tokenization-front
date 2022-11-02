export default function formatCPF(CPF: string) {
    //retira os caracteres indesejados...
    CPF = CPF.replace(/[^\d]/g, "");

    //realizar a formatação...
    return CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
