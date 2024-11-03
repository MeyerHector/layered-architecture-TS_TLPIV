export interface CreateTask {
  title: string;
  description: string;
  date: Date;
  userId?: string;
  subTasks?: [SubTask];
}
export interface SubTask {
  title: string;
  description: string;
}
