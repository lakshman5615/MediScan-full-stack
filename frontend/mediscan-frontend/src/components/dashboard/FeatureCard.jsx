import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon, bg }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-gradient-to-br ${bg} p-6 rounded-2xl 
      shadow-md border border-gray-200`}
    >
      <div className="w-11 h-11 flex items-center justify-center 
      rounded-xl bg-white shadow mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-700 leading-snug">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;






