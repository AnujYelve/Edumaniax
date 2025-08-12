import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../contexts/useSubscription';
import { useAccessControl } from '../utils/accessControl';
import { Lock, Crown, Zap, Star, ArrowRight } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requiredPlan = 'STARTER',
  requiredModule = null,
  requiredFeature = null,
  requiredLevel = null,
  fallbackPath = '/payment-required',
  showUpgradePrompt = true
}) => {
  const { loading, subscriptions } = useSubscription();
  const location = useLocation();
  const [showInlineUpgrade, setShowInlineUpgrade] = useState(false);

  // Get user's selected module from localStorage or user data
  const selectedModule = localStorage.getItem('selectedModule') || null;

  const accessControl = useAccessControl(subscriptions, selectedModule);

  // Show loading while checking subscription
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verifying your access...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Check different types of access
  let hasAccess = true;
  let accessStatus = null;

  if (requiredModule) {
    hasAccess = accessControl.hasModuleAccess(requiredModule);
    if (!hasAccess) {
      accessStatus = accessControl.getAccessStatus(requiredModule, requiredLevel);
    }
  } else if (requiredFeature) {
    hasAccess = accessControl.hasFeatureAccess(requiredFeature);
  } else {
    // Check plan level access
    const planHierarchy = ['STARTER', 'SOLO', 'PRO', 'INSTITUTIONAL'];
    const currentIndex = planHierarchy.indexOf(accessControl.currentPlan);
    const requiredIndex = planHierarchy.indexOf(requiredPlan);
    hasAccess = currentIndex >= requiredIndex;
  }

  // If access denied and we want to show upgrade prompt
  if (!hasAccess && showUpgradePrompt && !showInlineUpgrade) {
    setShowInlineUpgrade(true);
  }

  // If access denied and no inline prompt, redirect
  if (!hasAccess && !showUpgradePrompt) {
    const params = new URLSearchParams();
    params.set('redirect', location.pathname);
    if (requiredPlan) params.set('plan', requiredPlan);
    if (requiredModule) params.set('module', requiredModule);
    if (requiredFeature) params.set('feature', requiredFeature);
    if (requiredLevel) params.set('level', requiredLevel.toString());
    
    const redirectPath = `${fallbackPath}?${params.toString()}`;
    return <Navigate to={redirectPath} replace />;
  }

  // If showing inline upgrade prompt
  if (!hasAccess && showInlineUpgrade) {
    return <UpgradePrompt 
      currentPlan={accessControl.currentPlan}
      requiredPlan={requiredPlan}
      requiredModule={requiredModule}
      requiredFeature={requiredFeature}
      requiredLevel={requiredLevel}
      accessStatus={accessStatus}
      onContinue={() => setShowInlineUpgrade(false)}
      onUpgrade={() => {
        const params = new URLSearchParams();
        params.set('redirect', location.pathname);
        if (requiredPlan) params.set('plan', requiredPlan);
        if (requiredModule) params.set('module', requiredModule);
        if (requiredFeature) params.set('feature', requiredFeature);
        
        window.location.href = `/payment?${params.toString()}`;
      }}
    />;
  }

  return children;
};

// Inline upgrade prompt component
const UpgradePrompt = ({ 
  currentPlan, 
  requiredPlan, 
  requiredModule, 
  requiredFeature,
  requiredLevel,
  accessStatus,
  onContinue, 
  onUpgrade 
}) => {
  const planIcons = {
    STARTER: <Star className="w-8 h-8 text-yellow-500" />,
    SOLO: <Zap className="w-8 h-8 text-blue-500" />,
    PRO: <Crown className="w-8 h-8 text-purple-500" />,
    INSTITUTIONAL: <Crown className="w-8 h-8 text-gold-500" />
  };

  const planColors = {
    STARTER: 'from-yellow-100 to-yellow-200 border-yellow-400',
    SOLO: 'from-blue-100 to-blue-200 border-blue-400',
    PRO: 'from-purple-100 to-purple-200 border-purple-400',
    INSTITUTIONAL: 'from-gold-100 to-gold-200 border-gold-400'
  };

  const targetPlan = requiredPlan || accessStatus?.requiredPlan || 'PRO';
  const colorClass = planColors[targetPlan] || planColors.PRO;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className={`max-w-2xl w-full bg-gradient-to-br ${colorClass} rounded-3xl shadow-2xl p-8 border-4 relative overflow-hidden`}>
        
        {/* Animated Background Elements */}
        <div className="absolute top-4 left-4 text-yellow-400 text-3xl animate-ping">✨</div>
        <div className="absolute top-6 right-6 text-pink-400 text-3xl animate-bounce">🚀</div>
        <div className="absolute bottom-4 left-6 text-blue-400 text-2xl animate-pulse">💎</div>
        <div className="absolute bottom-6 right-4 text-green-400 text-2xl animate-bounce">🌟</div>

        <div className="relative z-10 text-center">
          {/* Lock Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Lock className="w-12 h-12 text-gray-600" />
            </div>
          </div>

          {/* Upgrade Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Upgrade Required! 🔓
          </h1>
          
          <div className="bg-white/80 rounded-2xl p-6 mb-6">
            <p className="text-gray-700 text-lg mb-4">
              {requiredModule && (
                <>Access to <span className="font-semibold text-blue-600">{requiredModule}</span> module requires</>
              )}
              {requiredFeature && (
                <>The <span className="font-semibold text-blue-600">{requiredFeature}</span> feature requires</>
              )}
              {!requiredModule && !requiredFeature && (
                <>This content requires</>
              )}
              {requiredLevel && (
                <> Level {requiredLevel} access with</>
              )}
              <span className="font-bold text-purple-600"> {targetPlan} Plan</span>
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="flex justify-center mb-2">{planIcons[currentPlan]}</div>
                <p className="text-sm font-medium text-gray-600">Current</p>
                <p className="text-lg font-bold text-gray-800">{currentPlan}</p>
              </div>
              
              <ArrowRight className="w-8 h-8 text-gray-400" />
              
              <div className="text-center">
                <div className="flex justify-center mb-2">{planIcons[targetPlan]}</div>
                <p className="text-sm font-medium text-gray-600">Required</p>
                <p className="text-lg font-bold text-purple-600">{targetPlan}</p>
              </div>
            </div>
          </div>

          {/* Upgrade Benefits */}
          {accessStatus?.upgradeInfo && (
            <div className="bg-white/80 rounded-2xl p-6 mb-6 text-left">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎉 What you'll unlock:</h3>
              <ul className="space-y-2">
                {accessStatus.upgradeInfo.unlockedModules?.slice(0, 3).map((module, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{module.name} {module.icon}</span>
                  </li>
                ))}
                {accessStatus.upgradeInfo.unlockedFeatures?.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onUpgrade}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 Upgrade Now
            </button>
            
            <button
              onClick={onContinue}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-300"
            >
              Continue with Current Plan
            </button>
          </div>

          <p className="text-gray-600 text-sm mt-4">
            30-day money-back guarantee • Instant access • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
