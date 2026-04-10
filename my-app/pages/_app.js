import "bootstrap/dist/css/bootstrap.min.css";
import RouteGuard from "@/components/RouteGuard";
import MainNav from "@/components/MainNav";

export default function App({ Component, pageProps }) {
  return (
    <>
      <MainNav />
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </>
  );
}
