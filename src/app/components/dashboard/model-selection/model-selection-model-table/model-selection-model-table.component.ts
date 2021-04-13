import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-model-selection-model-table',
  templateUrl: './model-selection-model-table.component.html',
  styleUrls: ['./model-selection-model-table.component.css'],
})
export class ModelSelectionModelTableComponent implements OnInit {

  dataSource = [
    {
      Models: 'Model #1',
      id: '1'
    }
  ];
  columnsToDisplay = ['Models'];
  expandedElement: any | null;

  @Output() modelSelectedEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * When users selects a model from the table of models, an event
   * is emitted to notify the parents of the selection and update
   * their UIs.
   * @param value - pipeline id and model id
   */
  modelSelected(value: any) {
    this.modelSelectedEvent.emit(value);
  }
}
