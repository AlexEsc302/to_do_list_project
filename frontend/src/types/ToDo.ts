export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ToDo {
  id: number;
  name: string;
  priority: Priority;
  dueDate: string | null;
  done: boolean;
  doneDate: string | null;
}

