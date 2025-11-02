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
    NzButtonModule
  ],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.scss',
})
export class BoardFormComponent {
  isNew = input<boolean>(true);
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    status: new FormControl('todo', Validators.required),
    priority: new FormControl(undefined),
    dueDate: new FormControl(new Date()),
  });

  constructor(private modalRef: NzModalRef){}

  close() {
    this.modalRef.close();
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    
  }
}

export interface BoardFormProps {
  isNew: boolean;
}
