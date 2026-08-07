import { Patient, TimelineEvent, AIDecision, AnalyticsData } from "@/types";

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "PT-1029",
    name: "Eleanor Vance",
    age: 68,
    gender: "Female",
    room: "ICU-04",
    admittedAt: "2024-05-12T08:30:00Z",
    severity: "critical",
    diagnosis: "Acute Myocardial Infarction",
    vitals: {
      heartRate: 110,
      bloodPressure: "90/60",
      oxygenLevel: 92,
      temperature: 37.8,
    },
  },
  {
    id: "PT-1030",
    name: "James Holden",
    age: 45,
    gender: "Male",
    room: "ER-12",
    admittedAt: "2024-05-12T10:15:00Z",
    severity: "warning",
    diagnosis: "Severe Asthma Exacerbation",
    vitals: {
      heartRate: 95,
      bloodPressure: "135/85",
      oxygenLevel: 94,
      temperature: 37.1,
    },
  },
  {
    id: "PT-1031",
    name: "Sarah Connor",
    age: 32,
    gender: "Female",
    room: "WARD-A2",
    admittedAt: "2024-05-11T14:20:00Z",
    severity: "safe",
    diagnosis: "Appendectomy Recovery",
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      oxygenLevel: 99,
      temperature: 36.8,
    },
  },
  {
    id: "PT-1032",
    name: "Miles Dyson",
    age: 55,
    gender: "Male",
    room: "ICU-02",
    admittedAt: "2024-05-12T05:45:00Z",
    severity: "critical",
    diagnosis: "Sepsis",
    vitals: {
      heartRate: 125,
      bloodPressure: "85/55",
      oxygenLevel: 90,
      temperature: 39.2,
    },
  },
  {
    id: "PT-1033",
    name: "Ellen Ripley",
    age: 42,
    gender: "Female",
    room: "ER-05",
    admittedAt: "2024-05-12T11:30:00Z",
    severity: "warning",
    diagnosis: "Head Trauma",
    vitals: {
      heartRate: 88,
      bloodPressure: "140/90",
      oxygenLevel: 97,
      temperature: 37.0,
    },
  },
];

export const MOCK_TIMELINE: TimelineEvent[] = [
  {
    id: "EV-1",
    time: "08:30 AM",
    title: "Patient Admitted",
    description: "Admitted to ICU via Emergency Room",
    type: "note",
  },
  {
    id: "EV-2",
    time: "08:45 AM",
    title: "Vitals Recorded",
    description: "BP 90/60, HR 110, SpO2 92%",
    type: "vitals",
  },
  {
    id: "EV-3",
    time: "09:00 AM",
    title: "Lab Results",
    description: "Troponin elevated: 2.5 ng/mL",
    type: "lab",
  },
  {
    id: "EV-4",
    time: "09:15 AM",
    title: "Medication Administered",
    description: "Aspirin 325mg, Heparin drip started",
    type: "medication",
  },
];

export const MOCK_AI_DECISION: AIDecision = {
  confidence: 94,
  primaryDiagnosis: "Acute STEMI (Inferior)",
  differentialDiagnoses: [
    "Aortic Dissection",
    "Pulmonary Embolism",
    "Acute Pericarditis",
  ],
  immediateActions: [
    "Activate Cath Lab immediately",
    "Administer Nitroglycerin SL",
    "Prepare for possible intubation",
  ],
  reasoning: "Patient presents with classic symptoms of inferior wall myocardial infarction. Elevated troponin levels and ST-segment elevation in leads II, III, and aVF strongly support this diagnosis. Hemodynamic instability (BP 90/60) warrants urgent intervention.",
};

export const MOCK_ANALYTICS: AnalyticsData = {
  latency: 42, // ms
  avgConfidence: 91.5, // %
  patientsCount: 248,
  criticalCases: 14,
};
