import test from "node:test";
import assert from "node:assert/strict";
import { getMissionFeedCacheState, invalidateMissionFeedCache } from "./src/services/feed-cache.service.js";
import { validateMissionPayload } from "./src/services/mission.service.js";

test("validateMissionPayload accepts a well-formed mission payload", () => {
    const { errors, value } = validateMissionPayload({
        title: "Campus cleanup",
        categoryTier: "Campus",
        department: "Engineering",
        goal: "Collect and dispose of recyclable waste.",
        duration: "7 days",
        sdgTag: "SDG-11",
        points: 25,
        evidenceRequirements: "Upload before and after photos.",
        createdBy: 99,
    });

    assert.deepEqual(errors, []);
    assert.equal(value.title, "Campus cleanup");
    assert.equal(value.categoryTier, "Campus");
    assert.equal(value.department, "Engineering");
});

test("validateMissionPayload rejects invalid mission payloads", () => {
    const { errors } = validateMissionPayload({
        title: "",
        categoryTier: "",
        department: "",
        goal: "",
        duration: "",
        sdgTag: "",
        points: 0,
        evidenceRequirements: "",
        createdBy: -1,
    });

    assert.deepEqual(errors, [
        "title is required.",
        "categoryTier is required.",
        "department is required.",
        "goal is required.",
        "duration is required.",
        "sdgTag is required.",
        "evidenceRequirements is required.",
        "points must be a positive integer.",
        "createdBy must be a positive integer.",
    ]);
});

test("invalidateMissionFeedCache marks the feed cache as stale", () => {
    const initialState = getMissionFeedCacheState();
    const invalidatedState = invalidateMissionFeedCache();

    assert.equal(initialState.isStale, false);
    assert.equal(invalidatedState.isStale, true);
    assert.ok(invalidatedState.invalidatedAt);
});
