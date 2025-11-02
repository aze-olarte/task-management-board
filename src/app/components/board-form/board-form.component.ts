import { Component, input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { TaskPriority, TaskStatus } from '../../core/models/task.type';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
  ],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.scss',
})
export class BoardFormComponent {
  isNew = input<boolean>(true);
  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>('todo', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<TaskPriority>('low', {
      nonNullable: true,
    }),
    dueDate: new FormControl(new Date()),
  });

  constructor(private modalRef: NzModalRef, private taskService: TaskService, private notificationService: NotificationService) {}

  close(data?: Task) {
    this.modalRef.close(data);
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      id: 0,
    };

    this.taskService.addTask(payload).subscribe({
      next: (data) => {
        this.notificationService.showSuccess('Task Created')
        this.close(data);
      },
      error: (error) => this.notificationService.showError(error)
    });
  }
}

export interface BoardFormProps {
  isNew: boolean;
}
