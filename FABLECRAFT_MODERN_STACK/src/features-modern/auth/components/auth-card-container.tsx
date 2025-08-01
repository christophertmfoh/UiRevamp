import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useResponsiveLayout } from '@/shared/hooks/use-responsive-layout';

interface AuthCardContainerProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  children: ReactNode;
}

// Variants for desktop 3D flip
const desktopVariants = {
  login: { rotateY: 0 },
  signup: { rotateY: 180 },
};

// Variants for tablet / mobile slide
const slideVariants = {
  login: { x: 0 },
  signup: { x: '-100%' },
};

export const AuthCardContainer: React.FC<AuthCardContainerProps> = ({ mode, onModeChange, children }) => {
  const { isDesktop } = useResponsiveLayout();

  return (
    <div className="relative w-full max-w-3xl mx-auto perspective-1000">
      <AnimatePresence initial={false}>
        <motion.div
          key={mode}
          className="[backface-visibility:hidden]"
          initial={false}
          animate={isDesktop ? desktopVariants[mode] : slideVariants[mode]}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Mode switch overlay button */}
      <button
        type="button"
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-primary hover:underline"
        onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
      </button>
    </div>
  );
};