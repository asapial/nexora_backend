
export interface iCreateCluster {
  name: string;
  slug: string;
  description?: string;
  batchTag?: string;
  teacherId: string;
  organizationId?: string;
  emails?:string[];
}

export interface AddMembersResult {
  added: string[];
  invited: string[];
  alreadyMember: string[];
}

export interface ClusterHealthBreakdown {
  score: number; // 0–100
  colour: "green" | "amber" | "red";
  taskSubmissionRate: number;
  attendanceRate: number;
  homeworkCompletionRate: number;
  recentActivityScore: number;
}