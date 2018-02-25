import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-patching-modal',
  templateUrl: './patching-modal.component.html',
  styleUrls: ['./patching-modal.component.scss']
})
export class PatchingModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PatchingModalComponent>) { }

  ngOnInit() {
  }

}
