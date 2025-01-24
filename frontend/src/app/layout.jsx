import { GlobalContextProvider } from "@/context/GlobalContext";
import "./globals.css";
import "react-quill/dist/quill.snow.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GlobalContextProvider>
        <body>{children}</body>
      </GlobalContextProvider>
    </html>
  );
}
