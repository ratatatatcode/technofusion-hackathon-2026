const missionFeedCacheState = {
    isStale: false,
    invalidatedAt: null,
};

export const invalidateMissionFeedCache = () => {
    missionFeedCacheState.isStale = true;
    missionFeedCacheState.invalidatedAt = new Date().toISOString();

    return { ...missionFeedCacheState };
};

export const getMissionFeedCacheState = () => {
    return { ...missionFeedCacheState };
};
