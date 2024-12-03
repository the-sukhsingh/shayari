import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export const metadata = {
  title: "Shayar Bajwa",
  description: "Shayar Bajwa's personal website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >

        <Navbar />
        <main className="min-h-screen">

        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
