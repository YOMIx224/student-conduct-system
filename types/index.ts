export type Role = 'admin' | 'teacher' | 'student';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  department: string;
  conductScore: number;
  phone?: string;
  email?: string;
}

export type AppealStatus = 'pending' | 'approved' | 'rejected';

export interface Appeal {
  id: string;
  byStudentId: string;
  message: string;
  image?: string;
  submittedAt: string;
  status: AppealStatus;
  teacherResponse?: string;
  respondedAt?: string;
  restoredPoints?: number;
}

export interface Violation {
  id: string;
  studentId: string;
  studentName: string;
  violationType: string;
  pointsDeducted: number;
  description: string;
  location: string;
  date: string;
  time: string;
  recordedBy: string;
  appeals?: Appeal[];
}

export interface UserAccount {
  username: string;
  password: string;
  role: Role;
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}