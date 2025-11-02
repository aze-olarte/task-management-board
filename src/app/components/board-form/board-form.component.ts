import { Component, effect, Inject, Input, input, signal } from '@angular/core';
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
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
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

  constructor(
    private modalRef: NzModalRef,
    private taskService: TaskService,
    private notificationService: NotificationService,
    @Inject(NZ_MODAL_DATA) public props: BoardFormProps
  ) {
    if (props.data) {
      this.prefillForm(props.data);
    }
  }

  close(data?: Task) {
    this.modalRef.close(data);
  }

  prefillForm(data: Task) {
    this.form.patchValue({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
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
      id: this.props.data ? (this.props.data as Task).id : 0,
    };
    const isNew = payload.id === 0;

    const observable$ = isNew
      ? this.taskService.addTask(payload)
      : this.taskService.updateTask(payload.id, payload);

    observable$.subscribe({
      next: (data) => {
        const message = `Task ${isNew ? 'Created' : 'Updated'}`;
        this.notificationService.showSuccess(message);
        this.close(data);
      },
      error: (error) => this.notificationService.showError(error),
    });
  }
}

export interface BoardFormProps {
  data?: Task;
}
