import { motion } from "framer-motion"

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-10 text-center"
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to Stroke Risk Predictor</h1>
      <p className="text-gray-600 max-w-xl mx-auto">
        Log in to assess your stroke risk and view your prediction history with AI-powered insights.
      </p>
    </motion.div>
  )
}
