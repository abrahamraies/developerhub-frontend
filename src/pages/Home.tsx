import { motion } from "framer-motion";
import useAuthStore from "../stores/authStore";
import Button from "../components/ui/Button";

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: "👥",
      title: "Conexión Directa",
      description:
        "Encuentra y colabora con desarrolladores que comparten tus intereses y habilidades técnicas",
    },
    {
      icon: "🚀",
      title: "Proyectos Open Source",
      description:
        "Descubre oportunidades reales para contribuir a proyectos significativos y construir tu portafolio",
    },
    {
      icon: "🧠",
      title: "Aprendizaje Colaborativo",
      description:
        "Comparte conocimientos, recibe feedback y mejora tus habilidades con mentores experimentados",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col">
        <div className="py-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-6 sm:space-y-8 max-w-4xl w-full"
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                DeveloperHub
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mx-auto leading-relaxed">
                Conecta con desarrolladores y colabora en proyectos open source
              </p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  to="/dashboard"
                  className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                                hover:from-blue-700 hover:to-purple-700 
                                transform hover:scale-[1.02] transition-all duration-200
                                shadow-md hover:shadow-lg"
                >
                  Ir al Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    to="/login"
                    className="px-6 sm:px-8 py-3 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 
                                    hover:from-blue-700 hover:to-purple-700 
                                    transform hover:scale-[1.02] transition-all duration-200
                                    shadow-md hover:shadow-lg"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    variant="secondary"
                    to="/register"
                    className="px-6 sm:px-8 py-3 text-base sm:text-lg 
                                    bg-gradient-to-r from-gray-100 to-gray-50 
                                    dark:from-gray-700 dark:to-gray-800
                                    border border-gray-200 dark:border-gray-600
                                    hover:bg-gray-50 dark:hover:bg-gray-700/50
                                    transform hover:scale-[1.02] transition-all duration-200
                                    shadow-md hover:shadow-lg"
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="py-12 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-white/70 dark:bg-gray-800/50 backdrop-blur shadow-md text-center"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
