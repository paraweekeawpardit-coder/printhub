"use client";
import Navbar from "../component/auth/navbar";
import Banner from "../component/auth/banner";
import Steps from "../component/auth/step";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Banner />
      <Steps />
    </main>
  );
}
