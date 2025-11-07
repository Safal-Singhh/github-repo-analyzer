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
    // Merge with existing entry (avoid duplicates by URL)
    const nowIso = new Date().toISOString();
    const idx = history.findIndex((h) => h.url === repoData.url);
    const basePinned = idx >= 0 ? !!history[idx].pinned : false;
    const newEntry = {
      // minimal required fields
      name: repoData.name,
      owner: repoData.owner,
      url: repoData.url,
      stars: repoData.stars || 0,
      // richer metadata if provided
      forks: repoData.forks || 0,
      language: repoData.language || null,
      summary: repoData.summary || null,
      pinned: basePinned,
      timestamp: nowIso
    };

    if (idx >= 0) {
      // Update existing entry and move to top
      history.splice(idx, 1);
    }
    history.unshift(newEntry);

    // Retention policy: keep up to 100, never drop pinned entries
    const LIMIT = 100;
    const pinned = history.filter((h) => h.pinned);
    const nonPinned = history.filter((h) => !h.pinned);
    const keepNonPinned = nonPinned.slice(0, Math.max(LIMIT - pinned.length, 0));
    history = [...pinned, ...keepNonPinned];

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
      const arr = JSON.parse(historyData) || [];
      // Sort: pinned first, then by timestamp desc
      return arr.sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
    }
    return [];
  } catch (error) {
    console.error('Error getting repo history:', error);
    return [];
  }
};

// Toggle pin state for a repo by URL
export const togglePinRepoInHistory = async (url) => {
  if (!isUserSignedIn() || typeof puter === 'undefined') {
    return false;
  }
  try {
    const historyData = await puter.kv.get('repo_history');
    let history = [];
    if (historyData) history = JSON.parse(historyData) || [];
    const idx = history.findIndex((h) => h.url === url);
    if (idx === -1) return false;
    history[idx].pinned = !history[idx].pinned;

    // Apply retention again: pinned entries should never be dropped
    const LIMIT = 100;
    const pinned = history.filter((h) => h.pinned);
    const nonPinned = history.filter((h) => !h.pinned);
    const keepNonPinned = nonPinned.slice(0, Math.max(LIMIT - pinned.length, 0));
    const newHistory = [...pinned, ...keepNonPinned];

    await puter.kv.set('repo_history', JSON.stringify(newHistory));
    return true;
  } catch (error) {
    console.error('Error toggling pin:', error);
    return false;
  }
};