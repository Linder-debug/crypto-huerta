"use client";

import Link from "next/link";
import { FaArrowRight, FaEnvelope, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* HERO con imagen de fondo */}
      <section
        className="hero min-h-[80vh] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/img/fundo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="hero-content text-center text-white relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">CryptoHuerta</h1>
            <p className="text-2xl mb-2 font-light">Tokenización de inversión agrícola en Arbitrum</p>
            <p className="text-xl mb-6">Democratizando el agro peruano con blockchain</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/crypto-huerta" className="btn btn-primary btn-lg">
                Probar Demo <FaArrowRight className="ml-2" />
              </Link>
              <a
                href="https://github.com/Linder-debug/crypto-huerta"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-green-800"
              >
                Ver código
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">El agro peruano es un privilegio de pocos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-2xl font-bold text-error">S/53,800</h3>
              <p className="text-lg">Inversión mínima para un lote de 500 plantas (1000 m²)</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-2xl font-bold text-warning">11 años</h3>
              <p className="text-lg">Capital atado sin posibilidad de salida anticipada</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-2xl font-bold text-info">1 informe / año</h3>
              <p className="text-lg">Sin verificación independiente ni trazabilidad real</p>
            </div>
          </div>
        </div>
        <p className="text-center text-lg mt-8 italic text-white">
          {"'Pagué S/53,800 por un lote real. No podía verificar mis propias plantas entre informe e informe.'"}.
        </p>
      </section>

      {/* SOLUCIÓN */}
      <section className="py-16 px-4 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Tokenizamos plantas, no tierra</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="card-title justify-center">Planta a Token</h3>
                <p>Cada token CHT representa una fracción de una planta real. Invierte desde fracciones de lote.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="card-title justify-center">Liquidez inmediata</h3>
                <p>Compra y vende tus tokens en cualquier momento, sin esperar 11 años.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="card-title justify-center">Trazabilidad verificable</h3>
                <p>Cada informe se registra con un hash en blockchain. Nadie puede alterarlo después.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO Y TECNOLOGÍA */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">MVP funcional</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">🔹 Dashboard del inversor</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>Balance de CHT en tiempo real</li>
                <li>Compra y venta de tokens</li>
                <li>Hash del último informe de trazabilidad</li>
                <li>Resumen ejecutivo con IA</li>
                <li>Monitoreo IoT simulado</li>
              </ul>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">🔹 Panel de administración</h3>
              <ul className="list-disc pl-4 space-y-2">
                <li>Subir informes (hash SHA-256 en blockchain)</li>
                <li>Actualizar precio del token</li>
                <li>Historial completo de informes</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="/crypto-huerta" className="btn btn-primary btn-lg">
            Probar la demo <FaArrowRight className="ml-2" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">Demo en Arbitrum Sepolia – Transacciones en menos de 2 segundos</p>
        </div>
      </section>

      {/* MODELO DE NEGOCIO */}
      <section className="py-16 px-4 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Ganan todos: inversor, operador y comunidad
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="card-title justify-center">Inversor</h3>
                <p>Rentabilidad real Año 1: ~20% | Año 2 proyectado: ~34%</p>
                <p className="text-sm text-gray-500 mt-2">Basado en datos reales de Fundo Azul</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🚜</div>
                <h3 className="card-title justify-center">Operador</h3>
                <p>Escalamiento acelerado con capital captado vía tokenización</p>
                <p className="text-sm text-gray-500 mt-2">Economía de escala sin deuda bancaria</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🌎</div>
                <h3 className="card-title justify-center">Comunidad</h3>
                <p>Desarrollo regional y acceso inclusivo a oportunidades financieras</p>
                <p className="text-sm text-gray-500 mt-2">Formalización del agro peruano</p>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-8">
            Piloto demo: 2,500 CHT emitidos (5 lotes × 500 plantas) | Pricing en USDC
          </p>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Equipo</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Linder López */}
          <div className="card w-64 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder">
                <div className="bg-green-800 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  LL
                </div>
              </div>
              <h3 className="card-title">Linder López</h3>
              <p className="text-sm">Blockchain Developer & Project Lead</p>
              <a
                href="https://www.linkedin.com/in/linder-lopez-rivera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-2xl mt-2"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Emmanuel Lopez */}
          <div className="card w-64 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder">
                <div className="bg-blue-800 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  EL
                </div>
              </div>
              <h3 className="card-title">Emmanuel Lopez</h3>
              <p className="text-sm">Frontend Developer</p>
              <a
                href="https://www.linkedin.com/in/emmanuel-haziel-lopez-yupanqui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-2xl mt-2"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Enmanuel Girón */}
          <div className="card w-64 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar placeholder">
                <div className="bg-gray-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                  EG
                </div>
              </div>
              <h3 className="card-title">Enmanuel Girón</h3>
              <p className="text-sm">QA & Soporte Técnico</p>
              <a
                href="https://www.linkedin.com/in/enmanuel-gir%C3%B3n-l%C3%B3pez-b9297b3b4/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-2xl mt-2"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CIERRE Y REDES SOCIALES */}
      <section className="py-16 px-4 bg-green-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">CryptoHuerta – El futuro de la inversión agro</h2>
          <p className="text-xl mb-8">Transformemos el agro peruano con transparencia real, no promesas de brochure.</p>
          <div className="flex flex-wrap justify-center gap-6 text-3xl">
            <a
              href="https://twitter.com/cryptohuerta1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/cryptohuerta"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition-colors"
            >
              <FaInstagram />
            </a>
            <a href="mailto:cryptohuerta1@gmail.com" className="hover:text-yellow-300 transition-colors">
              <FaEnvelope />
            </a>
          </div>
          <p className="mt-8 text-sm text-gray-300">
            📧 cryptohuerta1@gmail.com &nbsp;|&nbsp; 🐦 @cryptohuerta1 &nbsp;|&nbsp; 📸 @cryptohuerta
          </p>
        </div>
      </section>
    </div>
  );
}
