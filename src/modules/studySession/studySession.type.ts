export interface ICreateSession {
  clusterId: string;
  title: string;
  description?: string;
  scheduledAt: string;      // ISO datetime
  location?: string;
  taskDeadline?: string;    // ISO datetime
  templateId?: string;
  taskMode?: "template" | "individual" | "none"; // default "template" if templateId provided, else "none"
  individualTasks?: Array<{
    studentProfileId: string;
    title: string;
    description?: string;
  }>;
}
export interface IUpdateSession {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  deadline?: string;
  templateId?: string;
  status?:string;
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
