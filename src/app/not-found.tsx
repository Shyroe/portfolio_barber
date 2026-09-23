import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center"
      id="conteudo-principal"
    >
      <p className="font-display text-6xl tracking-wide text-highlight-strong">404</p>
      <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">
        Página não encontrada
      </h1>
      <p className="max-w-prose text-muted-foreground">
        O endereço acessado não existe ou foi movido. Volte para a página inicial para continuar.
      </p>
      <Button asChild size="lg">
        <Link href="/">Voltar para o início</Link>
      </Button>
    </main>
  );
}
