export interface CreateTask {
  title: string;
  description: string;
  date: Date;
  userId?: string;
  subTasks?: [SubTask];
  importance: string;
}
export interface SubTask {
  userId?: string;
  id?: string;
  title: string;
  description: string;
}
