import { Operator } from '../types/curriculum';

export const THUERINGEN_OPERATORS: Operator[] = [
  // --- AFB I: REPRODUKTION (Wissen & Wiedergeben) ---
  {
    id: 'nennen',
    name: 'Nennen / Aufzählen',
    afb: 'I',
    description: 'Elemente, Sachverhalte oder Begriffe ohne Erläuterung zielgerichtet zusammentragen.',
    signalWords: ['Nenne', 'Zähle auf', 'Gib an'],
    example: 'Nenne vier typische Merkmale einer Fabel.'
  },
  {
    id: 'beschreiben',
    name: 'Beschreiben / Wiedergeben',
    afb: 'I',
    description: 'Erscheinungen, Vorgänge oder Sachverhalte in eigenen Worten fachlich präzise darlegen.',
    signalWords: ['Beschreibe', 'Gib wieder', 'Schildere'],
    example: 'Beschreibe den Aufbau einer pflanzlichen Zelle anhand der Abbildung.'
  },
  {
    id: 'skizzieren',
    name: 'Skizzieren / Zeichnen',
    afb: 'I',
    description: 'Einen Sachverhalt oder ein Objekt übersichtlich grafisch oder schematisch darstellen.',
    signalWords: ['Skizziere', 'Zeichne', 'Stelle grafisch dar'],
    example: 'Skizziere den einfachen Stromkreis mit Batterie, Schalter und Glühlampe.'
  },
  {
    id: 'zuordnen',
    name: 'Zuordnen / Erkennen',
    afb: 'I',
    description: 'Begriffe, Phänomene oder Daten begründet bestehenden Kategorien zuschlagen.',
    signalWords: ['Ordne zu', 'Identifiziere', 'Markiere'],
    example: 'Ordne die Aggregatzustände den entsprechenden Temperaturkurven zu.'
  },

  // --- AFB II: REORGANISATION & TRANSFER (Verstehen & Anwenden) ---
  {
    id: 'erlaeutern',
    name: 'Erläutern / Erklären',
    afb: 'II',
    description: 'Sachverhalte in ihren Zusammenhängen, Ursachen und Gesetzmäßigkeiten nachvollziehbar machen.',
    signalWords: ['Erläutere', 'Erkläre', 'Veranschauliche'],
    example: 'Erkläre, warum Metalle elektrischen Strom besonders gut leiten.'
  },
  {
    id: 'vergleichen',
    name: 'Vergleichen / Gegenüberstellen',
    afb: 'II',
    description: 'Gemeinsamkeiten, Ähnlichkeiten und Unterschiede anhand relevanter Kriterien herausarbeiten.',
    signalWords: ['Vergleiche', 'Stelle gegenüber', 'Arbeite Unterschiede heraus'],
    example: 'Vergleiche die Regierungsformen der Antike mit unserer heutigen parlamentarischen Demokratie.'
  },
  {
    id: 'begruenden',
    name: 'Begründen / Belegen',
    afb: 'II',
    description: 'Aussagen, Thesen oder Rechenschritte durch Argumente, Kausalketten oder Textbelege stützen.',
    signalWords: ['Begründe', 'Belege anhand des Textes', 'Zeige auf'],
    example: 'Begründe, weshalb die Fotosynthese für das Leben auf der Erde unverzichtbar ist.'
  },
  {
    id: 'analysieren',
    name: 'Analysieren / Untersuchen',
    afb: 'II',
    description: 'Einen komplexen Gegenstand oder Text strukturiert in Bestandteile zerlegen und Funktionszusammenhänge aufdecken.',
    signalWords: ['Analysiere', 'Untersuche', 'Erschließe'],
    example: 'Analysiere das Verkaufsgespräch hinsichtlich verdeckter Überredungsstrategien.'
  },
  {
    id: 'einordnen',
    name: 'Einordnen / Anwenden',
    afb: 'II',
    description: 'Einen Sachverhalt in einen historischen, fachlichen oder übergeordneten Kontext stellen.',
    signalWords: ['Ordne ein', 'Wende an', 'Beziehe auf'],
    example: 'Ordne Martin Luthers 95 Thesen in die gesellschaftlichen Umbrüche des 16. Jahrhunderts ein.'
  },

  // --- AFB III: REFLEXION & URTEIL (Bewerten & Gestalten) ---
  {
    id: 'beurteilen',
    name: 'Beurteilen (Sachurteil)',
    afb: 'III',
    description: 'Den Stellenwert oder die Gültigkeit einer Aussage anhand sachlicher und fachlicher Kriterien prüfen.',
    signalWords: ['Beurteile', 'Prüfe', 'Fälle ein Sachurteil'],
    example: 'Beurteile die Wirksamkeit von Tempolimits für den Klimaschutz auf Basis der statistischen Daten.'
  },
  {
    id: 'bewerten',
    name: 'Bewerten (Werturteil / Ethisches Urteil)',
    afb: 'III',
    description: 'Unter Offenlegung eigener Wertmaßstäbe ein begründetes persönliches oder ethisches Urteil fällen.',
    signalWords: ['Bewerte', 'Nimm kritisch Stellung', 'Wäge ab'],
    example: 'Bewerte den Einsatz künstlicher Intelligenz zur automatischen Notengebung an Schulen.'
  },
  {
    id: 'stellung-nehmen',
    name: 'Stellung nehmen / Diskutieren',
    afb: 'III',
    description: 'Zu einer strittigen Problemstellung eine argumentativ abgewogene Position formulieren.',
    signalWords: ['Nimm Stellung', 'Diskutiere Pro und Kontra', 'Erörtere'],
    example: 'Nimm Stellung zu der Forderung nach einem generellen Smartphone-Verbot im Unterricht.'
  },
  {
    id: 'gestalten',
    name: 'Gestalten / Entwerfen (Kreativ-konstruktiv)',
    afb: 'III',
    description: 'Aus vorgegebenen Bausteinen ein eigenständiges Produkt (Text, Konzept, Szene, Lösung) erschaffen.',
    signalWords: ['Gestalte', 'Entwirf', 'Verfasse einen Gegentext', 'Entwickle eine Handlungsalternative'],
    example: 'Entwirf eine alternative Schluss-Szene für die Ballade, in der der Konflikt gewaltfrei gelöst wird.'
  }
];

export const OPERATOR_PRESETS = {
  standard: { afb1: 40, afb2: 40, afb3: 20 },
  basicPractice: { afb1: 60, afb2: 30, afb3: 10 },
  advancedExam: { afb1: 25, afb2: 45, afb3: 30 },
  projectReflective: { afb1: 20, afb2: 40, afb3: 40 },
};
