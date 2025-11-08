// authService.js - Puter.com authentication service

// Helper function to check if user is signed in
export const isUserSignedIn = () => {
  if (typeof puter !== 'undefined') {
    return puter.auth.isSignedIn();
  }
  return false;
};

// Sign in existing user with Puter.com
export const signIn = async () => {
  if (typeof puter !== 'undefined') {
    try {
      await puter.auth.signIn({ mode: 'signin' });
      // notify app about auth change
      try {
        const event = new CustomEvent('puter:auth', { detail: { type: 'auth', isSignedIn: true } });
        window.dispatchEvent(event);
      } catch (_) {}
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      return false;
    }
  }
  return false;
};

// Sign up new user with Puter.com
export const signUp = async () => {
  if (typeof puter !== 'undefined') {
    try {
      await puter.auth.signIn({ mode: 'signup' });
      // notify app about auth change
      try {
        const event = new CustomEvent('puter:auth', { detail: { type: 'auth', isSignedIn: true } });
        window.dispatchEvent(event);
      } catch (_) {}
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      return false;
    }
  }
  return false;
};

// Sign out user
export const signOut = async () => {
  if (typeof puter !== 'undefined') {
    try {
      await puter.auth.signOut();
      // notify app about auth change
      try {
        const event = new CustomEvent('puter:auth', { detail: { type: 'auth', isSignedIn: false } });
        window.dispatchEvent(event);
      } catch (_) {}
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  }
  return false;
};

// Get current user information
export const getCurrentUser = async () => {
  if (typeof puter !== 'undefined') {
    try {
      const user = await puter.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
  return null;
};

// Save repository to user history
export const saveRepoToHistory = async (repoData) => {
  if (!isUserSignedIn() || typeof puter === 'undefined') {
    return false;
  }
  
  try {
    // Get existing history or create new array
    let history = [];
    try {
      const historyData = await puter.kv.get('repo_history');
      if (historyData) {
        history = JSON.parse(historyData);
      }
    } catch (e) {
      // No history found, using empty array
    }
    
    // Add new repo with timestamp
    const newEntry = {
      ...repoData,
      timestamp: new Date().toISOString()
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newEntry);
    
    // Keep only the last 10 entries
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    // Save updated history
    await puter.kv.set('repo_history', JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving repo to history:', error);
    return false;
  }
};

// Get repository history
export const getRepoHistory = async () => {
  if (!isUserSignedIn() || typeof puter === 'undefined') {
    return [];
  }
  
  try {
    const historyData = await puter.kv.get('repo_history');
    if (historyData) {
      return JSON.parse(historyData);
    }
    return [];
  } catch (error) {
    console.error('Error getting repo history:', error);
    return [];
  }
};