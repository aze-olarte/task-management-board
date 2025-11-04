import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment';
import {
  Task,
  TaskFilter,
  TaskGroupedByStatus,
  TaskPayload,
} from '../models/task.model';
import { TaskStatus } from '../models/task.type';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasksGroupedByStatus(
    filters: TaskFilter | null
  ): Observable<TaskGroupedByStatus> {
    let params = new HttpParams();

    // * Server-side filtering is not working. Due to time constraints, I've used client side filtering as a work around
    // if (filters) {
    //   if (filters.status?.length) {
    //     filters.status.forEach(status => {
    //       params = params.append('status', status);
    //     });
    //   }

    //   if (filters.priority?.length) {
    //     filters.priority.forEach(priority => {
    //       params = params.append('priority', priority);
    //     });
    //   }

    //   if (filters.dueDate?.length) {
    //     const [start, end] = filters.dueDate;
    //     if (start) {
    //       params = params.append('dueDate_gte', start.toISOString());
    //     }
    //     if (end) {
    //       params = params.append('dueDate_lte', end.toISOString());
    //     }
    //   }
    // }

    return this.http.get<Task[]>(this.baseUrl, { params }).pipe(
      map((tasks) => {
        // Client-side filtering (work around)
        if (filters) {
          if (filters.status?.length) {
            tasks = tasks.filter((task) =>
              filters.status.includes(task.status)
            );
          }
          if (filters.priority?.length) {
            tasks = tasks.filter((task) =>
              filters.priority.includes(task.priority)
            );
          }

          if (filters.dueDate?.length === 2) {
            const [start, end] = filters.dueDate;
            const startTime = new Date(start);
            startTime.setHours(0, 0, 0, 0);
            const endTime = new Date(end);
            endTime.setHours(23, 59, 59, 999);

            tasks = tasks.filter(
              (task) =>
                task.dueDate &&
                new Date(task.dueDate).getTime() >= startTime.getTime() &&
                new Date(task.dueDate).getTime() <= endTime.getTime()
            );
          }
        }

        const grouped: TaskGroupedByStatus = {
          todo: [],
          'in-progress': [],
          done: [],
        };
        tasks.forEach((task) => grouped[task.status].push(task));
        return grouped;
      })
    );
  }

  addTask(payload: TaskPayload) {
    return this.http.post<Task>(this.baseUrl, payload);
  }

  updateTask(id: number, payload: TaskPayload) {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, payload);
  }

  patchTaskStatus(id: number, status: TaskStatus) {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, { status });
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
