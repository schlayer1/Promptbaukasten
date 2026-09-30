/**
 * Offizieller Notenschlüssel der Staatlichen Regelschule Heimbürgeschule Kahla
 * Quelle: https://cloud-7.edupage.org/cloud/Notentabelle_HBS-Kahla.pdf
 * 
 * Prozentuale Schwellenwerte:
 * Note 1 (Sehr gut):    ab 95%
 * Note 2 (Gut):         ab 80%  (80% - 94%)
 * Note 3 (Befriedigend): ab 65%  (65% - 79%)
 * Note 4 (Ausreichend):  ab 45%  (45% - 64%)
 * Note 5 (Mangelhaft):   ab 25%  (25% - 44%)
 * Note 6 (Ungenügend):   unter 25% (0% - 24%)
 */

export interface HbsGradeThreshold {
  grade: number; // 1 bis 6
  name: string; // 'Sehr gut', 'Gut', ...
  colorBadge: string;
  bgLight: string;
  textColor: string;
  minPercent: number;
  maxPercent: number;
  minPoints: number;
  maxPoints: number;
}

export const HBS_GRADE_CONFIG = [
  {
    grade: 1,
    name: 'Sehr gut',
    minPercent: 95,
    maxPercent: 100,
    colorBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    bgLight: 'bg-emerald-50/70',
    textColor: 'text-emerald-800'
  },
  {
    grade: 2,
    name: 'Gut',
    minPercent: 80,
    maxPercent: 94,
    colorBadge: 'bg-teal-100 text-teal-900 border-teal-300',
    bgLight: 'bg-teal-50/70',
    textColor: 'text-teal-800'
  },
  {
    grade: 3,
    name: 'Befriedigend',
    minPercent: 65,
    maxPercent: 79,
    colorBadge: 'bg-blue-100 text-blue-900 border-blue-300',
    bgLight: 'bg-blue-50/70',
    textColor: 'text-blue-800'
  },
  {
    grade: 4,
    name: 'Ausreichend',
    minPercent: 45,
    maxPercent: 64,
    colorBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    bgLight: 'bg-amber-50/70',
    textColor: 'text-amber-800'
  },
  {
    grade: 5,
    name: 'Mangelhaft',
    minPercent: 25,
    maxPercent: 44,
    colorBadge: 'bg-orange-100 text-orange-900 border-orange-300',
    bgLight: 'bg-orange-50/70',
    textColor: 'text-orange-800'
  },
  {
    grade: 6,
    name: 'Ungenügend',
    minPercent: 0,
    maxPercent: 24,
    colorBadge: 'bg-rose-100 text-rose-900 border-rose-300',
    bgLight: 'bg-rose-50/70',
    textColor: 'text-rose-800'
  }
];

/**
 * Berechnet für eine gegebene Maximalpunktzahl die exakten Punktegrenzen
 * gemäß der offiziellen HBS-Notentabelle (100% kongruent mit der PDF).
 */
export function calculateHbsGradeTable(totalPoints: number): HbsGradeThreshold[] {
  const safeTotal = Math.max(1, Math.round(totalPoints));

  // Mindestpunkte für Noten 1 bis 5 nach HBS-Rundungsformel
  const p1 = Math.round(safeTotal * 0.95);
  const p2 = Math.round(safeTotal * 0.80);
  const p3 = Math.round(safeTotal * 0.65);
  const p4 = Math.round(safeTotal * 0.45);
  const p5 = Math.round(safeTotal * 0.25);

  return [
    {
      grade: 1,
      name: 'Sehr gut',
      colorBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      bgLight: 'bg-emerald-50/70',
      textColor: 'text-emerald-800',
      minPercent: 95,
      maxPercent: 100,
      minPoints: p1,
      maxPoints: safeTotal
    },
    {
      grade: 2,
      name: 'Gut',
      colorBadge: 'bg-teal-100 text-teal-900 border-teal-300',
      bgLight: 'bg-teal-50/70',
      textColor: 'text-teal-800',
      minPercent: 80,
      maxPercent: 94,
      minPoints: p2,
      maxPoints: Math.max(0, p1 - 1)
    },
    {
      grade: 3,
      name: 'Befriedigend',
      colorBadge: 'bg-blue-100 text-blue-900 border-blue-300',
      bgLight: 'bg-blue-50/70',
      textColor: 'text-blue-800',
      minPercent: 65,
      maxPercent: 79,
      minPoints: p3,
      maxPoints: Math.max(0, p2 - 1)
    },
    {
      grade: 4,
      name: 'Ausreichend',
      colorBadge: 'bg-amber-100 text-amber-900 border-amber-300',
      bgLight: 'bg-amber-50/70',
      textColor: 'text-amber-800',
      minPercent: 45,
      maxPercent: 64,
      minPoints: p4,
      maxPoints: Math.max(0, p3 - 1)
    },
    {
      grade: 5,
      name: 'Mangelhaft',
      colorBadge: 'bg-orange-100 text-orange-900 border-orange-300',
      bgLight: 'bg-orange-50/70',
      textColor: 'text-orange-800',
      minPercent: 25,
      maxPercent: 44,
      minPoints: p5,
      maxPoints: Math.max(0, p4 - 1)
    },
    {
      grade: 6,
      name: 'Ungenügend',
      colorBadge: 'bg-rose-100 text-rose-900 border-rose-300',
      bgLight: 'bg-rose-50/70',
      textColor: 'text-rose-800',
      minPercent: 0,
      maxPercent: 24,
      minPoints: 0,
      maxPoints: Math.max(0, p5 - 1)
    }
  ];
}

/**
 * Ermittelt für eine erreichte Punktzahl die Note nach HBS-Schlüssel.
 */
export function getGradeForPoints(earnedPoints: number, totalPoints: number): HbsGradeThreshold {
  const table = calculateHbsGradeTable(totalPoints);
  const roundedEarned = Math.round(earnedPoints);
  for (const row of table) {
    if (roundedEarned >= row.minPoints && roundedEarned <= row.maxPoints) {
      return row;
    }
  }
  return table[table.length - 1]; // Note 6
}
