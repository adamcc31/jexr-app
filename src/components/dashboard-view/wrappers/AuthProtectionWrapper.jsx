'use client';

/**
 * AuthProtectionWrapper
 * 
 * This is now a simple pass-through component.
 * Server-side authentication is handled by the dashboard layout's
 * JWT validation in (dashboard)/layout.js, so no client-side
 * session checks are needed here.
 */
const AuthProtectionWrapper = ({ children }) => {
  return <>{children}</>;
};

export default AuthProtectionWrapper;