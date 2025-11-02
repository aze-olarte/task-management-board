import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { Task, TaskGroupedByStatus, TaskPayload } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = `${environment.apiBaseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasksGroupedByStatus(): Observable<TaskGroupedByStatus> {
    return this.http.get<Task[]>(this.baseUrl).pipe(
      map((tasks) => {
        const grouped: TaskGroupedByStatus = {
          todo: [],
          'in-progress': [],
          done: [],
        };

        tasks.forEach((task) => {
          grouped[task.status].push(task);
        });
        return grouped;
      })
    );
  }

  addTask(payload: TaskPayload) {
    return this.http.post<Task>(this.baseUrl, payload);
  }
}
