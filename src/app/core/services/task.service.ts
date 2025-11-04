import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment';
import {
  Task,
  TaskFilter,
  TaskGroupedByStatus,
  TaskPayload,
  TaskQuery,
} from '../models/task.model';
import { TaskStatus } from '../models/task.type';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasksGroupedByStatus(
    query: TaskQuery | null
  ): Observable<TaskGroupedByStatus> {
    let params = new HttpParams();

    if (query) {
      const { filters, sort } = query;

      if (sort.field && sort.field !== 'priority') {
        params = params.append('_sort', query.sort.field);
        params = params.append('_order', query.sort.dir || 'asc');
      }

      if (filters) {
        if (filters.status?.length) {
          filters.status.forEach((status) => {
            params = params.append('status', status);
          });
        }

        if (filters.priority?.length) {
          filters.priority.forEach((priority) => {
            params = params.append('priority', priority);
          });
        }

        if (filters.dueDate?.length) {
          const [start, end] = filters.dueDate;
          if (start) {
            params = params.append('dueDate_gte', start.toISOString());
          }
          if (end) {
            params = params.append('dueDate_lte', end.toISOString());
          }
        }
      }
    }

    return this.http.get<Task[]>(this.baseUrl, { params }).pipe(
      map((tasks) => {

        // This is a quick work around, since we're only saving priority as a string. At this point, changing priority 
        // from string to {id: number, name: string} type would lead to more changes which will not fit the time constraint
        if (query?.sort?.field === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          tasks.sort((a, b) => {
            const aVal = priorityOrder[a.priority];
            const bVal = priorityOrder[b.priority];
            return query.sort?.dir === 'asc' ? aVal - bVal : bVal - aVal;
          });
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
