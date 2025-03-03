import type {Metadata, Viewport} from "next";
import "@/styles/globals.css";
import "@/styles/markdown.css";

import {Unbounded} from "next/font/google";

import * as React from "react";
import {getFileURL, getSettings} from "@/lib/database";
import {Settings} from "@/types/interfaces";
import ServerError from "@/components/errors/ServerError";

const unbounded = Unbounded({
    variable: "--font-unbounded",
    subsets: ["latin"],
    style: ["normal"],
    display: "swap",
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"]
});

const description = "Hello faggots i'm tagged wanna be hackerman hvh no name skid";

export const metadata: Metadata = {
    title: {
        template: 'tagged.icu // %s',
        default: "tagged.icu",
    },
    description: description,
    keywords: description,
    authors: [{name: "NATroutter", url: "https://tagged.icu"},],
    manifest: "/manifest.json",
    appleWebApp: {
        title: "tagged.icu",
        statusBarStyle: 'black-translucent',
        startupImage: [
            '/images/favicon/apple-touch-icon.png',
            {
                url: '/images/favicon/apple-touch-icon.png',
                media: '(device-width: 768px) and (device-height: 1024px)',
            },
        ],
    },
    icons: {
        apple: [{url: "/images/favicon/apple-touch-icon.png", sizes: "180x180"}],
        icon: [
            {url: "/images/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png"},
            {url: "/images/favicon/favicon.svg", type: "image/svg+xml"}
        ],
        shortcut: [{url: "/images/favicon/favicon.ico"}],
    },
    other: {
        'msapplication-TileColor': '#02abec',
        'msapplication-config': '/manifest.json',
    },
    openGraph: {
        type: "website",
        url: "https://tagged.icu",
        title: "tagged.icu",
        description: description,
        images: "https://tagged.icu/logo.png",
    }
}

export const viewport: Viewport = {
    themeColor: '#02abec',
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const settings = await getSettings();


    if (settings && settings.id && settings.background) {
        settings.background = getFileURL("settings", settings.id, settings.background)
    }



    return (
        <html lang="en">
        <body className={`${unbounded.variable} ${unbounded.className} flex bg-background bg-cover text-text font-normal m-0 p-0 overflow-y-auto`}>
        {(settings && settings.background) && (
            <div className="fixed inset-0 top-0 bottom-0 left-0 right-0 bg-no-repeat bg-center bg-cover z-0"
                 style={{
                     backgroundImage: `url(${settings.background})`,
                     filter: `brightness(${settings.bg_brightness}) blur(${settings.bg_blur}px)`
                 }}
            >
            </div>
        )}

        <main className="relative flex mx-auto flex-col flex-grow z-[2] min-h-screen px-4 py-20">
            {settings ? children : <ServerError code="0x1"/>}
        </main>

        </body>
        </html>
    );
}
