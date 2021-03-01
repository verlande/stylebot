import { LEVELS, MASTER_LEVELS, getSkillCurve } from './skillcurves';

export const SKILL_COUNT = 28;
export const MAX_VIRTUAL_LEVEL = 120;
export const MAX_SKILL_XP = 200000000;
export const MAX_TOTAL_XP = MAX_SKILL_XP * SKILL_COUNT;
export const MAX_COMBAT_LEVEL = 138;
export const MAX_TOTAL_LEVEL = 2898;
export const MAX_VIRTUAL_TOTAL_LEVEL = 3309;
export const TOTAL_XP_AT_ALL_99 = SKILL_COUNT * (LEVELS.get(99) || 0) + (MASTER_LEVELS.get(99) || 0);
export const TOTAL_XP_AT_ALL_120 = SKILL_COUNT * (LEVELS.get(120) || 0) + (MASTER_LEVELS.get(120) || 0);

export const levelFromXp = (xp: number, skillCurve: undefined | 'master' = undefined) => {
  if (xp < 0) throw new Error(`Invalid xp: ${xp}`);

  const curve = getSkillCurve(skillCurve);
  const maxLevel = Math.min(curve.size, MAX_VIRTUAL_LEVEL);

  for (let level = 2; level < maxLevel; level++) {
    const xpThreashold = curve.get(level) || 0;
    if (xp < xpThreashold && xp >= (curve.get(level - 1) || 0)) {
      return level - 1;
    }
  }
  return maxLevel;
};

export const xpUntil99 = (skill: Skill, xp: number) => {
  // TODO: XP is fucked on API
  xp = Math.floor(xp / 10);

  const curve = getSkillCurve(skill.skillCurve);
  const xpAt99 = curve.get(99) || -1;
  if (xpAt99 === -1) {
    throw new Error(`Failed to find xp curve for skill ${skill.id}`);
  }
  let remaining = xpAt99 - xp;
  if (remaining < 0) {
    remaining = 0;
  }
  return {
    skillId: skill.id,
    remaining,
    current: xp,
    max: xpAt99,
  };
};

export const xpUntil120 = (skill, xp: number) => {
  // TODO: XP is fucked on API
  xp = Math.floor(xp / 10);
  const curve = getSkillCurve(skill.skillCurve);
  const xpAt120 = curve.get(120) || -1;
  if (xpAt120 === -1) {
    throw new Error(`Failed to find xp curve for skill ${skill.id}`);
  }
  let remaining = xpAt120 - xp;
  if (remaining < 0) remaining = 0;

  return {
    skillId: skill.id,
    remaining,
    current: xp,
    max: xpAt120,
  };
};
