// Animation variants
export const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut" 
    }
  }
};

export const bodyTextVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      delay: 0.3 
    }
  }
};

export const ticketVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.5
    }
  }
};

export const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      delay: 0.7 
    }
  },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2 
    }
  },
  tap: { 
    scale: 0.95 
  }
};

export const imageVariants = {
  hidden: { opacity: 0, rotate: -120, scale: 0.7 },
  visible: { 
    opacity: 1, 
    rotate: -90,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 150,
      damping: 12,
      delay: 0.2
    }
  }
};

export const noteVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 0.8,
    transition: { 
      duration: 0.5,
      delay: 0.9 
    }
  }
};

// For loser animation
export const loserTitleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7,
      ease: "easeOut" 
    }
  }
};

export const loserTextVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      delay: 0.2 
    }
  }
};

export const loserTicketVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7,
      delay: 0.4,
      ease: "easeOut"
    }
  }
};