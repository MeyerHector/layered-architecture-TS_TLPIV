export interface CreateTask {
  title: string;
  description: string;
  date: Date;
  importance: string;
  userId?: string;
  subTasks?: [SubTask];
}
export interface SubTask {
  userId?: string;
  id?: string;
  title: string;
  description: string;
}

