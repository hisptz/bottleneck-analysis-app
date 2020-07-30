import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-metadata-list',
  templateUrl: './metadata-list.component.html',
  styleUrls: ['./metadata-list.component.css'],
})
export class MetadataListComponent implements OnInit {
  @Input() metadataIdentifiers: any;
  @Output() selectedMetadataId = new EventEmitter<string>();
  @Output() loadedMetadataInfo = new EventEmitter<any>();
  @Output() metadataGroups = new EventEmitter<any>();
  activeMetadataType = 'indicator';
  constructor() {}

  ngOnInit() {}

  selectedMetadataIdentifier(e) {
    this.selectedMetadataId.emit(e);
  }

  loadedMetadata(data) {
    this.loadedMetadataInfo.emit(data);
  }

  selectedMetadataGroups(groups) {
    this.metadataGroups.emit(groups);
  }

  getActiveMetadataType(type) {
    this.activeMetadataType = type;
  }
}
