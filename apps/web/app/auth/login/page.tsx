import Image from "next/image.js";
import LoginButton from "./components/LoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Image
            src="/logo.jpg"
            alt="SIPeIP - Sistema Integrado de Planificación e Inversión Pública"
            width={300}
            height={200}
            className="mx-auto rounded-lg shadow-md"
            priority
          />
        </div>
        <LoginButton />
      </div>
    </div>
  );
}
