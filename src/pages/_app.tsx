import type { AppProps } from "next/app";
import "../styles/globals.css"; // or wherever your globals.css file is

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
