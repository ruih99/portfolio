import { Terminal } from "@/components/terminal";
import { MatrixRainBackground } from "@/components/background";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] relative overflow-hidden">
      <MatrixRainBackground />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <main className="relative z-10">
        <Terminal />
      </main>
    </div>
  );
}
