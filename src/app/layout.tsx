import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { montserrat, poppins, slackey } from "@/app/fonts";
import { siteConfig } from "@/config/site";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={`${montserrat.variable} ${slackey.variable} ${poppins.variable}`} lang="pt-BR">
      <body>
        {/*
          Marca o documento antes do primeiro paint: o estado oculto da animação
          de entrada existe sob `html.js` (`globals.css`), então uma falha de
          JavaScript não esconde nenhuma seção. Tem de ser script bloqueante
          inline — `next/script` chegaria depois do primeiro paint.
        */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: literal constante, sem entrada de usuário — é o padrão sem-flash do estado oculto da animação
          dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }}
        />
        {/* Keyboard users must be able to skip the navigation on every page. */}
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          href="#conteudo-principal"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
