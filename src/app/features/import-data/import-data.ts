import { Component } from '@angular/core';
import { SportImport } from '../sport/sport-import/sport-import';

@Component({
  selector: 'app-import-data',
  imports: [SportImport],
  templateUrl: './import-data.html',
  styleUrl: './import-data.css',
})
export class ImportData {}
