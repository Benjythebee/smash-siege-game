import { featureHealth } from '../components/3d/levelFeatures/constants.js';
import { levelsData } from './levels.js';

export const computeScore = () => {};

export const scoreToGrade = (score: number, ammoUsed: number, level: number | 'custom') => {
  if (!levelsData[level]) return 'F';
  const maxScoreForLevel = levelsData[level].components.reduce((acc, cur) => {
    if (featureHealth[cur.type!] == -1) {
      return acc;
    }
    return acc + featureHealth[cur.type!];
  }, 0);

  const maxBulletsForLevel = levelsData[level].totalAmmo;

  const efficiencyMultiplier = maxBulletsForLevel / ammoUsed;

  // Calculate the percentage of the score achieved
  const finalScore = score * efficiencyMultiplier;

  const scorePercentage = (finalScore / maxScoreForLevel) * 100;

  // console.log("efficiencyMultiplier",efficiencyMultiplier)
  // console.log("finalScore",finalScore)
  // console.log("scorePercentage",scorePercentage)

  if (scorePercentage >= 90) {
    return 'A';
  } else if (scorePercentage >= 75) {
    return 'B';
  } else if (scorePercentage >= 50) {
    return 'C';
  } else if (scorePercentage >= 25) {
    return 'D';
  } else {
    return 'F';
  }
};

export const gradeToColor = (grade: string) => {
  if (grade == 'A') {
    return 'bg-[#FFD700]';
  } else if (grade == 'B') {
    return 'bg-[##C0C0C0]';
  } else if (grade == 'C') {
    return 'bg-[#CD7F32]';
  } else if (grade == 'D') {
    return 'bg-[#6F7C00]';
  } else {
    return 'bg-red-500';
  }
};
