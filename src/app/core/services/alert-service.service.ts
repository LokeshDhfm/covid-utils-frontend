import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(private snackBar: MatSnackBar) { }

  public alert(message: string, time: number){
    // this.snackBar.dismiss();
    // this.snackBar._openedSnackBarRef._dismissAfter(30000);
    this.snackBar.open(message,'✖',{
      duration: time,
      verticalPosition: "bottom",
      horizontalPosition: "center"
    })
  }
}
