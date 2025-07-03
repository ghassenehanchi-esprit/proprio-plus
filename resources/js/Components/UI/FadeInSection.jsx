import { motion } from 'framer-motion';

export default function FadeInSection({ children, ...props }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
