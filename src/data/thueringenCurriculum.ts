import { SchoolSubject, GradeLevel, DoubleGrade } from '../types/curriculum';

export function getDoubleGrade(grade: GradeLevel): DoubleGrade {
  if (grade <= 6) return '5/6';
  if (grade <= 8) return '7/8';
  return '9/10';
}

export const THUERINGEN_SUBJECTS: SchoolSubject[] = [
  // --- KERNFÄCHER ---
  {
    id: 'deutsch',
    name: 'Deutsch',
    shortName: 'DE',
    category: 'Kernfächer',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'BookOpen',
    topics: [
      {
        id: 'de-56-1',
        doubleGrade: '5/6',
        title: 'Märchen, Sagen & Fabeln untersuchen und gestalten',
        coreCompetencies: [
          'Merkmale von epischen Kleinformen (Aufbau, Moral, Typisierung) herausarbeiten',
          'Eigene Fabeln und Märchen nach vorgegebenen Kriterien verfassen',
          'Wörtliche Rede und Satzzeichen regelgerecht anwenden'
        ]
      },
      {
        id: 'de-56-2',
        doubleGrade: '5/6',
        title: 'Sachtexte erschließen, beschreiben & informieren',
        coreCompetencies: [
          'W-Fragen an Sachtexte stellen und Kerninformationen markieren',
          'Vorgangsbeschreibung (z. B. Bastelanleitung, Rezept) sachlich und chronologisch verfassen',
          'Fachbegriffe mit Hilfe von Wortspeichern erklären'
        ]
      },
      {
        id: 'de-78-1',
        doubleGrade: '7/8',
        title: 'Argumentieren & Debattieren (Lineare und dialektische Erörterung)',
        coreCompetencies: [
          'Thesen, Argumente und Belege (3-B-Schema) voneinander unterscheiden',
          'Eigene Standpunkte sachlich begründen und Gegenargumente entkräften',
          'Formale Kriterien einer schriftlichen Stellungnahme einhalten'
        ]
      },
      {
        id: 'de-78-2',
        doubleGrade: '7/8',
        title: 'Balladen und dramatische Texte (z.B. Goethe, Schiller, Fontane)',
        coreCompetencies: [
          'Formale Merkmale von Balladen analysieren (Strophe, Reimschema, Metrum)',
          'Sprechgestaltung und szenisches Spiel erproben',
          'Figurenkonstellation und Spannungsaufbau schriftlich darlegen'
        ]
      },
      {
        id: 'de-910-1',
        doubleGrade: '9/10',
        title: 'Ganzschrift & moderne Literatur (Identität, Gesellschaft, Konflikte)',
        coreCompetencies: [
          'Charakteristik literarischer Figuren verfassen und Textbelege zitieren',
          'Historischen und gesellschaftlichen Kontext reflektieren',
          'Literarische Konflikte deuten und eigene Wertungen begründen'
        ]
      },
      {
        id: 'de-910-2',
        doubleGrade: '9/10',
        title: 'Medienkritik, Fake News & Bewerbungsschreiben (Berufsorientierung)',
        coreCompetencies: [
          'Medienformate (Nachrichten, Social Media, Werbetexte) kritisch analysieren',
          'Normgerechte Bewerbungsschreiben und Lebensläufe erstellen',
          'Rhetorische Mittel in Reden und Beiträgen nachweisen'
        ]
      }
    ]
  },
  {
    id: 'mathematik',
    name: 'Mathematik',
    shortName: 'MA',
    category: 'Kernfächer',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Calculator',
    topics: [
      {
        id: 'ma-56-1',
        doubleGrade: '5/6',
        title: 'Bruchrechnung & Dezimalbrüche im Alltag',
        coreCompetencies: [
          'Echte und unechte Brüche sowie Gemischte Zahlen veranschaulichen',
          'Grundrechenarten mit Brüchen und Dezimalzahlen sicher ausführen',
          'Alltagsbezogene Sachaufgaben mit Skizzen modellieren'
        ]
      },
      {
        id: 'ma-56-2',
        doubleGrade: '5/6',
        title: 'Geometrische Grundformen, Umfang & Flächeninhalt',
        coreCompetencies: [
          'Rechtecke, Quadrate, Dreiecke und Parallelogramme zeichnen',
          'Umfangs- und Flächeninhaltsformeln anwenden und Maßeinheiten umwandeln',
          'Körpernetze (Quader, Würfel) erkennen und Oberflächen berechnen'
        ]
      },
      {
        id: 'ma-78-1',
        doubleGrade: '7/8',
        title: 'Prozent- und Zinsrechnung & Dreisatz',
        coreCompetencies: [
          'Grundwert, Prozentwert und Prozentsatz in Realsituationen berechnen',
          'Zinsrechnung für Jahres-, Monats- und Tageszinsen anwenden',
          'Diagramme (Kreis-, Säulen-, Balkendiagramm) erstellen und interpretieren'
        ]
      },
      {
        id: 'ma-78-2',
        doubleGrade: '7/8',
        title: 'Lineare Gleichungen, Funktionen & Termumformungen',
        coreCompetencies: [
          'Äquivalenzumformungen bei linearen Gleichungen und Ungleichungen durchführen',
          'Lineare Funktionsgleichungen (y = mx + n) und Graphen bestimmen',
          'Schnittpunkte rechnerisch und grafisch ermitteln'
        ]
      },
      {
        id: 'ma-910-1',
        doubleGrade: '9/10',
        title: 'Satzgruppe des Pythagoras & Trigonometrie (Sinus, Kosinus, Tangens)',
        coreCompetencies: [
          'Rechtwinklige Dreiecke mit dem Satz des Pythagoras berechnen',
          'Seitenlängen und Winkel mittels Sinus, Kosinus und Tangens bestimmen',
          'Sachaufgaben aus Handwerk, Geodäsie und Architektur lösen'
        ]
      },
      {
        id: 'ma-910-2',
        doubleGrade: '9/10',
        title: 'Quadratische Funktionen, Gleichungen & Körperberechnung (Prüfungsvorbereitung)',
        coreCompetencies: [
          'Quadratische Gleichungen mit p-q-Formel oder quadratischer Ergänzung lösen',
          'Parabeln analysieren (Scheitelpunkt, Nullstellen, Symmetrie)',
          'Volumen und Oberfläche von Pyramide, Kegel, Zylinder und Kugel berechnen'
        ]
      }
    ]
  },
  {
    id: 'englisch',
    name: 'Englisch (1. Fremdsprache)',
    shortName: 'EN',
    category: 'Kernfächer',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Languages',
    topics: [
      {
        id: 'en-56-1',
        doubleGrade: '5/6',
        title: 'Everyday Life, School & Hobbies (Present Simple & Progressive)',
        coreCompetencies: [
          'Über Alltag, Familie und Freizeit sprechen und schreiben',
          'Simple Present und Present Progressive situationsgerecht unterscheiden',
          'Hör- und Leseverstehen anhand kurzer authentischer Texte nachweisen'
        ]
      },
      {
        id: 'en-78-1',
        doubleGrade: '7/8',
        title: 'Teen Life, Sights in the UK & Past Tenses',
        coreCompetencies: [
          'Simple Past und Present Perfect in Erfahrungsberichten korrekt anwenden',
          'Reise- und Wegbeschreibungen für London und Schottland verfassen',
          'Meinungen in Diskussionen vertreten (Agreeing / Disagreeing)'
        ]
      },
      {
        id: 'en-910-1',
        doubleGrade: '9/10',
        title: 'USA, Global Challenges, World of Work & Future Plans',
        coreCompetencies: [
          'Kulturelle und historische Aspekte der USA und des Commonwealth vergleichen',
          'Bewerbungsschreiben und Lebenslauf (Cover Letter, CV) auf Englisch verfassen',
          'Passiv, If-Clauses Typ I-III und indirekte Rede souverän einsetzen'
        ]
      }
    ]
  },

  // --- NATURWISSENSCHAFTLICH-TECHNISCH ---
  {
    id: 'mnt',
    name: 'Mensch-Natur-Technik (MNT)',
    shortName: 'MNT',
    category: 'Naturwissenschaftlich-technisch',
    allowedGrades: [5, 6],
    icon: 'Microscope',
    topics: [
      {
        id: 'mnt-56-1',
        doubleGrade: '5/6',
        title: 'Körper des Menschen, Gesunde Ernährung & Sinne',
        coreCompetencies: [
          'Aufbau und Funktion von Sinnesorganen (Auge, Ohr) beschreiben',
          'Ernährungspyramide analysieren und ausgewogene Mahlzeiten planen',
          'Versuche zur Wahrnehmung planen, durchführen und protokollieren'
        ]
      },
      {
        id: 'mnt-56-2',
        doubleGrade: '5/6',
        title: 'Pflanzen & Tiere in ihren Lebensräumen (Wald, Wiese, Gewässer)',
        coreCompetencies: [
          'Bauplan einer Blütenpflanze und Bestäubungsmechanismen skizzieren',
          'Angepasstheit von Wirbeltieren an Lebensräume untersuchen',
          'Nahrungsketten und ökologisches Gleichgewicht darstellen'
        ]
      },
      {
        id: 'mnt-56-3',
        doubleGrade: '5/6',
        title: 'Stoffe, Gemische & Einfache technische Systeme',
        coreCompetencies: [
          'Stoffeigenschaften (Dichte, Löslichkeit, Magnetismus) experimentell bestimmen',
          'Trennverfahren (Filtrieren, Eindampfen, Magnetscheiden) sachgerecht anwenden',
          'Sicherheitsregeln beim Experimentieren mit Brenner und Glasgeräten einhalten'
        ]
      }
    ]
  },
  {
    id: 'biologie',
    name: 'Biologie',
    shortName: 'BIO',
    category: 'Naturwissenschaftlich-technisch',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Dna',
    topics: [
      {
        id: 'bio-78-1',
        doubleGrade: '7/8',
        title: 'Zelle als Grundbaustein, Mikroskopie & Einzeller',
        coreCompetencies: [
          'Tierische und pflanzliche Zelle vergleichen (Organellen und Funktionen)',
          'Mikroskopische Präparate sachgemäß herstellen und zeichnen',
          'Lebensweise von Pantoffeltierchen und Amöben beschreiben'
        ]
      },
      {
        id: 'bio-78-2',
        doubleGrade: '7/8',
        title: 'Atmung, Blutkreislauf & Immunsystem des Menschen',
        coreCompetencies: [
          'Zusammensetzung und Aufgaben des Blutes erläutern',
          'Gasaustausch in den Lungenbläschen erklären',
          'Antigen-Antikörper-Reaktion und Impfungen (Aktiv/Passiv) begründen'
        ]
      },
      {
        id: 'bio-910-1',
        doubleGrade: '9/10',
        title: 'Genetik & Vererbung (Mendelsche Regeln, DNA-Aufbau, Mutationen)',
        coreCompetencies: [
          'Mendelsche Gesetze auf Erbgänge anwenden (Kreuzungsschemata)',
          'Aufbau der DNA und Prinzip der Proteinbiosynthese in Grundzügen darstellen',
          'Chancen und Risiken der Gentechnik ethisch abwägen'
        ]
      },
      {
        id: 'bio-910-2',
        doubleGrade: '9/10',
        title: 'Ökologie, Ökosystem See/Wald & Evolutionstheorien',
        coreCompetencies: [
          'Biotische und abiotische Faktoren in Ökosystemen analysieren',
          'Stoffkreisläufe (Kohlenstoff, Stickstoff) und Energiefluss darstellen',
          'Evolutionstheorie von Darwin gegenüber Lamarck begründet abgrenzen'
        ]
      }
    ]
  },
  {
    id: 'physik',
    name: 'Physik',
    shortName: 'PH',
    category: 'Naturwissenschaftlich-technisch',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Zap',
    topics: [
      {
        id: 'ph-78-1',
        doubleGrade: '7/8',
        title: 'Optik: Lichtausbreitung, Reflexion & Brechung (Linsen)',
        coreCompetencies: [
          'Strahlenmodell des Lichts anwenden und Schattenbildung erklären',
          'Reflexionsgesetz und Brechungsgesetz experimentell überprüfen',
          'Bilderzeugung durch Sammellinsen konstruieren'
        ]
      },
      {
        id: 'ph-78-2',
        doubleGrade: '7/8',
        title: 'Mechanik I: Masse, Dichte, Kraft & Ohmsches Gesetz',
        coreCompetencies: [
          'Zusammenhang zwischen Masse und Gewichtskraft (F = m * g) berechnen',
          'Kräfte als Vektoren mit Kraftmessern messen und zeichnen',
          'Stromstärke, Spannung und Widerstand (R = U / I) in Schaltkreisen messen'
        ]
      },
      {
        id: 'ph-910-1',
        doubleGrade: '9/10',
        title: 'Mechanik II: Bewegung, Geschwindigkeit & Energieformen (Goldene Regel)',
        coreCompetencies: [
          'Gleichförmige und beschleunigte Bewegungen in s-t- und v-t-Diagrammen auswerten',
          'Mechanische Arbeit, Leistung und Wirkungsgrad berechnen',
          'Energieerhaltungssatz anhand von Achterbahnen und Pendeln erklären'
        ]
      },
      {
        id: 'ph-910-2',
        doubleGrade: '9/10',
        title: 'Elektromagnetismus, Induktion & Kernphysik / Radioaktivität',
        coreCompetencies: [
          'Prinzip der elektromagnetischen Induktion und Generatorfunktion erläutern',
          'Transformatorgleichungen auf Stromnetze anwenden',
          'Alpha-, Beta- und Gammastrahlung, Halbwertszeit und Strahlenschutz bewerten'
        ]
      }
    ]
  },
  {
    id: 'chemie',
    name: 'Chemie',
    shortName: 'CH',
    category: 'Naturwissenschaftlich-technisch',
    allowedGrades: [7, 8, 9, 10],
    icon: 'FlaskConical',
    topics: [
      {
        id: 'ch-78-1',
        doubleGrade: '7/8',
        title: 'Chemische Reaktion, Sauerstoff, Oxide & Verbrennung',
        coreCompetencies: [
          'Kennzeichen einer chemischen Reaktion (Stoff- und Energieumwandlung) benennen',
          'Verbrennungsdreieck und Brandschutzmaßnahmen erläutern',
          'Wortgleichungen für Oxidationsreaktionen aufstellen'
        ]
      },
      {
        id: 'ch-78-2',
        doubleGrade: '7/8',
        title: 'Atommodell nach Bohr, Periodensystem & Chemische Bindung',
        coreCompetencies: [
          'Aufbau der Atome (Protonen, Neutronen, Elektronen) skizzieren',
          'Ordnung der Elemente im Periodensystem (Hauptgruppen, Perioden) deuten',
          'Ionenbindung und Elektronenpaarbindung anhand von Beispielen erklären'
        ]
      },
      {
        id: 'ch-910-1',
        doubleGrade: '9/10',
        title: 'Säuren, Laugen & Neutralisation (pH-Wert)',
        coreCompetencies: [
          'Eigenschaften und Nachweise von Säuren (Salzsäure) und Basen (Natronlauge)',
          'pH-Wert-Skala deuten und Neutralisationsreaktionen formulieren',
          'Quantitative Reaktionsgleichungen stöchiometrisch ausgleichen'
        ]
      },
      {
        id: 'ch-910-2',
        doubleGrade: '9/10',
        title: 'Organische Chemie: Alkane, Alkohole & Kunststoffe',
        coreCompetencies: [
          'Homologe Reihe der Alkane (Methan bis Dekan) und Verbrennungsprodukte untersuchen',
          'Funktionelle Gruppen (Hydroxylgruppe bei Ethanol) beschreiben',
          'Nachhaltigkeit, Recycling und Kunststoffe im Alltag kritisch reflektieren'
        ]
      }
    ]
  },
  {
    id: 'astronomie',
    name: 'Astronomie',
    shortName: 'ASTRO',
    category: 'Naturwissenschaftlich-technisch',
    allowedGrades: [9, 10],
    icon: 'Moon',
    topics: [
      {
        id: 'astro-910-1',
        doubleGrade: '9/10',
        title: 'Das Sonnensystem, Planetenbahnen & Keplersche Gesetze',
        coreCompetencies: [
          'Aufbau des Sonnensystems (Gesteins- vs. Gasplaneten, Asteroidengürtel) beschreiben',
          'Keplersche Gesetze auf Umlaufzeiten und Entfernungen anwenden',
          'Mondphasen, Finsternisse und Gezeiten physikalisch erklären'
        ]
      },
      {
        id: 'astro-910-2',
        doubleGrade: '9/10',
        title: 'Sterne, Galaxien & Moderne Raumfahrt (Entwicklung des Universums)',
        coreCompetencies: [
          'Entwicklungsstadien von Sternen (Weißer Zwerg, Neutronenstern, Schwarzes Loch) darstellen',
          'Methoden der astronomischen Beobachtung (Teleskope, Spektralanalyse) erläutern',
          'Historische Weltbilder (Geozentrisch vs. Heliozentrisch) vergleichen'
        ]
      }
    ]
  },
  {
    id: 'wrt',
    name: 'Wirtschaft-Recht-Technik (WRT)',
    shortName: 'WRT',
    category: 'Naturwissenschaftlich-technisch',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Wrench',
    topics: [
      {
        id: 'wrt-78-1',
        doubleGrade: '7/8',
        title: 'Der private Haushalt: Taschengeld, Konsum & Kaufvertrag',
        coreCompetencies: [
          'Rechte und Pflichten aus dem Kaufvertrag (Willenserklärungen) analysieren',
          'Geschäftsfähigkeit nach BGB (beschränkt geschäftsfähig mit Taschengeldparagraph) anwenden',
          'Einfluss von Werbung und Verkaufsstrategien auf das Konsumverhalten reflektieren'
        ]
      },
      {
        id: 'wrt-78-2',
        doubleGrade: '7/8',
        title: 'Werkstoffbearbeitung & Technisches Zeichnen',
        coreCompetencies: [
          'Eigenschaften von Holz, Metall und Kunststoff vergleichen',
          'Sicherheitsregeln für Werkzeuge und Werkzeugmaschinen anwenden',
          'Normgerechte Dreitafelprojektion und Bemaßung zeichnen'
        ]
      },
      {
        id: 'wrt-910-1',
        doubleGrade: '9/10',
        title: 'Das Unternehmen im Wirtschaftskreislauf & Berufswahlprozess',
        coreCompetencies: [
          'Einfachen und erweiterten Wirtschaftskreislauf erklären',
          'Betriebliche Grundfunktionen (Beschaffung, Produktion, Absatz) beschreiben',
          'Berufliche Interessen und Stärken für das Betriebspraktikum ermitteln'
        ]
      },
      {
        id: 'wrt-910-2',
        doubleGrade: '9/10',
        title: 'Soziale Marktwirtschaft, Arbeitsrecht & Tarifverträge',
        coreCompetencies: [
          'Prinzipien der Sozialen Marktwirtschaft und staatliche Eingriffe deuten',
          'Bestandteile eines Ausbildungsvertrages und Jugendarbeitsschutzgesetz prüfen',
          'Rolle von Gewerkschaften, Arbeitgeberverbänden und Streikrecht bewerten'
        ]
      }
    ]
  },

  // --- GESELLSCHAFTSWISSENSCHAFTLICH ---
  {
    id: 'geografie',
    name: 'Geografie',
    shortName: 'GEO',
    category: 'Gesellschaftswissenschaftlich',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Globe',
    topics: [
      {
        id: 'geo-56-1',
        doubleGrade: '5/6',
        title: 'Thüringen & Deutschland: Natur- und Wirtschaftsräume',
        coreCompetencies: [
          'Topografische Orientierung (Bundesländer, Hauptstädte, Gebirge, Flüsse)',
          'Kartenkompetenz (Maßstab, Höhenlinien, Legende) festigen',
          'Landwirtschaft und Industrie in Mitteldeutschland vergleichen'
        ]
      },
      {
        id: 'geo-78-1',
        doubleGrade: '7/8',
        title: 'Klimazonen der Erde, Plattentektonik & Naturkatastrophen',
        coreCompetencies: [
          'Klimadiagramme auswerten und Klimazonen zuordnen',
          'Plattentektonik, Vulkanismus und Erdbebenursachen erklären',
          'Schutzmaßnahmen vor tropischen Wirbelstürmen und Tsunamis untersuchen'
        ]
      },
      {
        id: 'geo-910-1',
        doubleGrade: '9/10',
        title: 'Globalisierung, Disparitäten & Klimawandel',
        coreCompetencies: [
          'Ursachen und Folgen des globalen Klimawandels anhand von Fallbeispielen belegen',
          'Entwicklungsländer vs. Industrieländer anhand von Indikatoren (HDI, BIP) vergleichen',
          'Nachhaltige Stadtentwicklung und Megacities analysieren'
        ]
      }
    ]
  },
  {
    id: 'geschichte',
    name: 'Geschichte',
    shortName: 'GE',
    category: 'Gesellschaftswissenschaftlich',
    allowedGrades: [6, 7, 8, 9, 10],
    icon: 'Landmark',
    topics: [
      {
        id: 'ge-56-1',
        doubleGrade: '5/6',
        title: 'Ur- und Frühgeschichte & Hochkultur Ägypten',
        coreCompetencies: [
          'Alt- und Jungsteinzeit (Neolithische Revolution) vergleichen',
          'Bedeutung des Nils und Gesellschaftspyramide im Alten Ägypten darstellen',
          'Quellenarten (Sach-, Bild-, Textquellen) unterscheiden'
        ]
      },
      {
        id: 'ge-78-1',
        doubleGrade: '7/8',
        title: 'Mittelalter: Ritter, Burgen, Städte & Reformation',
        coreCompetencies: [
          'Lehnswesen und Ständegesellschaft erklären',
          'Leben im Kloster und in mittelalterlichen Städten untersuchen',
          'Martin Luther und die Reformation in Thüringen (Wartburg) historisch einordnen'
        ]
      },
      {
        id: 'ge-78-2',
        doubleGrade: '7/8',
        title: 'Französische Revolution, Industrielle Revolution & Deutsches Kaiserreich',
        coreCompetencies: [
          'Ursachen und Phasen der Französischen Revolution (Freiheit, Gleichheit, Brüderlichkeit)',
          'Soziale Frage im Zuge der Industrialisierung analysieren',
          'Reichsgründung 1871 und Gesellschaft im Kaiserreich beurteilen'
        ]
      },
      {
        id: 'ge-910-1',
        doubleGrade: '9/10',
        title: 'Weimarer Republik, Nationalsozialismus & Zweiter Weltkrieg',
        coreCompetencies: [
          'Krisenjahre und Scheitern der Weimarer Republik aufzeigen',
          'NS-Diktatur, Propaganda, Rassenideologie und Holocaust kritisch aufarbeiten',
          'Erinnerungskultur und historische Verantwortung reflektieren'
        ]
      },
      {
        id: 'ge-910-2',
        doubleGrade: '9/10',
        title: 'Kalter Krieg, Teilung Deutschlands & Friedliche Revolution 1989',
        coreCompetencies: [
          'Konfrontation Ost vs. West und Bau der Berliner Mauer erklären',
          'Alltag in der DDR und BRD vergleichen',
          'Bedeutung des Herbstes 1989 und die deutsche Wiedervereinigung bewerten'
        ]
      }
    ]
  },
  {
    id: 'sozialkunde',
    name: 'Sozialkunde',
    shortName: 'SK',
    category: 'Gesellschaftswissenschaftlich',
    allowedGrades: [8, 9, 10],
    icon: 'Scale',
    topics: [
      {
        id: 'sk-78-1',
        doubleGrade: '7/8',
        title: 'Jugendliche in Familie, Peergroup & Rechtsordnung',
        coreCompetencies: [
          'Rollenkonflikte und Sozialisation im Jugendalter untersuchen',
          'Jugendschutzgesetz und Deliktfähigkeit kennen und anwenden',
          'Chancen und Risiken digitaler Kommunikationsplattformen reflektieren'
        ]
      },
      {
        id: 'sk-910-1',
        doubleGrade: '9/10',
        title: 'Demokratie in Deutschland: Grundgesetz, Wahlen & Verfassungsorgane',
        coreCompetencies: [
          'Grundrechte und Verfassungsprinzipien (Rechtsstaat, Bundesstaat, Sozialstaat) erläutern',
          'Wahlrechtsgrundsätze und Wahlsystem zum Deutschen Bundestag analysieren',
          'Zusammenspiel von Bundestag, Bundesrat, Bundesregierung und Bundesverfassungsgericht'
        ]
      },
      {
        id: 'sk-910-2',
        doubleGrade: '9/10',
        title: 'Die Europäische Union & Internationale Friedenssicherung (UNO, NATO)',
        coreCompetencies: [
          'Organe der EU (Europäisches Parlament, EU-Kommission, Rat) in ihren Aufgaben skizzieren',
          'Vorteile des EU-Binnenmarktes und Reisefreiheit darlegen',
          'Konfliktlösungsmechanismen der Vereinten Nationen beurteilen'
        ]
      }
    ]
  },

  // --- ÄSTHETISCH & SPORT ---
  {
    id: 'kunsterziehung',
    name: 'Kunsterziehung',
    shortName: 'KU',
    category: 'Ästhetisch & Sport',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Palette',
    topics: [
      {
        id: 'ku-56-1',
        doubleGrade: '5/6',
        title: 'Farbenlehre, Farbmodelle & Grafische Grundlagen',
        coreCompetencies: [
          'Grund- und Mischfarben nach dem Farbkreis von Itten anmischen',
          'Hell-Dunkel- und Kalt-Warm-Kontraste in eigenen Bildern gestalten',
          'Grafische Strukturen (Punkt, Linie, Schraffur) erproben'
        ]
      },
      {
        id: 'ku-78-1',
        doubleGrade: '7/8',
        title: 'Perspektive, Plastisches Gestalten & Druckgrafik',
        coreCompetencies: [
          'Ein- und Zweipunktperspektive in Raumzeichnungen anwenden',
          'Hochdruck (Linolschnitt) sicher planen und drucken',
          'Kunstwerke methodisch beschreiben und analysieren'
        ]
      },
      {
        id: 'ku-910-1',
        doubleGrade: '9/10',
        title: 'Moderne Kunstströmungen & Architektur / Produktdesign',
        coreCompetencies: [
          'Impressionismus, Expressionismus und Surrealismus stilistisch vergleichen',
          'Bauhaus-Prinzipien ("Form follows function") in Modellen umsetzen',
          'Kritische Bildanalyse von Werbe- und Propagandabildern'
        ]
      }
    ]
  },
  {
    id: 'musik',
    name: 'Musik',
    shortName: 'MU',
    category: 'Ästhetisch & Sport',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Music',
    topics: [
      {
        id: 'mu-56-1',
        doubleGrade: '5/6',
        title: 'Instrumentenkunde (Orchesterfamilien) & Rhythmuslehre',
        coreCompetencies: [
          'Saiten-, Blas-, Schlag- und Tasteninstrumente klanglich und optisch zuordnen',
          'Taktarten (4/4, 3/4) und Notenwerte im Notensystem lesen und klatschen',
          'Klassenmusizieren mit Rhythmusinstrumenten'
        ]
      },
      {
        id: 'mu-78-1',
        doubleGrade: '7/8',
        title: 'Musikgeschichte: Barock, Wiener Klassik & Romantik',
        coreCompetencies: [
          'Werke von Bach, Mozart und Beethoven analytisch hören',
          'Formenlehre (Sonatenhauptsatzform, Rondo) in Partituren mitverfolgen',
          'Programmmusik beschreiben und deuten'
        ]
      },
      {
        id: 'mu-910-1',
        doubleGrade: '9/10',
        title: 'Populäre Musik, Jazz, Rock & Filmmusik',
        coreCompetencies: [
          'Entwicklung vom Blues über Rock’n’Roll bis zum Hip-Hop nachzeichnen',
          'Leitmotivtechnik und Stimmungsuntermalung im Film analysieren',
          'Digitale Musikproduktion und Urheberrecht reflektieren'
        ]
      }
    ]
  },
  {
    id: 'sport',
    name: 'Sport',
    shortName: 'SP',
    category: 'Ästhetisch & Sport',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Activity',
    topics: [
      {
        id: 'sp-56-1',
        doubleGrade: '5/6',
        title: 'Grundlagen Leichtathletik, Turnen & Kleine Spiele',
        coreCompetencies: [
          'Lauf-, Sprung- und Wurftechniken koordinativ verbessern',
          'Rollen, Stützen und Balancieren an Turngeräten sicher ausführen',
          'Fairplay-Regeln in Team- und Fangspielen einhalten'
        ]
      },
      {
        id: 'sp-78-1',
        doubleGrade: '7/8',
        title: 'Sportspiele: Basketball, Volleyball & Fußball (Taktik & Technik)',
        coreCompetencies: [
          'Grundtechniken (Pritschen, Baggern, Dribbling, Passen) im Spiel anwenden',
          'Einfache Angriffs- und Abwehrformationen umsetzen',
          'Schiedsrichterfunktionen übernehmen und Regeln durchsetzen'
        ]
      },
      {
        id: 'sp-910-1',
        doubleGrade: '9/10',
        title: 'Fitness, Ausdauer, Trainingslehre & Gesundheitssport',
        coreCompetencies: [
          'Trainingsprinzipien zur Kraft- und Ausdauerverbesserung verstehen',
          'Pulsfrequenz messen und Belastungsintensität steuern',
          'Gesundheitliche Auswirkungen von Sport und Regeneration bewerten'
        ]
      }
    ]
  },

  // --- WERTE & ORIENTIERUNG ---
  {
    id: 'ethik',
    name: 'Ethik',
    shortName: 'ETH',
    category: 'Werte & Orientierung',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'HeartHandshake',
    topics: [
      {
        id: 'eth-56-1',
        doubleGrade: '5/6',
        title: 'Ich und die anderen: Freundschaft, Gefühle & Konflikte',
        coreCompetencies: [
          'Eigene Gefühle und Bedürfnisse wahrnehmen und ausdrücken',
          'Empathie für Mitschüler entwickeln und Vorurteile abbauen',
          'Strategien zur gewaltfreien Konfliktlösung (Ich-Botschaften) einüben'
        ]
      },
      {
        id: 'eth-78-1',
        doubleGrade: '7/8',
        title: 'Moral, Gerechtigkeit, Menschenrechte & Weltreligionen im Vergleich',
        coreCompetencies: [
          'Werte und Normen in verschiedenen Kulturen vergleichen',
          'Grundlegende Glaubensinhalte von Judentum, Christentum und Islam kennen',
          'Artikel der Allgemeinen Erklärung der Menschenrechte anwenden'
        ]
      },
      {
        id: 'eth-910-1',
        doubleGrade: '9/10',
        title: 'Angewandte Ethik: Umweltethik, Medizinethik & Verantwortung in der KI',
        coreCompetencies: [
          'Ethische Dilemmata (z. B. Autonomes Fahren, Tierversuche, Sterbehilfe) strukturiert analysieren',
          'Kants Kategorischen Imperativ und Utilitarismus auf Gegenwartsfragen beziehen',
          'Eigene Wertehierarchien begründen'
        ]
      }
    ]
  },
  {
    id: 'ev-religion',
    name: 'Evangelische Religion',
    shortName: 'EV-REL',
    category: 'Werte & Orientierung',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Cross',
    topics: [
      {
        id: 'ev-56-1',
        doubleGrade: '5/6',
        title: 'Die Bibel: Entstehung, Altes Testament & Schöpfungserzählungen',
        coreCompetencies: [
          'Aufbau der Bibel (AT und NT) und Auffinden von Bibelstellen',
          'Schöpfungserzählungen (Genesis) deuten und Schöpfungsverantwortung diskutieren',
          'Geschichten von Abraham, Sarah und Mose nacherzählen'
        ]
      },
      {
        id: 'ev-78-1',
        doubleGrade: '7/8',
        title: 'Jesus von Nazareth, Gleichnisse & Nächstenliebe',
        coreCompetencies: [
          'Historischen Kontext Palästinas zur Zeit Jesu beschreiben',
          'Gleichnisse (z. B. Der barmherzige Samariter, Der verlorene Sohn) auslegen',
          'Bergpredigt und Gebot der Feindesliebe auf heutige Situationen übertragen'
        ]
      },
      {
        id: 'ev-910-1',
        doubleGrade: '9/10',
        title: 'Kirche im Wandel: Reformation, Bekennende Kirche & Ökumene',
        coreCompetencies: [
          'Luthers reformatorische Erkenntnisse ("Allein aus Gnade") darlegen',
          'Widerstand christlicher Persönlichkeiten im Nationalsozialismus (z.B. Bonhoeffer) untersuchen',
          'Sinnfragen nach Leid, Tod und Auferstehung reflektieren'
        ]
      }
    ]
  },
  {
    id: 'kath-religion',
    name: 'Katholische Religion',
    shortName: 'KATH-REL',
    category: 'Werte & Orientierung',
    allowedGrades: [5, 6, 7, 8, 9, 10],
    icon: 'Cross',
    topics: [
      {
        id: 'kath-56-1',
        doubleGrade: '5/6',
        title: 'Kirchenjahr, Feste & Sakramente (Taufe, Eucharistie)',
        coreCompetencies: [
          'Feste im Kirchenjahr (Advent, Weihnachten, Ostern, Pfingsten) und deren Bedeutung kennen',
          'Symbole des christlichen Glaubens (Wasser, Licht, Brot, Kreuz) deuten',
          'Kirchenraum und liturgische Gegenstände erkunden'
        ]
      },
      {
        id: 'kath-78-1',
        doubleGrade: '7/8',
        title: 'Propheten des Alten Testaments & Kirchliches Leben in der Gemeinde',
        coreCompetencies: [
          'Botschaft biblischer Propheten (Amos, Jesaja) zur sozialen Gerechtigkeit verstehen',
          'Aufgaben der katholischen Kirche und caritatives Engagement (Caritas) beschreiben',
          'Ökumenische Zusammenarbeit vor Ort erkunden'
        ]
      },
      {
        id: 'kath-910-1',
        doubleGrade: '9/10',
        title: 'Gottesbilder, Theodizee-Frage & Christliche Soziallehre',
        coreCompetencies: [
          'Die Theodizee-Frage ("Wie kann Gott das Leid zulassen?") differenziert diskutieren',
          'Prinzipien der Katholischen Soziallehre (Personalität, Solidarität, Subsidiarität) anwenden',
          'Christliche Hoffnung auf Vollendung und Auferstehung darlegen'
        ]
      }
    ]
  },

  // --- WAHLPFLICHTBEREICH ---
  {
    id: 'informatik',
    name: 'Informatik & Medienbildung',
    shortName: 'INF',
    category: 'Wahlpflichtbereich',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Binary',
    topics: [
      {
        id: 'inf-78-1',
        doubleGrade: '7/8',
        title: 'Algorithmen, Flussdiagramme & Visuelle Programmierung (Scratch)',
        coreCompetencies: [
          'Algorithmen mit Kontrollstrukturen (Sequenz, Verzweigung, Schleife) formulieren',
          'Einfache interaktive Programme und Spiele visuell entwickeln',
          'Dateiverwaltung, Datensicherheit und Urheberrecht beachten'
        ]
      },
      {
        id: 'inf-910-1',
        doubleGrade: '9/10',
        title: 'Webtechnologien (HTML/CSS), Netzwerke & Datenschutz (DSGVO)',
        coreCompetencies: [
          'Strukturierte Webseiten mit semantischem HTML und CSS gestalten',
          'Funktionsweise des Internets (IP-Adressen, DNS, Client-Server-Prinzip) erklären',
          'Persönlichkeitsrechte, Verschlüsselung und Datenschutzgesetze beurteilen'
        ]
      }
    ]
  },
  {
    id: 'darstellen-gestalten',
    name: 'Darstellen & Gestalten',
    shortName: 'DG',
    category: 'Wahlpflichtbereich',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Theater',
    topics: [
      {
        id: 'dg-78-1',
        doubleGrade: '7/8',
        title: 'Körpersprache, Pantomime & Raumorientierung auf der Bühne',
        coreCompetencies: [
          'Körperhaltung, Gestik und Mimik gezielt zur Figurendarstellung einsetzen',
          'Bühnenraum gliedern und choreografische Bewegungsmuster umsetzen',
          'Feedbackregeln für Spielszenen anwenden'
        ]
      },
      {
        id: 'dg-910-1',
        doubleGrade: '9/10',
        title: 'Szenische Collagen, Theaterproduktion & Dramaturgie',
        coreCompetencies: [
          'Eigene Texte dramaturgisch bearbeiten und inszenieren',
          'Zusammenspiel von Licht, Ton, Kostüm und Bühnenbild koordinieren',
          'Öffentliche Aufführungen organisieren und reflektieren'
        ]
      }
    ]
  },
  {
    id: 'natur-technik',
    name: 'Natur & Technik (Wahlpflicht)',
    shortName: 'NuT',
    category: 'Wahlpflichtbereich',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Cpu',
    topics: [
      {
        id: 'nut-78-1',
        doubleGrade: '7/8',
        title: 'Erneuerbare Energien & Modellbau (Solar, Wind, Wasser)',
        coreCompetencies: [
          'Funktionsweise von Solarzellen und Windkraftgeneratoren im Experiment ermitteln',
          'Funktionstüchtige Modelle planen, berechnen und fertigen',
          'Ökologische und ökonomische Aspekte der Energiewende vergleichen'
        ]
      },
      {
        id: 'nut-910-1',
        doubleGrade: '9/10',
        title: 'Sensorik, Messwerterfassung & Mikrocontroller (z.B. Arduino / Calliope)',
        coreCompetencies: [
          'Sensoren (Temperatur, Helligkeit, Ultraschall) ansteuern und Messdaten auswerten',
          'Steuerungs- und Regelungsprozesse programmieren',
          'Automatisierungssysteme im Alltag analysieren'
        ]
      }
    ]
  },
  {
    id: 'franzoesisch',
    name: 'Französisch (2. Fremdsprache)',
    shortName: 'FR',
    category: 'Wahlpflichtbereich',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Languages',
    topics: [
      {
        id: 'fr-78-1',
        doubleGrade: '7/8',
        title: 'Se présenter, la famille, l’école et les loisirs',
        coreCompetencies: [
          'Sich vorstellen, über Vorlieben und Alltag sprechen',
          'Präsens regelmäßiger Verben (-er) und grundlegender unregelmäßiger Verben (être, avoir, aller)',
          'Zahlen, Uhrzeiten und Wochentage im Dialog anwenden'
        ]
      },
      {
        id: 'fr-910-1',
        doubleGrade: '9/10',
        title: 'Paris, la vie en France & Passé Composé',
        coreCompetencies: [
          'Erlebnisse im Passé Composé berichten',
          'Wegbeschreibungen und Speisekartendialoge in Paris meistern',
          'Kulturelle Besonderheiten Frankreichs und der Frankophonie kennenlernen'
        ]
      }
    ]
  },
  {
    id: 'russisch',
    name: 'Russisch (2. Fremdsprache)',
    shortName: 'RU',
    category: 'Wahlpflichtbereich',
    allowedGrades: [7, 8, 9, 10],
    icon: 'Languages',
    topics: [
      {
        id: 'ru-78-1',
        doubleGrade: '7/8',
        title: 'Kyrillisches Alphabet, Familie & Freizeit (Знакомство)',
        coreCompetencies: [
          'Kyrillische Druck- und Schreibschrift lesen und schreiben',
          'Einfache Begrüßungs- und Vorstellungsdialoge führen',
          'Präsens der ersten Konjugation anwenden'
        ]
      },
      {
        id: 'ru-910-1',
        doubleGrade: '9/10',
        title: 'Moskau, Reise & Vergangenheitsformen (Путешествие)',
        coreCompetencies: [
          'Über Ferien und Erlebnisse in der Vergangenheit berichten',
          'Sehenswürdigkeiten in Moskau und St. Petersburg beschreiben',
          'Präpositional- und Akkusativendungen sicher einsetzen'
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
