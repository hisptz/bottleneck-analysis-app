import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {createSelector, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {DictionaryState} from '../store/dictionary.state';
import {AppState} from '../../../store/app.reducers';
import * as DictionaryActions from '../store/dictionary.actions';

@Injectable()
export class DictionaryStoreService {

  private dictionaryState = (state: AppState) => state.metadataDictionary;

  constructor(private store: Store<AppState>) {
  }

  getInfo(metadataIdentifiers: Array<string>): Observable<DictionaryState[]> {
    return this.store.select(createSelector(this.dictionaryState, (dictionary: DictionaryState[]) => metadataIdentifiers
        .map(metadataIdentifier => _.find(dictionary, ['id', metadataIdentifier]))
        .filter(dictionaryObject => dictionaryObject)));
  }

  initializeInfo(metadataIdentifiers: Array<string>) {
    this.store.dispatch(new DictionaryActions.InitializeAction(metadataIdentifiers));
  }

}
