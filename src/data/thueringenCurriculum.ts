import { SchoolSubject, GradeLevel, DoubleGrade } from '../types/curriculum';

export function getDoubleGrade(grade: GradeLevel | string | number): DoubleGrade {
  if (grade === '5/6' || grade === 5 || grade === 6 || grade === '5' || grade === '6') return '5/6';
  if (grade === '7/8' || grade === 7 || grade === 8 || grade === '7' || grade === '8') return '7/8';
  if (grade === '9' || grade === 9) return '9';
  if (grade === '10' || grade === 10 || grade === '9/10') return '10';
  return '5/6';
}

export function getGradeLabel(grade: GradeLevel | string | number): string {
  const g = getDoubleGrade(grade);
  if (g === '5/6') return 'Klassenstufe 5/6 (Doppeljahrgang)';
  if (g === '7/8') return 'Klassenstufe 7/8 (Doppeljahrgang)';
  if (g === '9') return 'Klassenstufe 9 (Hauptschulabschluss)';
  if (g === '10') return 'Klassenstufe 10 (Realschulabschluss)';
  return `Klasse ${grade}`;
}

export const THUERINGEN_SUBJECTS: SchoolSubject[] = [
  {
    "id": "deutsch",
    "name": "Deutsch (Erprobungsfassung 2026)",
    "shortName": "DE",
    "category": "Kernfächer",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "BookOpen",
    "topics": [
      {
        "id": "de-56-1",
        "doubleGrade": "5/6",
        "title": "Märchen, Fabeln, Sagen & epische Kleinformen untersuchen und gestalten",
        "coreCompetencies": [
          "Typische Merkmale epicher Texte (Aufbau, Figuren, Moral) untersuchen und vergleichen",
          "Eigene kreative Texte (z. B. Märchen, Fabeln) nach Textmustern verfassen",
          "Wörtliche Rede, Zeitformen und Satzzeichen adressatengerecht anwenden"
        ]
      },
      {
        "id": "de-56-2",
        "doubleGrade": "5/6",
        "title": "Sachtexte erschließen, Gegenstände/Vorgänge beschreiben & informieren",
        "coreCompetencies": [
          "W-Fragen an Fachtexte stellen und Kerninformationen strukturiert entnehmen",
          "Gegenstands- und Vorgangsbeschreibungen sachlich und chronologisch präzise formulieren",
          "Nichtlineare Texte (Diagramme, Tabellen) beschreiben und Fachbegriffe nutzen"
        ]
      },
      {
        "id": "de-56-3",
        "doubleGrade": "5/6",
        "title": "Sprachreflexion: Wortarten, Satzglieder & Rechtschreibstrategien",
        "coreCompetencies": [
          "Wortarten (Verbformen, Substantiv, Adjektiv) flektieren und funktionale Bestimmungen vornehmen",
          "Satzglieder (Subjekt, Prädikat, Dativ-/Akkusativobjekt, adverbiale Bestimmungen) ermitteln",
          "Rechtschreibstrategien (Silbierung, Verlängern, Ableiten, Groß-/Kleinschreibung) anwenden"
        ]
      },
      {
        "id": "de-78-1",
        "doubleGrade": "7/8",
        "title": "Argumentieren & Debattieren: Lineare und dialektische Erörterung",
        "coreCompetencies": [
          "Thesen, Argumente und Belege (3-B-Schema) strukturiert formulieren und verknüpfen",
          "Eigene Positionen in Debatten sachlich vertreten und Einwände entkräften",
          "Schriftliche Stellungnahmen und Leserbriefe/Kommentare verfassen"
        ]
      },
      {
        "id": "de-78-2",
        "doubleGrade": "7/8",
        "title": "Balladen, lyrische Texte & Jugendromane erschließen",
        "coreCompetencies": [
          "Formale Gestaltungsmittel (Reim, Metrum, Strophenbau, sprachliche Bilder) analysieren",
          "Einen Jugendroman ganzheitlich lesen, Figurenbeziehungen und Handlungsmotive deuten",
          "Inhaltsangaben zu literarischen Texten sachlich im Präsens verfassen"
        ]
      },
      {
        "id": "de-78-3",
        "doubleGrade": "7/8",
        "title": "Medienwelten, Print- & Digitaltexte: Informationsprüfung und Berichterstattung",
        "coreCompetencies": [
          "Informationsgehalt und Seriosität digitaler Quellen und sozialer Netzwerke kritisch prüfen",
          "Journalistische Textsorten (Bericht, Reportage, Interview) vergleichen und produzieren",
          "Satzgefüge (Haupt- und Nebensätze, Konjunktionen, Relativsätze) und Zeichensetzung beherrschen"
        ]
      },
      {
        "id": "de-9-1",
        "doubleGrade": "9",
        "title": "Textgebundene Erörterung, Kommentar & Bewerbungskommunikation",
        "coreCompetencies": [
          "Pragmatische Texte analysieren und eine begründete Argumentation (Pro/Contra) ausführen",
          "Formale Kommunikationsformen für das Berufsleben (Bewerbungsschreiben, Lebenslauf) erstellen",
          "Gesprächsführung in Vorstellungsgesprächen und Diskussionen reflektieren"
        ]
      },
      {
        "id": "de-9-2",
        "doubleGrade": "9",
        "title": "Novelle, Kurzgeschichten & Drama der Aufklärung / Klassik",
        "coreCompetencies": [
          "Merkmale der Novelle und Kurzgeschichte herausarbeiten und interpretierende Ansätze formulieren",
          "Dramenszenen analysieren (Konfliktverlauf, Dialogführung, Regieanweisungen)",
          "Konjunktiv I (indirekte Rede) und Konjunktiv II im Textvergleich funktional nutzen"
        ]
      },
      {
        "id": "de-10-1",
        "doubleGrade": "10",
        "title": "Literarische Epochen im Überblick & komplexe Textinterpretation",
        "coreCompetencies": [
          "Epochenmerkmale (Aufklärung, Sturm und Drang, Klassik, Romantik, Moderne) an Werken nachweisen",
          "Mehrdimensionale literarische Charakteristiken und Werkinterpretationen verfassen",
          "Stilistische und rhetorische Mittel funktional in ihrer Wirkung begründen"
        ]
      },
      {
        "id": "de-10-2",
        "doubleGrade": "10",
        "title": "Sachtextanalyse, Medienkritik & Sprachwandel (Prüfungsvorbereitung Realschulabschluss)",
        "coreCompetencies": [
          "Komplexe Sachtexte, Essays und Glossen kriteriengeleitet analysieren und werten",
          "Sprachwandelphänomene (Anglizismen, Gendersprache, Jugendsprache) reflektieren",
          "Umfassende Vorbereitung auf die schriftliche und mündliche Realschulabschlussprüfung"
        ]
      }
    ]
  },
  {
    "id": "mathematik",
    "name": "Mathematik (Erprobungsfassung 2026)",
    "shortName": "MA",
    "category": "Kernfächer",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Calculator",
    "topics": [
      {
        "id": "ma-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Natürliche Zahlen, Größen & Daten erfassen",
        "coreCompetencies": [
          "Grundrechenarten, Rechengesetze (Kommutativ-, Assoziativ-, Distributivgesetz) anwenden",
          "Größeneinheiten (Länge, Masse, Zeit, Geld) umwandeln und in Sachkontexten berechnen",
          "Daten in Tabellen, Säulen- und Balkendiagrammen darstellen und interpretieren"
        ]
      },
      {
        "id": "ma-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Gebrochene Zahlen (Brüche & Dezimalbrüche) & Zuordnungen",
        "coreCompetencies": [
          "Bruchbegriff (Teil vom Ganzen, Erweitern, Kürzen, Vergleichen) verstehen und anwenden",
          "Grundrechenarten mit gemeinen Brüchen und endlichen Dezimalbrüchen ausführen",
          "Proportionale Zuordnungen tabellarisch und grafisch darstellen (Dreisatzverfahren)"
        ]
      },
      {
        "id": "ma-56-3",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Ebene Figuren, Körper, Dreiecke & Kreise",
        "coreCompetencies": [
          "Eigenschaften von Rechteck, Quadrat, Dreieck, Kreis, Quader und Würfel beschreiben",
          "Umfang und Flächeninhalt von Rechtecken sowie Oberflächeninhalt und Volumen von Quadern berechnen",
          "Winkel schätzen, messen und zeichnen; geometrische Konstruktionen durchführen"
        ]
      },
      {
        "id": "ma-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Rationale Zahlen, Terme & Lineare Gleichungen",
        "coreCompetencies": [
          "Rechnen mit positiven und negativen Zahlen (Zahlengerade, Rechenregeln, Betrag)",
          "Terme aufstellen, zusammenfassen, ausmultiplizieren und binomische Formeln anwenden",
          "Lineare Gleichungen durch Äquivalenzumformungen algebraisch und grafisch lösen"
        ]
      },
      {
        "id": "ma-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Prozent- und Zinsrechnung & Lineare Funktionen",
        "coreCompetencies": [
          "Grundwert, Prozentwert und Prozentsatz in lebensnahen Situationen berechnen",
          "Zinsrechnung (Jahreszinsen, Monatszinsen) verständig anwenden",
          "Lineare Funktionen der Form y = mx + n grafisch darstellen, Steigung und Achsenabschnitt interpretieren"
        ]
      },
      {
        "id": "ma-78-3",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Flächenberechnung, Satz des Pythagoras & Prismen",
        "coreCompetencies": [
          "Flächeninhalte von Dreiecken, Parallelogrammen, Trapezen und Kreisen berechnen",
          "Satz des Pythagoras in rechtwinkligen Dreiecken und Sachaufgaben anwenden",
          "Netze, Schrägbilder, Oberflächen und Volumina gerader Prismen und Zylinder bestimmen"
        ]
      },
      {
        "id": "ma-9-1",
        "doubleGrade": "9",
        "title": "Lernbereich Lineare Gleichungssysteme (LGS) & Ähnlichkeit",
        "coreCompetencies": [
          "Lineare Gleichungssysteme mit zwei Variablen (Einsetzungs-, Gleichsetzungs-, Additionsverfahren) lösen",
          "Ähnlichkeitssätze und Strahlensätze anwenden, Längenverhältnisse berechnen",
          "Text- und Modellierungsaufgaben mithilfe von LGS lösen"
        ]
      },
      {
        "id": "ma-9-2",
        "doubleGrade": "9",
        "title": "Lernbereiche Quadratische Funktionen & Quadratische Gleichungen",
        "coreCompetencies": [
          "Quadratische Funktionen (Normalparabel, Scheitelpunktform, allgemeine Form) analysieren",
          "Quadratische Gleichungen rechnerisch (p-q-Formel, Ausklammern, Wurzelziehen) und grafisch lösen",
          "Extremwertaufgaben und Schnittpunktberechnungen durchführen"
        ]
      },
      {
        "id": "ma-9-3",
        "doubleGrade": "9",
        "title": "Lernbereiche Zusammengesetzte Körper & Verknüpfte Ereignisse",
        "coreCompetencies": [
          "Pyramide, Kegel und Kugel berechnen (Oberfläche, Mantel, Volumen)",
          "Mehrstufige Zufallsversuche mit Baumdiagrammen darstellen",
          "Pfadadditions- und Pfadmultiplikationsregel zur Wahrscheinlichkeitsberechnung anwenden"
        ]
      },
      {
        "id": "ma-10-1",
        "doubleGrade": "10",
        "title": "Lernbereiche Potenzen, Wurzeln & Potenzfunktionen",
        "coreCompetencies": [
          "Potenzgesetze für ganzzahlige und rationale Exponenten anwenden",
          "Wurzelterme umformen und vereinfachen, wissenschaftliche Schreibweise nutzen",
          "Eigenschaften von Potenzfunktionen mit natürlichen und negativen Exponenten untersuchen"
        ]
      },
      {
        "id": "ma-10-2",
        "doubleGrade": "10",
        "title": "Lernbereiche Trigonometrie (Berechnungen am Dreieck & Winkelfunktionen)",
        "coreCompetencies": [
          "Sinus, Kosinus und Tangens im rechtwinkligen Dreieck definieren und berechnen",
          "Sinussatz und Kosinussatz in allgemeinen Dreiecken zur Vermessung einsetzen",
          "Verlauf und Eigenschaften der Sinusfunktion (Periode, Amplitude, Nullstellen) beschreiben"
        ]
      },
      {
        "id": "ma-10-3",
        "doubleGrade": "10",
        "title": "Lernbereiche Exponentielles Wachstum & Stochastik (Realschulabschluss)",
        "coreCompetencies": [
          "Lineares und exponentielles Wachstum unterscheiden (Wachstumsfaktor, Halbwertszeit, Zinseszins)",
          "Exponentialfunktionen grafisch darstellen und Modellierungsprobleme lösen",
          "Bedingte Wahrscheinlichkeiten anhand von Vierfeldertafeln ermitteln und bewerten"
        ]
      }
    ]
  },
  {
    "id": "englisch",
    "name": "Englisch (Erprobungsfassung 2026)",
    "shortName": "EN",
    "category": "Kernfächer",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Languages",
    "topics": [
      {
        "id": "en-56-1",
        "doubleGrade": "5/6",
        "title": "Themenfelder Alltagssituationen & Persönliches Umfeld (All about me, Family, School)",
        "coreCompetencies": [
          "Sich vorstellen, über Familie, Freunde, Hobbys, Haustiere und Schultag sprechen",
          "Simple Present, Present Progressive und bejahte/verneinte Aussagesätze anwenden",
          "Einfache Hör- und Lesetexte aus dem Lebensumfeld von Kindern in Großbritannien verstehen"
        ]
      },
      {
        "id": "en-56-2",
        "doubleGrade": "5/6",
        "title": "Themenfelder Wohnen, Freizeit, Feiertage & London im Überblick",
        "coreCompetencies": [
          "Zimmer, Kleidung, Essen und Tagesabläufe beschreiben",
          "Simple Past regelmäßiger und unregelmäßiger Verben zur Schilderung vergangener Ereignisse nutzen",
          "Sehenswürdigkeiten und typische Traditionen in London und Großbritannien erkunden"
        ]
      },
      {
        "id": "en-78-1",
        "doubleGrade": "7/8",
        "title": "Themenfelder Heranwachsen, Sport, Musik & Regionen im UK / USA",
        "coreCompetencies": [
          "Über Alltagsprobleme Jugendlicher, Sportarten, Musikgenres und Freundschaft diskutieren",
          "Present Perfect (mit since/for, just, already) und Past Progressive funktional anwenden",
          "Landeskundliche Einblicke in Regionen des Vereinigten Königreichs (z. B. Schottland, Wales) und die USA gewinnen"
        ]
      },
      {
        "id": "en-78-2",
        "doubleGrade": "7/8",
        "title": "Themenfelder Natur, Umwelt & Medien (Social Media, Modern Communication)",
        "coreCompetencies": [
          "Umweltthemen (Klimaschutz, Tierschutz, Nationalparks) und Mediennutzung beschreiben",
          "Conditional Clauses (Typ I und Typ II) zur Äußerung von Bedingungen und Wünschen verwenden",
          "Mediation: Deutsche Informationen auf Englisch sinngemäß zusammenfassen"
        ]
      },
      {
        "id": "en-9-1",
        "doubleGrade": "9",
        "title": "Themenfelder Schule, Ausbildung, Berufsfindung & World of Work",
        "coreCompetencies": [
          "Berufswünsche, Praktika, Bewerbungsschreiben und Vorstellungsgespräche auf Englisch bewältigen",
          "Passivformen (Simple Present, Simple Past) und Modalverben funktional nutzen",
          "Texte über Arbeitswelt und Ausbildungswege in englischsprachigen Ländern verstehen"
        ]
      },
      {
        "id": "en-9-2",
        "doubleGrade": "9",
        "title": "Themenfelder Gesellschaft, Werte, Normen & multikulturelle Gesellschaft (USA / UK)",
        "coreCompetencies": [
          "Über Menschenrechte, Diversität, Vorurteile und gesellschaftliches Engagement debattieren",
          "Indirect Speech (Reporting Statements and Questions) mit Zeitenverschiebung einsetzen",
          "Authentische Sachtexte und Kurzgeschichten analysieren und persönlich bewerten"
        ]
      },
      {
        "id": "en-10-1",
        "doubleGrade": "10",
        "title": "Themenfelder Globalisierung, Zukunftsvisionen & KI im Alltag",
        "coreCompetencies": [
          "Chancen und Risiken globaler Vernetzung, Digitalisierung und Künstlicher Intelligenz erörtern",
          "Conditional Clauses Typ III und fortgeschrittene Satzverknüpfungen beherrschen",
          "Strukturierte Essays, Comments und Buch-/Filmkritiken formal korrekt verfassen"
        ]
      },
      {
        "id": "en-10-2",
        "doubleGrade": "10",
        "title": "Themenfelder Geschichte, Politik & Kultur englischsprachiger Länder (Realschulabschluss)",
        "coreCompetencies": [
          "Historische Meilensteine (Civil Rights Movement, British Empire / Commonwealth) reflektieren",
          "Komplexe Lese- und Hörverstehensaufgaben auf B1/B1+-Niveau sicher lösen",
          "Gezielte Prüfungsvorbereitung auf mündliche und schriftliche Abschlussprüfungen"
        ]
      }
    ]
  },
  {
    "id": "mnt",
    "name": "Mensch-Natur-Technik (Erprobungsfassung 2026)",
    "shortName": "MNT",
    "category": "Naturwissenschaftlich-technisch",
    "allowedGrades": [
      "5/6"
    ],
    "icon": "Compass",
    "topics": [
      {
        "id": "mnt-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereich 2.2.1/2: Naturwissenschaftliche Arbeitsmethoden & Mensch – Natur – Technik",
        "coreCompetencies": [
          "Phänomene beobachten, Fragen formulieren und naturwissenschaftliche Experimente planen und durchführen",
          "Messgeräte sachgerecht handhaben (Thermometer, Lupe, Mikroskop, Waage) und Messdaten protokollieren",
          "Wechselwirkungen zwischen menschlichem Handeln, Naturphänomenen und technischer Umsetzung erkennen"
        ]
      },
      {
        "id": "mnt-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereich 2.2.3/4: Körper – Stoffe – Eigenschaften & Chemische Reaktionen",
        "coreCompetencies": [
          "Stoffe anhand ihrer spezifischen Eigenschaften (Aggregatzustand, Dichte, Löslichkeit, Brennbarkeit) untersuchen",
          "Gemische (heterogen/homogen) unterscheiden und Trennverfahren (Filtrieren, Eindampfen, Chromatografie) erproben",
          "Merkmale einer chemischen Reaktion (Stoffumwandlung, Energieumsatz) am Beispiel der Verbrennung beschreiben"
        ]
      },
      {
        "id": "mnt-56-3",
        "doubleGrade": "5/6",
        "title": "Lernbereich 2.2.5/6/7: Vielfalt der Lebewesen, Samenpflanzen & Wirbeltiere",
        "coreCompetencies": [
          "Bau und Funktion von Samenpflanzen (Wurzel, Stängel, Blatt, Blüte) und Fotosynthese in Grundzügen erklären",
          "Die 5 Wirbeltierklassen (Säugetiere, Vögel, Reptilien, Amphibien, Fische) anhand typischer Merkmale vergleichen",
          "Anpassungen von Tieren und Pflanzen an ihren Lebensraum (Wasser, Luft, Land) analysieren"
        ]
      },
      {
        "id": "mnt-56-4",
        "doubleGrade": "5/6",
        "title": "Lernbereich 2.2.8/9: Der Mensch – Gesunderhaltung & Bionik (vom Entdecken zum Erfinden)",
        "coreCompetencies": [
          "Bau und Funktion des Bewegungsapparats, der Atmung und des Herz-Kreislauf-Systems erläutern",
          "Grundlagen gesunder Ernährung und Lebensführung für das eigene Handeln ableiten",
          "Konstruktionsprinzipien aus der Natur auf technische Erfindungen (Bionik: Klettverschluss, Lotuseffekt) übertragen"
        ]
      }
    ]
  },
  {
    "id": "biologie",
    "name": "Biologie (Erprobungsfassung 2026)",
    "shortName": "BIO",
    "category": "Naturwissenschaftlich-technisch",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Leaf",
    "topics": [
      {
        "id": "bio-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.1.1: Wirbellose in ihren Lebensräumen",
        "coreCompetencies": [
          "Bau und Lebensweise ausgewählter Wirbelloser (Gliedertiere, Weichtiere, Ringelwürmer) untersuchen",
          "Insekten (Körperbau, Sinnesleistungen, vollständige/unvollständige Metamorphose) bestimmen",
          "Ökologische Bedeutung von Insekten (Bestäubung, Zersetzer, Nahrungskette) und Insektensterben bewerten"
        ]
      },
      {
        "id": "bio-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.1.2: Zellen als Lebensbausteine",
        "coreCompetencies": [
          "Präparate mikroskopieren, zeichnen und biologische Skizzen anfertigen",
          "Pflanzliche und tierische Zellen im Feinbau (Zellkern, Cytoplasma, Zellwand, Chloroplasten, Vakuole) vergleichen",
          "Einzeller und Vielzeller hinsichtlich Arbeitsteilung und Spezialisierung unterscheiden"
        ]
      },
      {
        "id": "bio-78-3",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.1.3: Biologie des Menschen (Verdauung, Blutkreislauf, Nervensystem)",
        "coreCompetencies": [
          "Aufbau und Funktion des menschlichen Verdauungssystems und Nährstoffaufnahme erklären",
          "Blutbestandteile, Immunsystem, Infektionskrankheiten und Schutzimpfungen erläutern",
          "Sinnesorgane, Reiz-Reaktions-Kette und Nervensystem in ihrer Funktion analysieren"
        ]
      },
      {
        "id": "bio-9-1",
        "doubleGrade": "9",
        "title": "Lernbereich 2.2.1.1/2: Vielfalt des Lebens & Stoff- und Energiewechsel der grünen Pflanzen",
        "coreCompetencies": [
          "Fotosynthese als grundlegenden Prozess des Lebens (chemische Gleichung, Licht-/Dunkelreaktion) erklären",
          "Bedeutung der Zellatmung für die Energiegewinnung in Pflanzen und Tieren darlegen",
          "Sporen- und Samenpflanzen im evolutionären Stammbaum systematisch einordnen"
        ]
      },
      {
        "id": "bio-9-2",
        "doubleGrade": "9",
        "title": "Lernbereich 2.2.1.3: Ökologie (Ökosystem Wald / Gewässer, Nahrungsketten & Stoffkreisläufe)",
        "coreCompetencies": [
          "Biotische und abiotische Umweltfaktoren (Temperatur, Licht, Konkurrenz, Räuber-Beute) analysieren",
          "Nahrungsnetze, Trophieebenen und den Kohlenstoff- bzw. Stickstoffkreislauf darstellen",
          "Menschliche Eingriffe in Ökosysteme und nachhaltigen Naturschutz bewerten"
        ]
      },
      {
        "id": "bio-10-1",
        "doubleGrade": "10",
        "title": "Lernbereich 2.3.1.1: Genetik (Klassische & Molekulare Genetik, Vererbung)",
        "coreCompetencies": [
          "Mendelsche Regeln anhand von Erbgängen (monohybrid, intermediär, dihybrid) anwenden",
          "Bau der DNA, Replikation und Proteinbiosynthese in Grundzügen erklären",
          "Erbkrankheiten beim Menschen, Mutationen und Chancen/Risiken der Gentechnik ethisch reflektieren"
        ]
      },
      {
        "id": "bio-10-2",
        "doubleGrade": "10",
        "title": "Lernbereich 2.3.1.2: Evolution (Evolutionsfaktoren, Stammesgeschichte & Hominisation)",
        "coreCompetencies": [
          "Evolutionsbelege (Fossilien, Homologien, Analogien, Rudimente, Atavismen) analysieren",
          "Evolutionstheorie nach Charles Darwin (Mutation, Rekombination, Selektion, Isolation) erläutern",
          "Die Stammesentwicklung des Menschen (Hominisation) im biologischen Kontext rekonstruieren"
        ]
      }
    ]
  },
  {
    "id": "chemie",
    "name": "Chemie (Erprobungsfassung 2026)",
    "shortName": "CH",
    "category": "Naturwissenschaftlich-technisch",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "FlaskConical",
    "topics": [
      {
        "id": "ch-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1.1/2: Chemie als Naturwissenschaft & Atombau – Periodensystem (PSE)",
        "coreCompetencies": [
          "Sicherheitsregeln beim Experimentieren mit Chemikalien und Gefahrstoffkennzeichnung einhalten",
          "Kern-Hülle-Modell (Protonen, Neutronen, Elektronen) und Schalenmodell (Bohr) anwenden",
          "Zusammenhang zwischen Atombau und Stellung der Elemente im Periodensystem (PSE) erklären"
        ]
      },
      {
        "id": "ch-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1.3/4: Molekülsubstanzen, Metalle & Chemische Bindungen",
        "coreCompetencies": [
          "Elektronenpaarbindung (kovalente Bindung) und Ionenbindung anhand der Oktettregel unterscheiden",
          "Eigenschaften von Metallen durch metallische Bindung und Elektronengasmodell begründen",
          "Chemische Reaktionsgleichungen quantitativ und qualitativ richtig aufstellen und ausgleichen"
        ]
      },
      {
        "id": "ch-78-3",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1.5/6/7/8: Säuren, Basen, Neutralisation & Salze",
        "coreCompetencies": [
          "Wässrige saure und basische Lösungen mithilfe des pH-Wertes und Indikatoren nachweisen",
          "Neutralisationsreaktionen experimentell durchführen und als Protonenübergang beschreiben",
          "Salzbildung, Ionengitter, Eigenschaften von Salzen und deren Verwendung im Alltag untersuchen"
        ]
      },
      {
        "id": "ch-9-1",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.1.1/2: Systematisierung & Kohlenstoff und seine Oxide",
        "coreCompetencies": [
          "Modifikationen des Kohlenstoffs (Graphit, Diamant, Fullerene) und ihre Strukturen vergleichen",
          "Kohlenstoffdioxid und Kohlenstoffmonoxid (Bildung, Eigenschaften, Nachweis, Treibhauseffekt) untersuchen",
          "Bedeutung des Kohlenstoffkreislaufs für Klima und Erdsystem analysieren"
        ]
      },
      {
        "id": "ch-9-2",
        "doubleGrade": "9",
        "title": "Lernbereich 2.2.1.3: Kohlenwasserstoffe (Alkane, Alkene, Alkine)",
        "coreCompetencies": [
          "Homologe Reihe der Alkane (Methan bis Dekan), Nomenklatur nach IUPAC und Summen-/Strukturformeln",
          "Verbrennungsreaktionen und Substitution bei Alkanen formulieren",
          "Ungesättigte Kohlenwasserstoffe (Alkene, Alkine), Additionsreaktionen und Entstehung fossiler Brennstoffe"
        ]
      },
      {
        "id": "ch-10-1",
        "doubleGrade": "10",
        "title": "Lernbereich 2.3.1.1: Sauerstoffhaltige Derivate (Alkohole & Carbonsäuren)",
        "coreCompetencies": [
          "Homologe Reihe der Alkanole (Methanol, Ethanol), funktionelle Hydroxylgruppe und Wasserstoffbrücken",
          "Carbonsäuren (Methansäure, Ethansäure), Carboxylgruppe, Dissoziation und Esterbildung (Kondensation)",
          "Alkohole und Säuren in Industrie, Lebensmitteln und Alltag (Genussmittel, Essig, Fette)"
        ]
      },
      {
        "id": "ch-10-2",
        "doubleGrade": "10",
        "title": "Lernbereich 2.3.1.2/3: Ammoniak, Reaktionsverlauf & Prüfungsvorbereitung Realschulabschluss",
        "coreCompetencies": [
          "Ammoniaksynthese (Haber-Bosch-Verfahren), chemisches Gleichgewicht und technische Bedeutung",
          "Kinetik und Energetik: Reaktionsgeschwindigkeit, Katalysatoren, Aktivierungsenergie und Enthalpie",
          "Systematische Wiederholung der anorganischen und organischen Chemie für den Realschulabschluss"
        ]
      }
    ]
  },
  {
    "id": "physik_astronomie",
    "name": "Physik und Astronomie (Erprobungsfassung 2026)",
    "shortName": "PH/AST",
    "category": "Naturwissenschaftlich-technisch",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Zap",
    "topics": [
      {
        "id": "ph-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1/2: Physik & Astronomie kennenlernen & Lichtausbreitung / Bildentstehung",
        "coreCompetencies": [
          "Physikalische Größen, Messen, Dokumentieren und Fehlerbetrachtung beherrschen",
          "Lichtquellen, geradlinige Lichtausbreitung, Schattenbildung und Reflexionsgesetz am ebenen Spiegel",
          "Lichtbrechung, optische Linsen und Bildkonstruktion beim Auge und optischen Geräten (Fernrohr, Mikroskop)"
        ]
      },
      {
        "id": "ph-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.3/5: Erde, Mond, Sonnensystem I & Raumfahrt",
        "coreCompetencies": [
          "Bewegungen von Erde und Mond erklären (Tag/Nacht, Jahreszeiten, Mondphasen, Finsternisse)",
          "Aufbau des Planetensystems, Planetenmerkmale und Gravitationswirkung beschreiben",
          "Meilensteine der Raumfahrt, Satellitenbahnen und Erderkundung aus dem Weltall erfassen"
        ]
      },
      {
        "id": "ph-78-3",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.4/6: Energie, Energieerhaltung & Wärmelehre",
        "coreCompetencies": [
          "Energieformen, Energiewandler und das Gesetz von der Erhaltung der Energie begreifen",
          "Temperatur, innere Energie, spezifische Wärmekapazität und Wärmeübertragung (Leitung, Strömung, Strahlung)",
          "Aggregatzustandsänderungen und thermische Ausdehnung in Natur und Technik berechnen"
        ]
      },
      {
        "id": "ph-9-1",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.1/2: Elektrizitätslehre, Stromkreise & Magnetismus",
        "coreCompetencies": [
          "Stromstärke, Spannung und elektrischer Widerstand (Ohmsches Gesetz: R = U / I) messen und berechnen",
          "Reihen- und Parallelschaltung von Bauelementen analysieren und Gesetze anwenden",
          "Magnetische Felder, Elektromagnete und die Lorentzkraft in Motoren untersuchen"
        ]
      },
      {
        "id": "ph-9-2",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.3: Versorgung mit elektrischer Energie (Induktion, Generator, Halbleiter)",
        "coreCompetencies": [
          "Elektromagnetische Induktion und Funktionsweise des Generators erklären",
          "Transformator, Hochspannungsnetz und elektrische Energieverteilung berechnen",
          "Halbleiterbauelemente, Dioden, Solarzellen und erneuerbare Energiewandlung analysieren"
        ]
      },
      {
        "id": "ph-9-3",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.4/5: Bewegungen, Kräfte & Sonnensystem II",
        "coreCompetencies": [
          "Gleichförmige und beschleunigte Bewegungen grafisch darstellen (s-t- und v-t-Diagramme)",
          "Newtons Gesetze (Trägheit, Kraftwirkung F = m * a, Wechselwirkung) und Reibungskräfte",
          "Gravitationsgesetz, Planetenbahnen (Keplersche Gesetze) und Himmelsmechanik"
        ]
      },
      {
        "id": "ph-10-1",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.1: Bedeutung der Kernphysik & Radioaktivität",
        "coreCompetencies": [
          "Aufbau des Atomkerns, Isotope, Alpha-, Beta- und Gammastrahlung unterscheiden",
          "Halbwertszeit, biologische Strahlenwirkung, Strahlenschutz und Kernzerfallsreihen analysieren",
          "Kernspaltung, Kernkraftwerke und nukleare Entsorgung sachlich beurteilen"
        ]
      },
      {
        "id": "ph-10-2",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.2: Objekte und Strukturen im Kosmos (Sonne, Sterne & Universum)",
        "coreCompetencies": [
          "Physikalische Eigenschaften der Sonne (Kernfusion, Strahlung) und Lebenszyklus von Sternen erläutern",
          "Milchstraße, Galaxien, Schwarze Löcher und kosmische Entfernungen untersuchen",
          "Urknalltheorie, Expansion des Kosmos und moderne kosmologische Weltbilder reflektieren"
        ]
      },
      {
        "id": "ph-10-3",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.3/4: Schwingungen, Wellen & Elektromagnetisches Spektrum",
        "coreCompetencies": [
          "Kenngrößen mechanischer Schwingungen (Periodendauer, Frequenz, Amplitude) bestimmen",
          "Wellenphänomene (Ausbreitung, Reflexion, Beugung, Interferenz) experimentell erfassen",
          "Das elektromagnetische Spektrum (Funk, Infrarot, Licht, UV, Röntgen) und Strahlungshaushalt der Erde verstehen"
        ]
      }
    ]
  },
  {
    "id": "werken",
    "name": "Technisches Werken (Erprobungsfassung 2026)",
    "shortName": "WER",
    "category": "Naturwissenschaftlich-technisch",
    "allowedGrades": [
      "5/6"
    ],
    "icon": "Wrench",
    "topics": [
      {
        "id": "wer-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereich 3.1: Herstellung & Bewertung von Gebrauchsgegenständen aus Holz / Papier",
        "coreCompetencies": [
          "Eigenschaften von Holzwerkstoffen und Papier sachgerecht bestimmen",
          "Messen, Anreißen, Sägen, Feilen und Schleifen mit Handwerkzeugen fachgerecht ausführen",
          "Arbeitsschutz- und Unfallverhütungsregeln in der Werkstatt konsequent beachten"
        ]
      },
      {
        "id": "wer-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereich 3.2: Konstruktion & Fertigung aus mindestens zwei Werkstoffen (Holz/Kunststoff/Metall)",
        "coreCompetencies": [
          "Technische Skizzen und einfache Baupläne lesen und anfertigen",
          "Fügeverfahren (Leimen, Schrauben, Nieten, Stecken) werkstoffgerecht auswählen",
          "Die Funktionalität, Stabilität und Formgebung des hergestellten Produkts kriteriengeleitet bewerten"
        ]
      },
      {
        "id": "wer-56-3",
        "doubleGrade": "5/6",
        "title": "Lernbereich 3.3: Modelle zur Wandlung & Übertragung von Bewegung und Kräften",
        "coreCompetencies": [
          "Einfache Maschinen und Mechanismen (Hebel, Rollen, Zahnräder, Kurbeln) analysieren",
          "Funktionsmodelle montieren und mechanische Kraftübertragung demonstrieren",
          "Technische Lösungen auf Alltagsobjekte und historische Werkzeuge übertragen"
        ]
      }
    ]
  },
  {
    "id": "informatik_medien",
    "name": "Medienbildung und Informatik (Erprobungsfassung 2026)",
    "shortName": "MBI",
    "category": "Naturwissenschaftlich-technisch",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Laptop",
    "topics": [
      {
        "id": "mbi-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.1/2/3: Medienalltag reflektieren, Informatiksysteme & Recherche I",
        "coreCompetencies": [
          "Eigenes Mediennutzungsverhalten reflektieren und Regeln für die Gerätenutzung einhalten",
          "Grundlegende Hardware- und Softwarekomponenten (Eingabe, Verarbeitung, Ausgabe) benennen",
          "Kindgerechte Suchmaschinen zielgerichtet nutzen und Quellen auf Glaubwürdigkeit prüfen"
        ]
      },
      {
        "id": "mbi-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.4/5/6: Texte gestalten, Bildbearbeitung & Digitale Präsentationen",
        "coreCompetencies": [
          "Texte mit Formatierungen, Tabellen und Grafiken ansprechend strukturieren",
          "Digitale Bilder zuschneiden, skalieren und Urheberrechte/Bildrechte beachten",
          "Folienpräsentationen mit klaren Visualisierungen und Animationen erstellen und vortragen"
        ]
      },
      {
        "id": "mbi-56-3",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.7/8: Digitale Kommunikation & Algorithmische Grundkonzepte",
        "coreCompetencies": [
          "Verhaltensregeln im Netz (Netiquette, Schutz persönlicher Daten) anwenden",
          "Abläufe mit visuellen Programmierumgebungen (z. B. Scratch) planen und umsetzen",
          "Kontrollstrukturen (Schleifen, Verzweigungen) in Algorithmen fehlerfrei verwenden"
        ]
      },
      {
        "id": "mbi-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.2.1: Daten tabellarisch strukturieren & auswerten (Tabellenkalkulation)",
        "coreCompetencies": [
          "Tabellen mit Formeln (SUMME, MITTELWERT, WENN) dynamisch aufbauen",
          "Messwerte und Statistiken in Diagrammtypen (Säulen-, Linien-, Kreisdiagramm) visualisieren",
          "Große Datensätze filtern, sortieren und mathematisch-analytisch interpretieren"
        ]
      },
      {
        "id": "mbi-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.2.2/3/4: Social Media, Medienrecht & Vertiefte Informationsprüfung",
        "coreCompetencies": [
          "Wirkungsmechanismen von Social Media (Algorithmen, Filterblasen, Fake News, Cybermobbing) dekonstruieren",
          "Urheberrecht, Creative-Commons-Lizenzen und Datenschutz-Grundverordnung (DSGVO) einhalten",
          "Digitale Faktenprüfung mit mehreren Quellen und Reverse-Image-Search durchführen"
        ]
      },
      {
        "id": "mbi-78-3",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.2.5/6: Physical Computing & Daten strukturieren (Datenbanken)",
        "coreCompetencies": [
          "Mikrocontroller (z. B. Calliope mini, micro:bit) mit Sensoren und Aktoren programmieren",
          "Aufbau relationaler Datenbanken (Tabellen, Primärschlüssel, Datentypen) verstehen",
          "Einfache Datenbankabfragen (SELECT, FROM, WHERE) konzipieren"
        ]
      },
      {
        "id": "mbi-910-1",
        "doubleGrade": "9",
        "title": "Textbasierte Programmierung, Vernetzte Systeme & Cyber-Sicherheit",
        "coreCompetencies": [
          "Algorithmen in einer textuellen Programmiersprache (z. B. Python) entwickeln",
          "Netzwerkarchitekturen (Client-Server, IP-Adressen, Routing, DNS) erläutern",
          "Kryptografie, Verschlüsselungsverfahren und Schutz vor Schadsoftware anwenden"
        ]
      },
      {
        "id": "mbi-910-2",
        "doubleGrade": "10",
        "title": "Künstliche Intelligenz, Automatisierung & Gesellschaft im digitalen Wandel",
        "coreCompetencies": [
          "Funktionsweise maschinellen Lernens und generativer KI (Prompts, neuronale Netze) verstehen",
          "Ethische Fragestellungen zu KI, Datenschutz und Automatisierung der Arbeitswelt erörtern",
          "Ein komplexes Software- oder Medienprojekt selbstständig planen, realisieren und dokumentieren"
        ]
      }
    ]
  },
  {
    "id": "geschichte",
    "name": "Geschichte (Erprobungsfassung 2026)",
    "shortName": "GE",
    "category": "Gesellschaftswissenschaftlich",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Hourglass",
    "topics": [
      {
        "id": "ge-56-1",
        "doubleGrade": "5/6",
        "title": "Vor- und Frühgeschichte: Altsteinzeit, Jungsteinzeit & Metallzeiten",
        "coreCompetencies": [
          "Lebensformen von Jägern und Sammlern mit sesshaften Ackerbauern vergleichen (Neolithische Revolution)",
          "Archäologische Quellen (Werkzeuge, Höhlenmalerei, Gräberfunde) untersuchen und deuten",
          "Bedeutung der Metallverarbeitung (Bronze, Eisen) für gesellschaftliche Arbeitsteilung beschreiben"
        ]
      },
      {
        "id": "ge-56-2",
        "doubleGrade": "5/6",
        "title": "Frühe Hochkulturen: Altes Ägypten – Leben am Nil",
        "coreCompetencies": [
          "Merkmale einer frühen Hochkultur (Schrift, Religion, Gesellschaftspyramide, Verwaltung) analysieren",
          "Bedeutung des Nils für Landwirtschaft, Vorratshaltung und Technik (Schaduff) darlegen",
          "Rolle des Pharaos als Herrscher und Gottessohn sowie Jenseitsvorstellungen erläutern"
        ]
      },
      {
        "id": "ge-56-3",
        "doubleGrade": "5/6",
        "title": "Die Antike: Griechenland (Polis, Demokratie) & Römisches Reich",
        "coreCompetencies": [
          "Entstehung der attischen Demokratie und olympische Spiele in der griechischen Polis untersuchen",
          "Vom Stadtstaat zum Römischen Weltreich (Republik, Senat, Caesar, Kaiser Augustus) nachvollziehen",
          "Alltagsleben im alten Rom (Familie, Sklaven, Gladiatorenkämpfe, Romanisierung in Europa) beschreiben"
        ]
      },
      {
        "id": "ge-78-1",
        "doubleGrade": "7/8",
        "title": "Europa im Mittelalter: Herrschaft, Rittertum, Kirche & Städte",
        "coreCompetencies": [
          "Feudalismus und Lehnswesen als mittelalterliche Herrschaftsform erklären",
          "Lebenswelten (Burg und Rittertum, Kloster und Mönchtum, Bauerndorf und Grundherrschaft) vergleichen",
          "Aufstieg der mittelalterlichen Stadt (Bürger, Zünfte, Markt, Stadtrecht) untersuchen"
        ]
      },
      {
        "id": "ge-78-2",
        "doubleGrade": "7/8",
        "title": "Umbruch zur Neuzeit: Entdeckungen, Renaissance, Humanismus & Reformation",
        "coreCompetencies": [
          "Wandel des Welt- und Menschenbildes durch Renaissance, Humanismus und Buchdruck analysieren",
          "Europäische Expansion, Entdeckungsfahrten und Folgen für indigene Bevölkerungen darlegen",
          "Reformation (Martin Luther in Thüringen: Wittenberg, Wartburg), Bauernkrieg und 30-jähriger Krieg erfassen"
        ]
      },
      {
        "id": "ge-78-3",
        "doubleGrade": "7/8",
        "title": "Das 19. Jahrhundert: Französische Revolution, Industrialisierung & Kaiserreich",
        "coreCompetencies": [
          "Ursachen, Phasen und Menschenrechte der Französischen Revolution 1789 erläutern",
          "Industrielle Revolution in England und Deutschland sowie die Soziale Frage untersuchen",
          "Revolution von 1848/49, Nationalstaatsbildung 1871 und Gesellschaft im Deutschen Kaiserreich analysieren"
        ]
      },
      {
        "id": "ge-9-1",
        "doubleGrade": "9",
        "title": "Erster Weltkrieg & Die Weimarer Republik (Chancen und Belastungen der Demokratie)",
        "coreCompetencies": [
          "Ursachen, Bündnissysteme, moderner industrialisierter Krieg und Folgen des Ersten Weltkriegs 1914–1918",
          "Entstehung der Weimarer Republik, Verfassung von 1919 und Krisenjahre bis 1923 analysieren",
          "Weltwirtschaftskrise 1929 und Gründe für das Scheitern der ersten deutschen Demokratie darlegen"
        ]
      },
      {
        "id": "ge-9-2",
        "doubleGrade": "9",
        "title": "Nationalsozialismus & Zweiter Weltkrieg: Diktatur, Terror, Holocaust & Neuanfang 1945",
        "coreCompetencies": [
          "NS-Ideologie (Rassismus, Antisemitismus, Führerprinzip, Lebensraumideologie) analysieren",
          "Etablierung der Diktatur (Gleichschaltung, Verfolgung, Konzentrationslager wie Buchenwald)",
          "Zweiter Weltkrieg, Shoah/Holocaust und die bedingungslose Kapitulation 1945 untersuchen"
        ]
      },
      {
        "id": "ge-10-1",
        "doubleGrade": "10",
        "title": "Der Kalte Krieg & Deutschland im Systemkonflikt (BRD und DDR im Vergleich)",
        "coreCompetencies": [
          "Blockbildung (USA vs. UdSSR), atomares Wettrüsten, Krisen (Kuba, Korea) und Entspannungspolitik",
          "Gründung zweier deutscher Staaten 1949, Mauerbau 1961 und das Leben in der DDR vs. BRD",
          "Widerstand in der DDR (17. Juni 1953, Bürgerrechtsbewegung) erfassen"
        ]
      },
      {
        "id": "ge-10-2",
        "doubleGrade": "10",
        "title": "Friedliche Revolution 1989, Deutsche Einheit & Herausforderungen im 21. Jahrhundert",
        "coreCompetencies": [
          "Ursachen und Verlauf der Friedlichen Revolution 1989 (Montagsdemonstrationen, Grenzöffnung)",
          "Der Weg zur deutschen Wiedervereinigung am 3. Oktober 1990 und Vereinigungsprozess analysieren",
          "Neue Weltordnung, europäische Integration und historische Konflikte im 21. Jahrhundert reflektieren"
        ]
      }
    ]
  },
  {
    "id": "geografie",
    "name": "Geografie (2012)",
    "shortName": "GEO",
    "category": "Gesellschaftswissenschaftlich",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Globe",
    "topics": [
      {
        "id": "geo-56-1",
        "doubleGrade": "5/6",
        "title": "Orientierung im Raum, Kartenarbeit & Die Erde als Planet",
        "coreCompetencies": [
          "Den Atlas als Arbeitsmittel nutzen, Signaturen lesen und Maßstabsberechnungen durchführen",
          "Das Gradnetz der Erde (Äquator, Nullmeridian, Längen- und Breitengrade) anwenden",
          "Gestalt der Erde, Erdrotation und Beleuchtungszonen erklären"
        ]
      },
      {
        "id": "geo-56-2",
        "doubleGrade": "5/6",
        "title": "Deutschland & Thüringen: Naturräume, Topografie & Wirtschaftsstrukturen",
        "coreCompetencies": [
          "Großlandschaften Deutschlands (Norddeutsches Tiefland, Mittelgebirge, Alpenvorland, Alpen) charakterisieren",
          "Thüringer Landschaften (Thüringer Wald, Thüringer Becken), Flüsse und Städte topografisch einordnen",
          "Landwirtschaftliche und industrielle Raumnutzung in Deutschland vergleichen"
        ]
      },
      {
        "id": "geo-56-3",
        "doubleGrade": "5/6",
        "title": "Europa: Landschaften, Klimate & Staaten im Überblick",
        "coreCompetencies": [
          "Teilräume Europas (Nord-, West-, Süd-, Mittel- und Osteuropa) topografisch zuordnen",
          "Klima- und Vegetationsunterschiede vom Mittelmeer bis nach Skandinavien beschreiben",
          "Europäische Hauptstädte, Meere und Gebirgszüge sicher auf stummen Karten lokalisieren"
        ]
      },
      {
        "id": "geo-78-1",
        "doubleGrade": "7/8",
        "title": "Die Erde als Naturraum: Klima- und Vegetationszonen der Erde",
        "coreCompetencies": [
          "Klimadiagramme nach Walter/Lieth selbstständig zeichnen, auswerten und vergleichen",
          "Vegetationszonen (Tropischer Regenwald, Savanne, Wüste, Taiga, Tundra) charakterisieren",
          "Passatzirkulation, Monsun und maritime vs. kontinentale Klimate erklären"
        ]
      },
      {
        "id": "geo-78-2",
        "doubleGrade": "7/8",
        "title": "Endogene und exogene Kräfte der Erde (Plattentektonik, Vulkanismus, Erdbeben)",
        "coreCompetencies": [
          "Die Theorie der Plattentektonik (Subduktion, Spreizungszonen, Transformstörungen) erläutern",
          "Ursachen und Auswirkungen von Vulkanismus, Erdbeben und Tsunamis untersuchen",
          "Formung der Erdoberfläche durch Wasser, Wind und Eis (Glaziale Serie, Verwitterung) beschreiben"
        ]
      },
      {
        "id": "geo-78-3",
        "doubleGrade": "7/8",
        "title": "Asien und Afrika: Naturräume, Ressourcen & Entwicklungsperspektiven",
        "coreCompetencies": [
          "Ost- und Südostasien als dynamische Wirtschaftsräume und Bevölkerungszentren analysieren",
          "Naturräumliche Potenziale und Herausforderungen in Afrika (Sahelzone, Desertifikation) erfassen",
          "Ökologische Folgen menschlicher Eingriffe (Abholzung des Regenwaldes, Überweidung) bewerten"
        ]
      },
      {
        "id": "geo-9-1",
        "doubleGrade": "9",
        "title": "Nordamerika: Naturraum, Wirtschaftsmetropolen & Landwirtschaft",
        "coreCompetencies": [
          "Naturräumliche Großgliederung der USA und Kanadas (Kordilleren, Great Plains, Appalachen) analysieren",
          "Landwirtschaftliche Gürtel (Belts) und agrobusiness-Strukturen untersuchen",
          "Megalopolen (z. B. Boswash) und urbane Ballungsräume charakterisieren"
        ]
      },
      {
        "id": "geo-9-2",
        "doubleGrade": "9",
        "title": "Südamerika & Globale Entwicklungsdisparitäten (Eine Welt)",
        "coreCompetencies": [
          "Nutzungskonflikte im Amazonasbecken (Regenwaldabholzung, Sojaanbau, Rinderzucht) beurteilen",
          "Entwicklungsunterschiede anhand von Indikatoren (HDI, BIP, Säuglingssterblichkeit) vergleichen",
          "Zusammenarbeit in der Entwicklungspolitik und fairen Handel reflektieren"
        ]
      },
      {
        "id": "geo-10-1",
        "doubleGrade": "10",
        "title": "Globalisierung & weltwirtschaftliche Verflechtungen",
        "coreCompetencies": [
          "Merkmale, Triebkräfte und Dimensionen der Globalisierung (Handel, Finanzen, Kommunikation) untersuchen",
          "Standortfaktoren transnationaler Konzerne (Global Player) und globale Lieferketten analysieren",
          "Chancen und Risiken der weltwirtschaftlichen Arbeitsteilung für Industrie- und Entwicklungsländer werten"
        ]
      },
      {
        "id": "geo-10-2",
        "doubleGrade": "10",
        "title": "Globale Zukunftsaufgaben: Klimawandel, Ressourcen & Megastädte (Abschlussprüfung)",
        "coreCompetencies": [
          "Ursachen und globale Folgen des anthropogenen Klimawandels anhand von Modellen beurteilen",
          "Ressourcenkonflikte um Wasser, Energie und Rohstoffe analysieren und nachhaltige Konzepte entwerfen",
          "Megastädte des 21. Jahrhunderts (Urbanisierung, Slumbildung, nachhaltige Stadtentwicklung) untersuchen"
        ]
      }
    ]
  },
  {
    "id": "sozialkunde",
    "name": "Sozialkunde (2012)",
    "shortName": "SK",
    "category": "Gesellschaftswissenschaftlich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Users",
    "topics": [
      {
        "id": "sk-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.1: Politik in meiner Lebenswelt (Schule & Gemeinde)",
        "coreCompetencies": [
          "Formen von Mitbestimmung an der Schule (Klassensprecher, Schülerrat, Schulkonferenz) anwenden",
          "Aufgaben der Kommunalpolitik (Gemeinderat, Bürgermeister, kommunaler Haushalt) untersuchen",
          "Möglichkeiten von Kinder- und Jugendbeteiligung vor Ort erproben"
        ]
      },
      {
        "id": "sk-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.2: Leben in der Gesellschaft (Familie, Jugendkultur & Medien)",
        "coreCompetencies": [
          "Familienformen und soziale Rollenbilder im gesellschaftlichen Wandel vergleichen",
          "Einfluss von Peergroups und Jugendkulturen auf die Identitätsfindung reflektieren",
          "Medienwirkung, Meinungsbildung und Cybermobbing kritisch diskutieren"
        ]
      },
      {
        "id": "sk-9-1",
        "doubleGrade": "9",
        "title": "Lernbereich 2.2.1: Demokratie in der Bundesrepublik Deutschland (Politisches System)",
        "coreCompetencies": [
          "Die Verfassungsorgane der Bundesrepublik (Bundestag, Bundesrat, Bundesregierung, Bundespräsident, BVerfG) analysieren",
          "Wahlrechtsgrundsätze (allgemein, unmittelbar, frei, gleich, geheim) und Erst-/Zweitstimmensystem verstehen",
          "Gewaltenteilung und Grundprinzipien des Grundgesetzes (Art. 20 GG) erläutern"
        ]
      },
      {
        "id": "sk-9-2",
        "doubleGrade": "9",
        "title": "Lernbereich 2.2.2: Gesellschaft und Politik im Wandel (Sozialstruktur & Partizipation)",
        "coreCompetencies": [
          "Demografischen Wandel und seine Auswirkungen auf Renten- und Gesundheitssysteme analysieren",
          "Rolle von Parteien, Verbänden, Bürgerinitiativen und Medien in der politischen Willensbildung",
          "Gefahren für die Demokratie durch Extremismus, Populismus und Desinformation erkennen"
        ]
      },
      {
        "id": "sk-10-1",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.1/2: Rechtsstaat, Sozialstaat & Verfassungsschutz (Prüfungsvorbereitung)",
        "coreCompetencies": [
          "Grundrechte, Wehrhafte Demokratie und Aufgaben des Bundesverfassungsgerichts vertiefen",
          "Prinzipien des Sozialstaats (Solidaritätsprinzip, Subsidiaritätsprinzip) und soziale Sicherungssysteme beurteilen",
          "Aktuelle rechtspolitische und gesellschaftliche Debatten kriterienorientiert erörtern"
        ]
      },
      {
        "id": "sk-10-2",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.3/4: Europäische Union & Internationale Friedenssicherung",
        "coreCompetencies": [
          "Institutionen der Europäischen Union (EU-Kommission, EU-Parlament, Ministerrat) und Gesetzgebung nachvollziehen",
          "Vor- und Nachteile der europäischen Integration (Freizügigkeit, Binnenmarkt, Währungsunion) abwägen",
          "Rolle der Vereinten Nationen (UN) und NATO bei der Konfliktprävention und Friedenssicherung bewerten"
        ]
      }
    ]
  },
  {
    "id": "wrt",
    "name": "Wirtschaft-Recht-Technik (2012)",
    "shortName": "WRT",
    "category": "Gesellschaftswissenschaftlich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Briefcase",
    "topics": [
      {
        "id": "wrt-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1/2/3/4: Wirtschaftliches Handeln, Geld, Markt & Verbraucherschutz",
        "coreCompetencies": [
          "Bedürfnisse, Güterarten und das ökonomische Prinzip (Minimal-/Maximalprinzip) unterscheiden",
          "Funktionen des Geldes, Girokonto und Zahlungsverkehr (bar, unbar, digital) sicher nutzen",
          "Marktmechanismus (Angebot, Nachfrage, Preisbildung) und Verbraucherrechte anwenden"
        ]
      },
      {
        "id": "wrt-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.5: Berufsorientierung – Berufswege und Lebensplanung (1)",
        "coreCompetencies": [
          "Eigene Interessen, Fähigkeiten und Stärken für die Berufswahl reflektieren",
          "Berufsfelder, Ausbildungswege und Informationsquellen (z. B. Berufsberatung, BIZ) erkunden",
          "Erste Schritte der Praktikumssuche und Vorbereitung auf das Schülerbetriebspraktikum"
        ]
      },
      {
        "id": "wrt-78-3",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.6/7/8/9: Kaufvertrag & Technische Systeme / Werkstoffe",
        "coreCompetencies": [
          "Zustandekommen des Kaufvertrags (Antrag und Annahme, zwei übereinstimmende Willenserklärungen) erklären",
          "Rechts- und Geschäftsfähigkeit bei Minderjährigen (Taschengeldparagraph § 110 BGB) prüfen",
          "Werkstoffeigenschaften untersuchen und Fertigungsprozesse nach technischen Plänen ausführen"
        ]
      },
      {
        "id": "wrt-9-1",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.1/2/4: Arbeitswelt, Brutto-Netto-Abrechnung & Soziale Marktwirtschaft",
        "coreCompetencies": [
          "Lohn- und Gehaltsabrechnung (Steuern, Kranken-, Pflege-, Renten-, Arbeitslosenversicherung) berechnen",
          "Rechte und Pflichten aus dem Ausbildungsvertrag sowie Jugendarbeitsschutzgesetz (JArbSchG) prüfen",
          "Säulen der Sozialen Marktwirtschaft im Vergleich zur freien und zentralen Planwirtschaft darlegen"
        ]
      },
      {
        "id": "wrt-9-2",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.3/6: Das Unternehmen als System & Kaufvertragsstörungen",
        "coreCompetencies": [
          "Betriebliche Grundfunktionen (Beschaffung, Produktion, Absatz, Finanzierung) analysieren",
          "Störungen bei der Erfüllung des Kaufvertrags (Mangelhafte Lieferung, Lieferverzug, Zahlungsverzug) und Rechte",
          "Allgemeine Geschäftsbedingungen (AGB) und Gewährleistung vs. Garantie unterscheiden"
        ]
      },
      {
        "id": "wrt-9-3",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.2.5/7: Berufsorientierung (2) & Technische Steuerungs- und Regelungssysteme",
        "coreCompetencies": [
          "Vollständige Bewerbungsunterlagen (Anschreiben, tabellarischer Lebenslauf, Zeugnisse) erstellen",
          "Schülerbetriebspraktikum durchführen, auswerten und im Praktikumsbericht präsentieren",
          "Steuern und Regeln in technischen Prozessen (Sensoren, Aktoren, logische Schaltungen) unterscheiden"
        ]
      },
      {
        "id": "wrt-10-1",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.1/2: Wirtschaftspolitik (Magisches Viereck), Geldpolitik & EU-Binnenmarkt",
        "coreCompetencies": [
          "Ziele des Stabilitätsgesetzes (Wirtschaftswachstum, Preisstabilität, Vollbeschäftigung, außenwirtschaftliches Gleichgewicht)",
          "Aufgaben der Europäischen Zentralbank (EZB) und Ursachen von Inflation und Deflation untersuchen",
          "Vorteile und Herausforderungen des Europäischen Binnenmarktes und weltweiten Handels bewerten"
        ]
      },
      {
        "id": "wrt-10-2",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.3.3/4/5: Arbeitsrecht, Mitbestimmung & Jugendstrafrecht (Realschulabschluss)",
        "coreCompetencies": [
          "Kündigungsschutz, Betriebsrat, Tarifpartner und Arbeitskampf (Streik und Aussperrung) analysieren",
          "Grundzüge des Strafrechts und Besonderheiten des Jugendgerichtsgesetzes (JGG) erörtern",
          "Ökologische Nachhaltigkeit, Kreislaufwirtschaft und Corporate Social Responsibility in Unternehmen bewerten"
        ]
      }
    ]
  },
  {
    "id": "kunst",
    "name": "Kunst (2012)",
    "shortName": "KU",
    "category": "Ästhetisch & Sport",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Palette",
    "topics": [
      {
        "id": "ku-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Bildende Kunst: Malerei, Farbtheorie & Plastisches Gestalten",
        "coreCompetencies": [
          "Farbkreis nach Itten, Primär-/Sekundärfarben sowie Farbkontraste (Hell-Dunkel, Kalt-Warm) erproben",
          "Grafische Mittel (Punkt, Linie, Schraffur, Struktur) gezielt zur Bildgestaltung einsetzen",
          "Plastische Werke aus Ton, Knetmasse oder Recyclingmaterialien formen"
        ]
      },
      {
        "id": "ku-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Visuelle Medien & Gestaltete Umwelt: Comic, Typografie & Architektur",
        "coreCompetencies": [
          "Bildgeschichten, Comics und Storyboards mit Bild-Text-Kombinationen entwickeln",
          "Schriftarten und typografische Gestaltungselemente erproben",
          "Bauwerke in der Schulumgebung beobachten, skizzieren und Architekturmodelle bauen"
        ]
      },
      {
        "id": "ku-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereich Bildende Kunst: Raumdarstellung, Perspektive & Porträt",
        "coreCompetencies": [
          "Mittel der Raumillusion (Überdeckung, Höhenlage, Fluchtpunkt, Zentralperspektive) anwenden",
          "Menschliche Proportionen, Kopf- und Porträtstudien anatomisch treffend zeichnen",
          "Ausdruck und Mimik in grafischen und malerischen Techniken darstellen"
        ]
      },
      {
        "id": "ku-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Visuelle Medien & Produktdesign: Fotografie, Plakat & Design",
        "coreCompetencies": [
          "Fotografische Gestaltungsmittel (Einstellungsgrößen, Kameraperspektiven, Bildausschnitt) analysieren",
          "Plakatgestaltung und visuelle Kommunikationsmittel für schulische Anlässe kreieren",
          "Gebrauchsgegenstände unter ästhetischen und ergonomischen Kriterien entwerfen"
        ]
      },
      {
        "id": "ku-9-1",
        "doubleGrade": "9",
        "title": "Lernbereich Bildende Kunst: Kunststile des 19. und 20. Jahrhunderts (Moderne)",
        "coreCompetencies": [
          "Stilmerkmale von Impressionismus, Expressionismus und Kubismus im Werkvergleich untersuchen",
          "Eigene bildnerische Arbeiten in Anlehnung an künstlerische Strömungen realisieren",
          "Bedeutung der Loslösung von der gegenständlichen Abbildung reflektieren"
        ]
      },
      {
        "id": "ku-10-1",
        "doubleGrade": "10",
        "title": "Lernbereiche Gegenwartskunst, Medienkunst & Bildanalyse (Realschulabschluss)",
        "coreCompetencies": [
          "Konzepte zeitgenössischer Kunst (Aktionskunst, Installation, Street Art, digitale Kunst) deuten",
          "Methoden der Bildanalyse (Beschreibung, Analyse von Form/Farbe/Komposition, Interpretation) anwenden",
          "Eigenes künstlerisches Projektportfolio mit Reflexionsbericht erstellen"
        ]
      }
    ]
  },
  {
    "id": "musik",
    "name": "Musik (Entwurf 2026)",
    "shortName": "MU",
    "category": "Ästhetisch & Sport",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Music",
    "topics": [
      {
        "id": "mu-56-1",
        "doubleGrade": "5/6",
        "title": "Elementare Musiklehre, Rhythmus, Stimme & Programmmusik",
        "coreCompetencies": [
          "Notenwerte, Taktarten, Tonhöhen im Violinschlüssel und elementare Musikzeichen anwenden",
          "Gemeinsames Singen und Musizieren mit Orff-Instrumenten und Bodypercussion",
          "Tonmalerei und außermusikalische Inhalte in Werken der Programmmusik (z. B. Karneval der Tiere) hörend erfassen"
        ]
      },
      {
        "id": "mu-56-2",
        "doubleGrade": "5/6",
        "title": "Musiktheater (Kinderoper, Musical) & Instrumentenkunde",
        "coreCompetencies": [
          "Instrumentenfamilien (Streich-, Holzblas-, Blechblas-, Schlag-, Tasteninstrumente) klanglich identifizieren",
          "Szenische Elemente von Oper und Musical handelnd nachvollziehen",
          "Musikkulturen der Welt: Traditionelle Instrumente und Tänze kennenlernen"
        ]
      },
      {
        "id": "mu-78-1",
        "doubleGrade": "7/8",
        "title": "Populäre Musik: Genres, Songs & Bandinstrumente",
        "coreCompetencies": [
          "Typische Strukturen von Popsongs (Intro, Verse, Chorus, Bridge, Outro) analysieren",
          "Klang und Spielweisen von E-Gitarre, E-Bass, Keyboard und Drumset beschreiben",
          "Genres (Rock, Pop, Hip-Hop, Reggae) historisch und musikalisch einordnen"
        ]
      },
      {
        "id": "mu-78-2",
        "doubleGrade": "7/8",
        "title": "Epochen der Musikgeschichte: Barock und Wiener Klassik",
        "coreCompetencies": [
          "Merkmale des Barock (Generalbass, Polyphonie, J. S. Bach) im Hörbeispiel nachweisen",
          "Die Wiener Klassik (Sonatenhauptsatzform, Sinfonie, Haydn, Mozart, Beethoven) analysieren",
          "Hymnen und nationale Musikkulturen im gesellschaftlichen Kontext betrachten"
        ]
      },
      {
        "id": "mu-9-1",
        "doubleGrade": "9",
        "title": "Filmmusik & Musik der Romantik und Moderne",
        "coreCompetencies": [
          "Funktionen von Filmmusik (Underscoring, Mood-Technik, Leitmotivtechnik) an Filmszenen analysieren",
          "Epoche der Romantik (Programmsinfonie, Kunstlied von Schubert) untersuchen",
          "Strömungen des 20. Jahrhunderts (Impressionismus, Zwölftonmusik, Minimal Music) deuten"
        ]
      },
      {
        "id": "mu-10-1",
        "doubleGrade": "10",
        "title": "Musik, Politik und Gesellschaft & Musik im digitalen Raum (Realschulabschluss)",
        "coreCompetencies": [
          "Musik als Mittel von Protest, Propaganda und Identitätsstiftung kritisch bewerten",
          "Sounddesign, Werbemusik und akustische Markenführung im digitalen Raum analysieren",
          "Systematische Vorbereitung auf die theoretische und praktische Musikprüfung"
        ]
      }
    ]
  },
  {
    "id": "sport",
    "name": "Sport (2017)",
    "shortName": "SP",
    "category": "Ästhetisch & Sport",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Trophy",
    "topics": [
      {
        "id": "sp-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Gesundheit, Fitness & Leichtathletik (Lauf, Sprung, Wurf)",
        "coreCompetencies": [
          "Grundausdauer bei Dauerläufen schulen und Herz-Kreislauf-Belastung wahrnehmen",
          "Sprinttechnik, Schlagballwurf aus dem Anlauf und Weitsprung (Zone) regelgerecht ausführen",
          "Erwärmungsprogramme mit dynamischer Dehnung und Kräftigung mitmachen"
        ]
      },
      {
        "id": "sp-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Sportspiele 1 (Parteiballspiele, Völkerball, Basketball/Fußball-Grundlagen)",
        "coreCompetencies": [
          "Grundlegende technische Fertigkeiten (Passen, Fangen, Dribbeln, Torschuss/Korbwurf) beherrschen",
          "Einfache taktische Verhaltensweisen (Freilaufen, Decken) im Team anwenden",
          "Fairplay-Regeln, Schiedsrichterentscheidungen und Teamgeist vorbildlich leben"
        ]
      },
      {
        "id": "sp-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Sportspiele (Volleyball, Basketball, Handball, Fußball)",
        "coreCompetencies": [
          "Spezifische Techniken (z. B. Pritschen/Baggern im Volleyball, Korbleger im Basketball) anwenden",
          "Angriffs- und Abwehrsysteme im Kleinfeldspiel taktisch koordinieren",
          "Spielabläufe leiten und eigenverantwortlich als Schiedsrichter agieren"
        ]
      },
      {
        "id": "sp-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Gerätturnen, Rhythmik & Tanz / Zweikampf",
        "coreCompetencies": [
          "Kombinationen an Geräten (Boden, Reck/Stufenbarren, Sprung) flüssig turnen",
          "Choreografien mit Musik und Handgeräten oder Tanzschritte gestalten",
          "Zweikampfformen (Kämpfen um Raum, Haltegriffe am Boden) unter strikter Regeleinhaltung erproben"
        ]
      },
      {
        "id": "sp-910-1",
        "doubleGrade": "9",
        "title": "Leichtathletik (Kugelstoß, Hochsprung) & Vertiefung Sportspiele",
        "coreCompetencies": [
          "Kugelstoßtechnik (Standstoß, Angleiten) und Hochsprung (Floptechnik) sicher ausführen",
          "Große Sportspiele nach offiziellen Wettkampfregeln auf dem Großfeld spielen",
          "Trainingsmethoden zur Steigerung von Schnelligkeit und Ausdauer anwenden"
        ]
      },
      {
        "id": "sp-910-2",
        "doubleGrade": "10",
        "title": "Trainingslehre, Fitnesskonzepte & Vorbereitung auf die sportpraktische Abschlussprüfung",
        "coreCompetencies": [
          "Individuelle Trainingspläne für Kraft, Ausdauer und Beweglichkeit konzipieren und reflektieren",
          "Sportbiologische Grundlagen (Energiegewinnung, Laktat, Regeneration) verstehen",
          "Wettkampfleistungen in ausgewählten Prüfungssportarten standardgerecht abrufen"
        ]
      }
    ]
  },
  {
    "id": "ethik",
    "name": "Ethik (2012)",
    "shortName": "ETH",
    "category": "Werte & Orientierung",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "HeartHandshake",
    "topics": [
      {
        "id": "eth-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.1/2: Wer bin ich? & Ich und Wir (Freundschaft, Familie, Konflikte)",
        "coreCompetencies": [
          "Eigene Gefühle, Stärken, Schwächen und Wünsche artikulieren und Selbstwert aufbauen",
          "Bedeutung von Freundschaft, Vertrauen, Ehrlichkeit und Familienleben reflektieren",
          "Konflikte im Klassenverband gewaltfrei analysieren und Streitschlichtung erproben"
        ]
      },
      {
        "id": "eth-56-2",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.3/4: Wir und die Anderen (Kulturen & Feste) & Die Welt und ich (Tiere/Natur)",
        "coreCompetencies": [
          "Feste, Bräuche und Lebensgewohnheiten verschiedener Kulturen und Religionen achten",
          "Verantwortung des Menschen für Haustiere und Nutztiere (Tierethik) erörtern",
          "Sorgsamen Umgang mit der natürlichen Umwelt im Alltag begründen"
        ]
      },
      {
        "id": "eth-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.2.1/2: Identitätsfindung in der Pubertät & Gerechtigkeit und Fairness",
        "coreCompetencies": [
          "Veränderungen in der Pubertät, Rollenerwartungen und gesellschaftliche Schönheitsideale hinterfragen",
          "Formen von Gerechtigkeit (Chancengleichheit, Leistungsgerechtigkeit, Verteilungsgerechtigkeit) diskutieren",
          "Regeln für ein faires Zusammenleben in Gruppen und sozialen Netzwerken formulieren"
        ]
      },
      {
        "id": "eth-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.2.3/4: Vorurteile, Diskriminierung & Konsum- und Medienethik",
        "coreCompetencies": [
          "Entstehung von Stereotypen, Vorurteilen und Rassismus aufdecken und Gegenstrategien entwickeln",
          "Ethische Fragestellungen zu Konsumverhalten, Fast Fashion und globaler Ausbeutung analysieren",
          "Verantwortung beim Umgang mit digitalen Medien (Privatsphäre, Shitstorms, Fake News) reflektieren"
        ]
      },
      {
        "id": "eth-9-1",
        "doubleGrade": "9",
        "title": "Lernbereiche 2.3.1/2/3: Gewissen, Recht und Moral & Sinn des Lebens / Lebensentwürfe",
        "coreCompetencies": [
          "Das Phänomen Gewissen untersuchen, moralische Dilemmata strukturieren und Lösungswege abwägen",
          "Verhältnis von gesetzlichem Recht und moralischer Pflicht an Beispielen (z. B. Ziviler Ungehorsam) prüfen",
          "Philosophische Glücksvorstellungen (Epikur, Stoa) und individuelle Lebensziele vergleichen"
        ]
      },
      {
        "id": "eth-10-1",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.4.1/2: Grundpositionen der philosophischen Ethik & Angewandte Bio-/Medizinethik",
        "coreCompetencies": [
          "Ethische Modelle vergleichen: Kants Pflichtethik (Kategorischer Imperativ) vs. Utilitarismus (Nutzenethik)",
          "Medizinethische Grenzfragen (Organspende, Sterbehilfe, Gentechnik, Reproduktionsmedizin) multiperspektivisch beurteilen",
          "Verantwortung für das ungeborene und das sterbende Leben reflektieren"
        ]
      },
      {
        "id": "eth-10-2",
        "doubleGrade": "10",
        "title": "Lernbereiche 2.4.3/4: Frieden, Menschenrechte & Technik-/Zukunftsethik (Realschulabschluss)",
        "coreCompetencies": [
          "Universelle Menschenrechte (UN-Charta 1948) und weltweite Menschenrechtsverletzungen untersuchen",
          "Bedingungen für gerechten Frieden und gewaltfreie Konfliktlösung analysieren",
          "Zukunftsethik nach Hans Jonas und Verantwortung beim Einsatz Künstlicher Intelligenz bewerten"
        ]
      }
    ]
  },
  {
    "id": "ev_religion",
    "name": "Evangelische Religionslehre (2013)",
    "shortName": "EVR",
    "category": "Werte & Orientierung",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Cross",
    "topics": [
      {
        "id": "ev-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.1/2/3/4: Gelingendes Leben, Gott, Jesus & Die Bibel als Urkunde",
        "coreCompetencies": [
          "Aufbau und Entstehung der Bibel (Altes und Neues Testament, Evangelien) kennenlernen",
          "Gleichnisse und Wundererzählungen Jesu untersuchen und auf die Lebenswelt von Kindern beziehen",
          "Biblische Schöpfungserzählungen mit naturwissenschaftlichen Erkenntnissen vergleichen"
        ]
      },
      {
        "id": "ev-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.2: Reformation, Kirche im Wandel & Diakonie",
        "coreCompetencies": [
          "Leben und Wirken Martin Luthers sowie reformatorische Kernbotschaften (die 4 Soli) erläutern",
          "Die Reformation in Thüringen (Erfurt, Eisenach, Schmalkalden) historisch verorten",
          "Diakonisches Handeln und soziales Engagement von Kirchengemeinden heute erkunden"
        ]
      },
      {
        "id": "ev-910-1",
        "doubleGrade": "9",
        "title": "Kirche im Nationalsozialismus & Prophetisches Handeln",
        "coreCompetencies": [
          "Rolle der Bekennenden Kirche (Dietrich Bonhoeffer) und Deutsche Christen im NS-Regime analysieren",
          "Biblische Propheten (z. B. Amos, Jesaja) und ihren Einsatz für soziale Gerechtigkeit deuten",
          "Glaube in Extremsituationen und die Frage nach Schuld und Vergebung reflektieren"
        ]
      },
      {
        "id": "ev-910-2",
        "doubleGrade": "10",
        "title": "Theodizeefrage, Weltreligionen im Dialog & Christliche Zukunftshoffnung",
        "coreCompetencies": [
          "Die Theodizeefrage („Wie kann ein gütiger Gott Leid zulassen?“) an Beispielen durchdenken",
          "Gemeinsamkeiten und Unterschiede der abrahamitischen Religionen (Judentum, Christentum, Islam) darlegen",
          "Christliche Eschatologie, Hoffnung auf Auferstehung und ethische Verantwortung für die Schöpfung diskutieren"
        ]
      }
    ]
  },
  {
    "id": "kath_religion",
    "name": "Katholische Religionslehre (2013)",
    "shortName": "KR",
    "category": "Werte & Orientierung",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Church",
    "topics": [
      {
        "id": "kr-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche 2.1.1/2/3: Suche nach Gott, Biblische Botschaft & Gemeinschaft der Kirche",
        "coreCompetencies": [
          "Biblische Glaubenszeugen des Alten und Neuen Testaments (Abraham, Mose, David, Maria) kennenlernen",
          "Sakramente der Initiation (Taufe, Eucharistie, Firmung) und Kirchenjahr in ihrer Symbolik verstehen",
          "Kirchenräume erkunden und sakrale Kunstwerke deuten"
        ]
      },
      {
        "id": "kr-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.2: Jesus Christus – Botschaft vom Reich Gottes & Sakramente",
        "coreCompetencies": [
          "Die Bergpredigt und Seligpreisungen als Richtschnur christlichen Handelns analysieren",
          "Das Sakrament der Versöhnung (Beichte) und Bußpraxis reflektieren",
          "Ordensgemeinschaften (Benediktiner, Franziskaner) und Heilige in ihrer Vorbildfunktion betrachten"
        ]
      },
      {
        "id": "kr-910-1",
        "doubleGrade": "9",
        "title": "Katholische Soziallehre, Menschenwürde & Gewissensentscheidung",
        "coreCompetencies": [
          "Die Prinzipien der Katholischen Soziallehre (Personalität, Solidarität, Subsidiarität, Gemeinwohl) anwenden",
          "Kirchlicher Widerstand im Nationalsozialismus und christlicher Märtyrertod",
          "Gewissen und sittliches Urteilen in bioethischen Konfliktfeldern diskutieren"
        ]
      },
      {
        "id": "kr-910-2",
        "doubleGrade": "10",
        "title": "Interreligiöser Dialog, Kirche in der modernen Welt & Glaubenszweifel",
        "coreCompetencies": [
          "Ergebnisse des Zweiten Vatikanischen Konzils (Nostra Aetate) zum interreligiösen Dialog untersuchen",
          "Atheismus, Säkularisierung und Antworten des Glaubens auf existenzielle Krisen erörtern",
          "Christliche Hoffnung über den Tod hinaus und Verantwortung für Gerechtigkeit und Frieden"
        ]
      }
    ]
  },
  {
    "id": "jued_religion",
    "name": "Jüdische Religionslehre (2024)",
    "shortName": "JR",
    "category": "Werte & Orientierung",
    "allowedGrades": [
      "5/6",
      "7/8",
      "9",
      "10"
    ],
    "icon": "Star",
    "topics": [
      {
        "id": "jr-56-1",
        "doubleGrade": "5/6",
        "title": "Lernbereiche Haschem (Gott), Tora, Schabbat & Jüdische Feiertage",
        "coreCompetencies": [
          "Bedeutung der Tora (Fünf Bücher Mose) und ihrer Schreibtradition erklären",
          "Den Schabbat in seiner rituellen Begehung und Bedeutung für die Familie beschreiben",
          "Jüdische Feiertage (Rosch Haschana, Jom Kippur, Pessach, Chanukka) und deren Bräuche verstehen"
        ]
      },
      {
        "id": "jr-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche Synagoge, Kaschrut (Speisegesetze) & Bar/Bat Mizwa",
        "coreCompetencies": [
          "Aufbau einer Synagoge (Toraschrein, Bima, Ner Tamid) und Gottesdienstablauf erläutern",
          "Die Speisegesetze (Kaschrut: milchig, fleischig, parve) und ihre religiöse Begründung nachvollziehen",
          "Bedeutung von Bar Mizwa und Bat Mizwa für das religiöse Mündigwerden Jugendlicher reflektieren"
        ]
      },
      {
        "id": "jr-910-1",
        "doubleGrade": "9",
        "title": "Geschichte des Judentums in Thüringen & Auseinandersetzung mit Antisemitismus",
        "coreCompetencies": [
          "Spuren jüdischen Lebens in Thüringen (z. B. Alte Synagoge Erfurt, Mikwe, Erfurter Schatz) erkunden",
          "Erscheinungsformen von historischem und modernem Antisemitismus analysieren und entkräften",
          "Erinnerungskultur an die Schoah und jüdische Resilienz dokumentieren"
        ]
      },
      {
        "id": "jr-910-2",
        "doubleGrade": "10",
        "title": "Talmud, Halacha & Jüdische Ethik in der Gegenwart",
        "coreCompetencies": [
          "Aufbau und Streitkultur im Talmud (Mischna und Gemara) nachvollziehen",
          "Ethische Konzepte (Tikkun Olam – Reparatur der Welt, Zedaka – Wohltätigkeit) auf Gegenwartsfragen beziehen",
          "Pluralismus im modernen Judentum (orthodox, konservativ, liberal) vergleichen"
        ]
      }
    ]
  },
  {
    "id": "franzoesisch",
    "name": "Französisch (Erprobungsfassung 2026, 2. Fremdsprache)",
    "shortName": "FR",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Languages",
    "topics": [
      {
        "id": "fr-78-1",
        "doubleGrade": "7/8",
        "title": "Alltag, Familie, Schule & Freizeit (Se présenter, la famille, le collège, les loisirs)",
        "coreCompetencies": [
          "Sich vorstellen, über Familie, Freunde, Schule und Hobbys auf Französisch sprechen",
          "Regelmäßige Verben auf -er sowie grundlegende Verben (être, avoir, aller, faire) im Präsens anwenden",
          "Fragen stellen (Intonationsfrage, est-ce que, Fragewörter) und Verneinung (ne ... pas) beherrschen"
        ]
      },
      {
        "id": "fr-9-1",
        "doubleGrade": "9",
        "title": "Paris, Regionen Frankreichs & Passé composé (Raconter des événements passés)",
        "coreCompetencies": [
          "Über Erlebnisse, Ferien und vergangene Aktivitäten im Passé composé berichten",
          "Wegbeschreibungen, Einkaufsdialoge und Restaurantbesuche in Frankreich meistern",
          "Kulturelle Besonderheiten französischer Regionen und Sehenswürdigkeiten in Paris kennenlernen"
        ]
      },
      {
        "id": "fr-10-1",
        "doubleGrade": "10",
        "title": "Frankophonie, Jugendleben, Zukunftspläne & Imparfait / Futur simple",
        "coreCompetencies": [
          "Länder der Frankophonie (z. B. Kanada/Québec, Senegal, Marokko) landeskundlich erfassen",
          "Imparfait und Passé composé kontrastierend zur Erzählung komplexer Handlungen einsetzen",
          "Über Berufswünsche und Zukunftspläne im Futur composé und Futur simple diskutieren"
        ]
      }
    ]
  },
  {
    "id": "russisch",
    "name": "Russisch (Erprobungsfassung 2026, 2. Fremdsprache)",
    "shortName": "RU",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Languages",
    "topics": [
      {
        "id": "ru-78-1",
        "doubleGrade": "7/8",
        "title": "Kyrillisches Alphabet, Kennenlernen, Familie & Schule (Знакомство, семья, школа)",
        "coreCompetencies": [
          "Kyrillische Druck- und Schreibschrift sicher lesen und schreiben",
          "Begrüßungs-, Vorstellungs- und Befindlichkeitsdialoge führen",
          "Präsens der 1. und 2. Konjugation sowie Grundzüge der Substantivdeklination anwenden"
        ]
      },
      {
        "id": "ru-9-1",
        "doubleGrade": "9",
        "title": "Stadt, Alltag, Essen & Freizeit (Город, покупки, еда и свободное время)",
        "coreCompetencies": [
          "Sich in einer Stadt orientieren, im Geschäft einkaufen und Speisen bestellen",
          "Präpositional- und Akkusativendungen sicher im Kontext gebrauchen",
          "Über Vergangenes mit Verben im Präteritum berichten"
        ]
      },
      {
        "id": "ru-10-1",
        "doubleGrade": "10",
        "title": "Reisen, Kultur, Berufsinteressen & Aspekte der Verben (Путешествия и профессии)",
        "coreCompetencies": [
          "Reiseberichte und landeskundliche Texte über Kultur und Geografie verstehen",
          "Verbalaspekte (vollendet/unvollendet) im Satzgefüge anwenden",
          "Über Zukunftspläne, Berufe und Freundschaften im Dialog diskutieren"
        ]
      }
    ]
  },
  {
    "id": "spanisch",
    "name": "Spanisch (Entwurfsfassung 2025, 2. Fremdsprache)",
    "shortName": "ES",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Languages",
    "topics": [
      {
        "id": "es-78-1",
        "doubleGrade": "7/8",
        "title": "Kennenlernen, Familie, Schule & Alltag (¡Hola! Me llamo..., Mi familia, El colegio)",
        "coreCompetencies": [
          "Sich und andere vorstellen, Herkunft, Alter und Befinden ausdrücken",
          "Regelmäßige Verben auf -ar, -er, -ir sowie ser, estar, tener und hay im Presente anwenden",
          "Zahlen, Wochentage, Uhrzeiten und Alltagsaktivitäten im Dialog einsetzen"
        ]
      },
      {
        "id": "es-9-1",
        "doubleGrade": "9",
        "title": "Stadtleben, Essen, Kleidung & Vergangenes (En la ciudad, De compras & Indefinido)",
        "coreCompetencies": [
          "Wegbeschreibungen, Einkaufs- und Restaurantgespräche führen",
          "Über vergangene Ereignisse im Pretérito Indefinido und Pretérito Perfecto berichten",
          "Kulturelle Besonderheiten Spaniens (Tapas, Fiestas, Städte wie Madrid und Barcelona) erkunden"
        ]
      },
      {
        "id": "es-10-1",
        "doubleGrade": "10",
        "title": "Hispanoamerika, Musik, Jugendkultur & Zukunftspläne (América Latina & Futuro)",
        "coreCompetencies": [
          "Geografische und kulturelle Vielfalt Lateinamerikas (Mexiko, Andenländer) erfassen",
          "Gegenüberstellung von Indefinido und Imperfecto zur Schilderung von Geschichten",
          "Meinungen zu Musik, Medien und Zukunftsplänen äußern und begründen"
        ]
      }
    ]
  },
  {
    "id": "darstellen_gestalten",
    "name": "Darstellen und Gestalten (2014)",
    "shortName": "DG",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Sparkles",
    "topics": [
      {
        "id": "dg-78-1",
        "doubleGrade": "7/8",
        "title": "Körpersprache, Bewegung, Pantomime & Bühnenraum",
        "coreCompetencies": [
          "Körperhaltung, Mimik, Gestik und Gangarten zur Figurendarstellung erproben",
          "Den Bühnenraum (Ebenen, Raumachsen, Richtungen) wirkungsvoll nutzen",
          "Kurze pantomimische Szenen im Ensemble synchron gestalten"
        ]
      },
      {
        "id": "dg-78-2",
        "doubleGrade": "7/8",
        "title": "Sprache, Stimme, Geräusch & Rhythmus (Sprechchor & Klanggestaltung)",
        "coreCompetencies": [
          "Artikulation, Modulation, Lautstärke und Pausensetzung in Sprechchören üben",
          "Akustische Kulissen und Klangcollagen mit Alltagsgegenständen und Stimme erzeugen",
          "Rhythmische Schrittfolgen und Freeze-Bilder präzise setzen"
        ]
      },
      {
        "id": "dg-910-1",
        "doubleGrade": "9",
        "title": "Figurenentwicklung, Maskenspiel, Kostüm & Requisit",
        "coreCompetencies": [
          "Komplexe Rollenbiografien und Figurenhaltungen erarbeiten",
          "Mit neutralen und expressiven Masken ausdrucksstark agieren",
          "Requisiten und Kostüme symbolhaft in Szenenabläufe einbinden"
        ]
      },
      {
        "id": "dg-910-2",
        "doubleGrade": "10",
        "title": "Inszenierung, Regiearbeit, Bühnenbild & Projektpräsentation",
        "coreCompetencies": [
          "Eine dramaturgische Textvorlage für eine Schultheater-Aufführung bearbeiten",
          "Regiekonzepte, Beleuchtung, Soundeffekte und Bühnenbild koordinieren",
          "Ein komplettes Theaterstück vor Publikum präsentieren und Feedback reflektieren"
        ]
      }
    ]
  },
  {
    "id": "nut",
    "name": "Natur und Technik (2012)",
    "shortName": "NUT",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Cpu",
    "topics": [
      {
        "id": "nut-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1/2: Leben im privaten Haushalt & Fortbewegung und Mobilität",
        "coreCompetencies": [
          "Energetische und ökologische Bilanzen privater Haushaltsgeräte untersuchen",
          "Antriebssysteme (Verbrenner, Elektromotor, Fahrrad) hinsichtlich Wirkungsgrad und Emissionen vergleichen",
          "Sicherheitsaspekte technischer Fortbewegungsmittel analysieren"
        ]
      },
      {
        "id": "nut-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereich 2.1.3: Versorgung und Entsorgung (Elektroenergie & Ressourcen)",
        "coreCompetencies": [
          "Erzeugung, Transport und Verteilung elektrischer Energie (Kraftwerke, Stromnetze) untersuchen",
          "Ressourcenschonung, Recycling und fachgerechte Müllentsorgung im Alltag planen",
          "Einfache elektrische Schaltungen und Sicherheitseinrichtungen im Haus prüfen"
        ]
      },
      {
        "id": "nut-910-1",
        "doubleGrade": "9",
        "title": "Stoffe und Produkte des Alltags: Kunststoffe, Textilien & Werkstoffprüfung",
        "coreCompetencies": [
          "Herstellung, Eigenschaften und Verwertung von Kunststoffen und Verbundwerkstoffen analysieren",
          "Werkstoffprüfverfahren (Zug-, Härte-, Biegeversuch) experimentell ausführen",
          "Lebenszyklusanalysen technischer Alltagsprodukte erstellen"
        ]
      },
      {
        "id": "nut-910-2",
        "doubleGrade": "10",
        "title": "Automatisierung, Sensortechnik & Zukunftstechnologien (Projektarbeit)",
        "coreCompetencies": [
          "Regelkreise und Sensoren in Haustechnik und Industrie untersuchen",
          "Prototypenbau unter Einsatz moderner Fertigungsverfahren (z. B. 3D-Druck, Lasercutter)",
          "Technologiefolgenabschätzung und nachhaltige Technikentwicklung bewerten"
        ]
      }
    ]
  },
  {
    "id": "sozialwesen",
    "name": "Sozialwesen (2012)",
    "shortName": "SOW",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Heart",
    "topics": [
      {
        "id": "sow-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1/2/3: Familie als soziales Umfeld & Sozialisation in Kindergruppen / Schule",
        "coreCompetencies": [
          "Bedeutung der Familie für die kindliche Entwicklung und Erziehungsstile vergleichen",
          "Phasen der kindlichen Sozialisation und Konfliktbewältigung in Gruppen beobachten",
          "Soziale Strukturen im Lebensraum Schule und Formen des Miteinanders analysieren"
        ]
      },
      {
        "id": "sow-9-1",
        "doubleGrade": "9",
        "title": "Lernbereich Leben im Alter & Menschen mit besonderen Bedürfnissen (Inklusion)",
        "coreCompetencies": [
          "Körperliche, seelische und soziale Veränderungen im Alter erfassen",
          "Betreuungs- und Pflegeangebote (ambulant, stationär, Mehrgenerationenhäuser) untersuchen",
          "Inklusionskonzepte und Barrierefreiheit für Menschen mit Behinderung erforschen"
        ]
      },
      {
        "id": "sow-10-1",
        "doubleGrade": "10",
        "title": "Berufsfelder im Sozial- und Gesundheitsbereich & Soziale Sicherungssysteme",
        "coreCompetencies": [
          "Anforderungsprofile sozialer Berufe (Erzieher, Pflegefachkraft, Sozialpädagoge) erkunden",
          "Praktische Erfahrungen in sozialen Einrichtungen reflektieren und dokumentieren",
          "Struktur des deutschen Sozialstaates und Hilfsangebote freier Wohlfahrtsverbände bewerten"
        ]
      }
    ]
  },
  {
    "id": "wpf_informatik",
    "name": "Wahlpflichtfach Informatik (2012)",
    "shortName": "INF",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Code",
    "topics": [
      {
        "id": "inf-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1/2/3: Information, Informatiksysteme & Informatikprojekte",
        "coreCompetencies": [
          "Codierung von Daten (Binärsystem, Hexadezimalsystem, ASCII, Unicode) durchführen",
          "Hardwarearchitekturen (Von-Neumann-Rechnerarchitektur, Bus-Systeme, Speicher) erklären",
          "Informatikprojekte in Teams mit Meilensteinen und Arbeitsteilung organisieren"
        ]
      },
      {
        "id": "inf-78-2",
        "doubleGrade": "7/8",
        "title": "Lernbereich Datenmodellierung & Datenbanken (ER-Modelle & SQL-Abfragen)",
        "coreCompetencies": [
          "Entity-Relationship-Diagramme (ERD) für reale Szenarien modellieren",
          "Relationale Datenbanktabellen mit Primär- und Fremdschlüsseln erstellen",
          "SQL-Befehle (SELECT, INSERT, UPDATE, DELETE, JOIN) zur Datenverarbeitung nutzen"
        ]
      },
      {
        "id": "inf-9-1",
        "doubleGrade": "9",
        "title": "Algorithmen & Strukturierte Programmierung (Variablen, Schleifen, Methoden)",
        "coreCompetencies": [
          "Algorithmen in Struktogrammen (Nassi-Shneiderman) und Programmablaufplänen visualisieren",
          "Strukturierte Programme in einer Hochsprache (Python / Java) fehlerfrei implementieren",
          "Sortier- und Suchalgorithmen (z. B. Bubblesort, lineare/binäre Suche) vergleichen"
        ]
      },
      {
        "id": "inf-10-1",
        "doubleGrade": "10",
        "title": "Netzwerke, Internetprotokolle, Webentwicklung & IT-Sicherheit",
        "coreCompetencies": [
          "Schichtenmodelle (OSI / TCP/IP), Routing und Domain Name System (DNS) nachvollziehen",
          "Webseiten mit HTML5, CSS3 und interaktiven Skripten erstellen",
          "Sicherheitskonzepte (Verschlüsselung, Zertifikate, Firewalls, Passwortsicherheit) anwenden"
        ]
      }
    ]
  },
  {
    "id": "wue",
    "name": "Wirtschaft-Umwelt-Europa (2012)",
    "shortName": "WUE",
    "category": "Wahlpflichtbereich",
    "allowedGrades": [
      "7/8",
      "9",
      "10"
    ],
    "icon": "Euro",
    "topics": [
      {
        "id": "wue-78-1",
        "doubleGrade": "7/8",
        "title": "Lernbereiche 2.1.1/2/3/4: Die Familie als Verbraucher- & Freizeitgemeinschaft, Umweltschutz",
        "coreCompetencies": [
          "Haushaltsbuchführung, Konsumentscheidungen und Werbestrategien untersuchen",
          "Ökologische Fußabdrücke privater Haushalte (Energie, Wasser, Müll) ermitteln",
          "Freizeitangebote und Tourismus im Einklang mit Naturschutz analysieren"
        ]
      },
      {
        "id": "wue-9-1",
        "doubleGrade": "9",
        "title": "Lernbereich Regionale Wirtschaft in Thüringen & Nachhaltige Unternehmensführung",
        "coreCompetencies": [
          "Standortvorteile und Leitbranchen der Thüringer Wirtschaft (z. B. Optik, Automotive, Handwerk) erkunden",
          "Ökologische Produktionsverfahren und regionale Wirtschaftskreisläufe untersuchen",
          "Unternehmensgründungen im Rahmen eines Schülerfirmen-Projekts simulieren"
        ]
      },
      {
        "id": "wue-10-1",
        "doubleGrade": "10",
        "title": "Lernbereich Europa im Alltag: Binnenmarkt, EU-Umweltpolitik & Grüne Zukunft",
        "coreCompetencies": [
          "Die 4 Grundfreiheiten des EU-Binnenmarktes (Waren, Personen, Dienstleistungen, Kapital) analysieren",
          "EU-Klimaziele (European Green Deal, Kreislaufwirtschaft, Erneuerbare Energien) bewerten",
          "Chancen von Ausbildung, Studium und Mobilität in europäischen Nachbarländern erörtern"
        ]
      }
    ]
  }
];

export const SUBJECT_CATEGORIES: { category: import('../types/curriculum').SubjectCategory; label: string }[] = [
  { category: 'Kernfächer', label: 'Kernfächer' },
  { category: 'Naturwissenschaftlich-technisch', label: 'Naturwissenschaftlich & Technisch' },
  { category: 'Gesellschaftswissenschaftlich', label: 'Gesellschaftswissenschaftlich' },
  { category: 'Ästhetisch & Sport', label: 'Ästhetisch & Sport' },
  { category: 'Werte & Orientierung', label: 'Werte & Orientierung' },
  { category: 'Wahlpflichtbereich', label: 'Wahlpflichtbereich (WPB)' }
];
