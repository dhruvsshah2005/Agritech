export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface KnowledgeDoc {
  id?: number | string;
  crop: string;
  topic: string;
  content: string;
  source: string;
  embedding?: number[];
}

export interface EmergencyAlert {
  id: string | number;
  district: string;
  type: "weather" | "pest" | "crop" | "market";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  timestamp: string;
  actionRequired?: string;
  read?: boolean;
}

export interface BroadcastAlertPayload {
  district: string;
  type: "weather" | "pest" | "crop" | "market";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  actionRequired?: string;
}
