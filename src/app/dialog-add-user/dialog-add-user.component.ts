import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';


@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogTitle, 
    MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule],
  templateUrl: './dialog-add-user.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {

}
