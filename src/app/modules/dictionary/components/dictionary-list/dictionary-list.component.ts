import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {DictionaryStoreService} from '../../services/dictionary-store.service';
import {Observable} from 'rxjs/Observable';
import {DictionaryState} from '../../store/dictionary.state';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DictionaryListComponent implements OnInit {

  @Input() metadataIdentifiers: Array<string>;
  dictionaryList$: Observable<DictionaryState[]>;
  activeItem: number;

  constructor(private dictionaryStoreService: DictionaryStoreService) {
    this.dictionaryList$ = Observable.of([]);
    this.activeItem = 0;
  }

  ngOnInit() {
    if (this.metadataIdentifiers.length > 0) {
      this.dictionaryStoreService.initializeInfo(this.metadataIdentifiers);
      this.dictionaryList$ = this.dictionaryStoreService.getInfo(this.metadataIdentifiers);
    }
  }

  setActiveItem(index) {
    if (this.activeItem === index) {
      this.activeItem = -1;
    } else {
      this.activeItem = index;
    }
  }

}
