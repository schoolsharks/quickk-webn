/**
 * Utility function to check if user profile is complete
 * @param user - User object with profile fields
 * @returns boolean - true if profile is complete, false otherwise
 */
export const isProfileComplete = (user: {
  businessCategory?: string | null;
  designation?: string | null;
  currentStage?: string | null;
  communityGoal?: string | null;
  interestedEvents?: string | null;
}): boolean => {
  if (!user) return false;
  
  const requiredFields = [
    user.businessCategory,
    user.designation,
    user.currentStage,
    user.communityGoal,
    user.interestedEvents,
  ];

  return requiredFields.every(field => 
    field && field.trim() !== ""
  );
};
