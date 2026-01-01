/**
 * Access Control Rules for EduManiax Platform
 * 
 * This file defines what features and facilities are unlocked
 * for each subscription plan after payment.
 */

// Define all available modules in the platform
const MODULES = {
  FINANCE: 'finance',
  COMPUTERS: 'computers',
  LAW: 'law',
  COMMUNICATION: 'communication',
  ENTREPRENEURSHIP: 'entrepreneurship',
  DIGITAL_MARKETING: 'digital-marketing',
  LEADERSHIP: 'leadership',
  ENVIRONMENT: 'environment',
  SEL: 'sel' // Social Emotional Learning (Wellness & Mental Health)
};

// Define all available features in the platform
const FEATURES = {
  // Core Features
  GAMES: 'games',
  NOTES: 'notes',
  ASSESSMENTS: 'assessments',
  CERTIFICATES: 'certificates',
  
  // AI Features
  AI_ASSESSMENT: 'ai_assessment',
  AI_PERSONALIZATION: 'ai_personalization',
  AI_HOMEWORK: 'ai_homework',
  
  // Premium Features
  PROGRESS_TRACKING: 'progress_tracking',
  PERFORMANCE_ANALYTICS: 'performance_analytics',
  DISCUSSION_FORUMS: 'discussion_forums',
  LIVE_SESSIONS: 'live_sessions',
  PRIORITY_SUPPORT: 'priority_support',
  
  // Institutional Features
  BULK_MANAGEMENT: 'bulk_management',
  CUSTOM_CONTENT: 'custom_content',
  ADMIN_DASHBOARD: 'admin_dashboard',
  CUSTOM_BRANDING: 'custom_branding'
};

/**
 * ACCESS CONTROL RULES
 * 
 * This object defines what each plan can access.
 * Structure: {
 *   PLAN_NAME: {
 *     modules: [...], // Which modules are accessible
 *     features: [...], // Which features are available
 *     limitations: {...}, // Any limitations or restrictions
 *     benefits: [...] // Special benefits for this plan
 *   }
 * }
 */
const ACCESS_RULES = {
  STARTER: {
    modules: [
      // Only one module of user's choice (to be selected during registration)
      // This will be dynamically determined based on user selection
    ],
    features: [
      FEATURES.GAMES, // Limited games within the selected module
      FEATURES.NOTES, // Basic notes for selected module
    ],
    limitations: {
      maxModules: 1,
      maxGamesPerModule: 3, // Only first 3 games per module
      maxLevelsPerModule: 1, // Only Level 1 (beginner)
      aiFeatures: false,
      certificates: false,
      downloadableContent: false,
      offlineAccess: false
    },
    benefits: [
      'Free access to explore the platform for 7 days',
      'Basic learning tools',
      'Community forum access (read-only)'
    ],
    duration: '7 days',
    cost: 0
  },

  SOLO: {
    modules: [
      // One premium module of user's choice
      // User can select any one module from the full list
    ],
    features: [
      FEATURES.GAMES, // All games within selected module
      FEATURES.NOTES, // Complete notes for selected module
      FEATURES.ASSESSMENTS, // Interactive assessments
      FEATURES.CERTIFICATES, // Completion certificates now available for SOLO
      FEATURES.PROGRESS_TRACKING // Basic progress tracking
    ],
    limitations: {
      maxModules: 1,
      maxGamesPerModule: 'unlimited', // All games in selected module
      maxLevelsPerModule: 'all', // All levels in selected module
      aiFeatures: false,
      certificates: true, // Now available for SOLO
      liveSessionAccess: false,
      prioritySupport: false
    },
    benefits: [
      'Full access to one premium module',
      'All interactive activities and assessments for selected module',
      'Trial access to Challenge 1 of Level 1 in other modules',
      'Completion certificates for selected module',
      'Progress tracking and basic analytics',
      'Downloadable notes and resources',
      'Community forum participation'
    ],
    duration: '1 month',
    cost: 199
  },

  PRO: {
    modules: Object.values(MODULES), // All modules
    features: [
      FEATURES.GAMES,
      FEATURES.NOTES,
      FEATURES.ASSESSMENTS,
      FEATURES.CERTIFICATES,
      FEATURES.AI_ASSESSMENT,
      FEATURES.AI_PERSONALIZATION,
      FEATURES.PROGRESS_TRACKING,
      FEATURES.PERFORMANCE_ANALYTICS,
      FEATURES.DISCUSSION_FORUMS
    ],
    limitations: {
      maxModules: 'unlimited',
      maxGamesPerModule: 'unlimited',
      maxLevelsPerModule: 'all',
      aiFeatures: true,
      certificates: true,
      liveSessionAccess: false, // Reserved for institutional
      bulkManagement: false // Reserved for institutional
    },
    benefits: [
      'Access to all premium modules',
      'Complete notes for every module',
      'All interactive games and assessments',
      'AI-powered personalized learning path',
      'AI-powered assessment and feedback',
      'Completion certificates for all modules',
      'Advanced progress tracking and analytics',
      'Full community forum access',
      'Downloadable content and offline access',
      'Email support'
    ],
    duration: '6 months',
    cost: 1433
  },

  INSTITUTIONAL: {
    modules: Object.values(MODULES), // All modules
    features: Object.values(FEATURES), // All features
    limitations: {
      maxModules: 'unlimited',
      maxGamesPerModule: 'unlimited',
      maxLevelsPerModule: 'all',
      aiFeatures: true,
      certificates: true,
      customContent: true,
      bulkUserManagement: true
    },
    benefits: [
      'Everything from PRO plan',
      'Access for 30+ users',
      'Custom onboarding and training',
      'Live lectures by subject matter experts',
      'Priority 24/7 support',
      'Custom content creation',
      'White-label solutions',
      'Advanced admin dashboard',
      'Bulk user management',
      'Custom reporting and analytics',
      'Integration with school/company systems',
      'Dedicated account manager'
    ],
    duration: 'Custom',
    cost: 'Custom'
  }
};

/**
 * MODULE ACCESS RULES
 * 
 * Define which specific content within each module is accessible
 * based on the subscription plan
 */
const MODULE_ACCESS_RULES = {
  [MODULES.FINANCE]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Budget Basics', 'Coin Counter', 'Simple Savings'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },

  [MODULES.DIGITAL_MARKETING]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Social Media Basics', 'Content Creation 101'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },

  // Add similar rules for other modules...
  [MODULES.COMMUNICATION]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Basic Speaking', 'Listening Skills'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },
  
  [MODULES.COMPUTERS]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Programming Basics', 'Algorithm Introduction'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },
  
  [MODULES.LAW]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Legal Basics', 'Rights & Responsibilities'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },
  
  [MODULES.ENTREPRENEURSHIP]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Business Basics', 'Idea Generation'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },
  
  [MODULES.LEADERSHIP]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Leadership Basics', 'Team Building'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },
  
  [MODULES.ENVIRONMENT]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Environmental Basics', 'Sustainability 101'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  },
  
  [MODULES.SEL]: {
    STARTER: {
      levels: ['Level 1'],
      activities: ['Wellness Basics', 'Mental Health Introduction'],
      maxActivities: 3
    },
    SOLO: {
      levels: ['Level 1', 'Level 2', 'Level 3'],
      activities: 'all',
      maxActivities: 'unlimited'
    },
    PRO: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true
    },
    INSTITUTIONAL: {
      levels: 'all',
      activities: 'all',
      maxActivities: 'unlimited',
      aiAssessment: true,
      customContent: true
    }
  }
};

/**
 * FEATURE ACCESS CHECKER FUNCTIONS
 */

/**
 * MODULE_DISPLAY_MAPPING
 * 
 * This maps the display names of modules (as shown in the UI) to their internal keys
 */
const MODULE_DISPLAY_MAPPING = {
  'Fundamentals of Finance': MODULES.FINANCE,
  'Computer Science': MODULES.COMPUTERS,
  'Fundamentals of Law': MODULES.LAW,
  'Communication Mastery': MODULES.COMMUNICATION,
  'Entrepreneurship Bootcamp': MODULES.ENTREPRENEURSHIP,
  'Digital Marketing Pro': MODULES.DIGITAL_MARKETING,
  'Leadership & Adaptability': MODULES.LEADERSHIP,
  'Environmental Sustainability': MODULES.ENVIRONMENT,
  'Wellness & Mental Health': MODULES.SEL
};

/**
 * Get the internal module key from its display name
 * @param {string} displayName - The module display name
 * @returns {string} - The internal module key
 */
function getModuleKey(displayName) {
  return MODULE_DISPLAY_MAPPING[displayName] || displayName;
}

/**
 * Get the module display name from its internal key
 * @param {string} moduleKey - The internal module key
 * @returns {string} - The module display name
 */
function getModuleDisplayName(moduleKey) {
  for (const [displayName, key] of Object.entries(MODULE_DISPLAY_MAPPING)) {
    if (key === moduleKey) {
      return displayName;
    }
  }
  return moduleKey; // Return the key itself if no display name is found
}

/**
 * Check if a user has access to a specific module
 * @param {string} userPlan - User's subscription plan
 * @param {string} module - Module to check access for
 * @param {string} selectedModule - User's selected module (for STARTER/SOLO plans)
 * @returns {boolean}
 */
function hasModuleAccess(userPlan, module, selectedModule = null) {
  const plan = ACCESS_RULES[userPlan];
  if (!plan) return false;

  // Convert display names to internal keys if needed
  const moduleKey = getModuleKey(module);
  const selectedModuleKey = selectedModule ? getModuleKey(selectedModule) : null;

  // STARTER plan only has access to their selected module
  if (userPlan === 'STARTER') {
    return selectedModuleKey === moduleKey;
  }

  // SOLO plan has full access to their selected module
  // AND trial access to all other modules
  if (userPlan === 'SOLO') {
    return true; // Allow access to all modules (with level restrictions handled elsewhere)
  }

  // PRO and INSTITUTIONAL have access to all modules
  return plan.modules.includes(moduleKey) || plan.modules === Object.values(MODULES);
}

/**
 * Check if a user has access to a specific feature
 * @param {string} userPlan - User's subscription plan
 * @param {string} feature - Feature to check access for
 * @returns {boolean}
 */
function hasFeatureAccess(userPlan, feature) {
  const plan = ACCESS_RULES[userPlan];
  if (!plan) return false;

  return plan.features.includes(feature);
}

/**
 * Get the maximum number of activities a user can access in a module
 * @param {string} userPlan - User's subscription plan
 * @param {string} module - Module to check
 * @returns {number|string} - Number of activities or 'unlimited'
 */
function getMaxActivities(userPlan, module) {
  const moduleRules = MODULE_ACCESS_RULES[module];
  if (!moduleRules || !moduleRules[userPlan]) return 0;

  return moduleRules[userPlan].maxActivities;
}

/**
 * Check if a user can access a specific level within a module
 * @param {string} userPlan - User's subscription plan
 * @param {string} module - Module to check
 * @param {string} level - Level to check (e.g., 'Level 1', 'Level 2')
 * @param {string} selectedModule - User's selected module (for SOLO plans)
 * @returns {boolean}
 */
function hasLevelAccess(userPlan, module, level, selectedModule = null) {
  // Convert display names to internal keys if needed
  const moduleKey = getModuleKey(module);
  const selectedModuleKey = selectedModule ? getModuleKey(selectedModule) : null;
  
  const moduleRules = MODULE_ACCESS_RULES[moduleKey];
  if (!moduleRules || !moduleRules[userPlan]) return false;

  // Special handling for SOLO plan users
  if (userPlan === 'SOLO') {
    if (selectedModuleKey === moduleKey) {
      // Full access to all levels of their selected module
      return true;
    } else {
      // Trial access - only Level 1 for other modules
      return level === 'Level 1';
    }
  }

  const planLevels = moduleRules[userPlan].levels;
  if (planLevels === 'all') return true;
  
  return Array.isArray(planLevels) && planLevels.includes(level);
}

/**
 * Check if a user can access a specific challenge within a level
 * @param {string} userPlan - User's subscription plan
 * @param {string} module - Module to check
 * @param {string} level - Level to check (e.g., 'Level 1')
 * @param {number} challengeIndex - Challenge index (0-based)
 * @param {string} selectedModule - User's selected module (for SOLO plans)
 * @returns {boolean}
 */
function hasChallengeAccess(userPlan, module, level, challengeIndex, selectedModule = null) {
  // Convert display names to internal keys if needed
  const moduleKey = getModuleKey(module);
  const selectedModuleKey = selectedModule ? getModuleKey(selectedModule) : null;

  // First check if user has level access
  if (!hasLevelAccess(userPlan, moduleKey, level, selectedModuleKey)) return false;

  // STARTER plan users can only access Challenge 1 (index 0) of Level 1
  if (userPlan === 'STARTER') {
    return level === 'Level 1' && challengeIndex === 0;
  }

  // SOLO plan users
  if (userPlan === 'SOLO') {
    if (selectedModuleKey === moduleKey) {
      // Full access to all challenges in their selected module
      return true;
    } else {
      // Trial access - only Challenge 1 of Level 1 for other modules
      return level === 'Level 1' && challengeIndex === 0;
    }
  }

  // PRO and INSTITUTIONAL have full access
  return true;
}

/**
 * Get user's plan benefits and limitations
 * @param {string} userPlan - User's subscription plan
 * @returns {object} - Object containing benefits and limitations
 */
function getPlanDetails(userPlan) {
  const plan = ACCESS_RULES[userPlan];
  if (!plan) return null;

  return {
    modules: plan.modules,
    features: plan.features,
    limitations: plan.limitations,
    benefits: plan.benefits,
    duration: plan.duration,
    cost: plan.cost
  };
}

/**
 * Check if user needs to upgrade for a specific feature/module
 * @param {string} currentPlan - User's current plan
 * @param {string} requiredPlan - Required plan for the feature
 * @returns {object} - Upgrade information
 */
function getUpgradeInfo(currentPlan, requiredPlan) {
  const planHierarchy = ['STARTER', 'SOLO', 'PRO', 'INSTITUTIONAL'];
  const currentIndex = planHierarchy.indexOf(currentPlan);
  const requiredIndex = planHierarchy.indexOf(requiredPlan);

  return {
    needsUpgrade: currentIndex < requiredIndex,
    currentPlan,
    requiredPlan,
    upgradeBenefits: ACCESS_RULES[requiredPlan]?.benefits || []
  };
}

/**
 * Middleware function to check access before allowing API calls
 * @param {string} planType - Type of plan user is trying to access
 * @param {string} module - Module being accessed (optional)
 * @param {string} feature - Feature being accessed (optional)
 */
function checkAccessMiddleware(planType, module = null, feature = null) {
  return (req, res, next) => {
    const userPlan = req.user?.subscription?.planType || 'STARTER';
    const selectedModule = req.user?.selectedModule;

    // Check module access if module is specified
    if (module && !hasModuleAccess(userPlan, module, selectedModule)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This module requires ${planType} plan or higher`,
        currentPlan: userPlan,
        requiredPlan: planType,
        upgradeInfo: getUpgradeInfo(userPlan, planType)
      });
    }

    // Check feature access if feature is specified
    if (feature && !hasFeatureAccess(userPlan, feature)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This feature requires ${planType} plan or higher`,
        currentPlan: userPlan,
        requiredPlan: planType,
        upgradeInfo: getUpgradeInfo(userPlan, planType)
      });
    }

    next();
  };
}

export {
  MODULES,
  FEATURES,
  ACCESS_RULES,
  MODULE_ACCESS_RULES,
  MODULE_DISPLAY_MAPPING,
  getModuleKey,
  getModuleDisplayName,
  hasModuleAccess,
  hasFeatureAccess,
  getMaxActivities,
  hasLevelAccess,
  hasChallengeAccess,
  getPlanDetails,
  getUpgradeInfo,
  checkAccessMiddleware
};
