import "@ui5/webcomponents-react/dist/Assets.js";
import "../styles/globals.css";
import { AppShell } from "../components/AppShell";
import { ThemeProvider } from "@ui5/webcomponents-react/ssr";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000 // 5 minutes
      }
    }
  }));


  useEffect(() => {
    const style = document.getElementById("server-side-styles");
    if (style) {
      style.parentNode?.removeChild(style);
    }
  }, []);

  return (
    <>
      <Head>
        <script
          data-ui5-config
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              theme: "sap_horizon"
            })
          }}
        />
      </Head>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <AppShell>
              <Component {...pageProps} />
            </AppShell>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
