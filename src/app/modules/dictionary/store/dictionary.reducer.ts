import * as dictionary from './dictionary.actions';
import * as _ from 'lodash';
import {DictionaryState} from './dictionary.state';

export function dictionaryReducer(state: DictionaryState[] = [], action: dictionary.DictionaryAction) {
  switch (action.type) {
    case dictionary.DictionaryActions.ADD:
      return [
        ...state,
        ...action.payload
          .map((id) => {
            return {
              id: id,
              name: undefined,
              description: undefined,
              progress: {
                loading: true,
                loadingSucceeded: false,
                loadingFailed: false
              }
            };
          }).filter(dictionaryObject => !_.find(state, ['id', dictionaryObject.id]))
      ];

    case dictionary.DictionaryActions.UPDATE:
      const correspondingDictionary: DictionaryState = _.find(state, ['id', action.payload.id]);
      const dictionaryIndex = _.findIndex(state, correspondingDictionary);

      return dictionaryIndex !== -1 ? [
        ...state.slice(0, dictionaryIndex),
        {
          ...correspondingDictionary,
          ...action.payload,
          progress: {...action.payload.progress}
          },
        ...state.slice(dictionaryIndex + 1)
      ] : [...state];
    default:
      return state;
  }
}
