export interface ICreateSession {
  clusterId: string;
  title: string;
  description?: string;
  date: string; // ISO datetime
  location?: string;
  deadline?: string;
  templateId?: string;
}

export interface IUpdateSession {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  deadline?: string;
  templateId?: string;
}

export interface IAttendanceRecord {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "EXCUSED";
  note?: string;
}

export interface IAgendaBlock {
  startTime: string;
  durationMins: number;
  topic: string;
  presenter?: string;
}

export interface IReplayNote {
  timestamp: string;
  note: string;
}

export interface IAttachReplay {
  recordingUrl: string;
  notes?: IReplayNote[];
}
