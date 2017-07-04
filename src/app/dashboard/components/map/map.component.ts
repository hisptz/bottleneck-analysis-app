import {Component, Input, OnInit} from '@angular/core';
import {Visualization} from '../../model/visualization';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../../store/application-state';
import {apiRootUrlSelector} from '../../../store/selectors/api-root-url.selector';
import {
  GetMapConfigurationAction, LoadGeoFeatureAction, LoadLegendSetAction,
  LoadOrgUnitGroupSetAction
} from '../../../store/actions';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() visualizationObject: Visualization;
  constructor(private store: Store<ApplicationState>) { }

  ngOnInit() {
    if (!this.visualizationObject.details.loaded) {
      if (this.visualizationObject.layers.length > 0) {
        /**
         * Get map configuration
         */
        this.store.dispatch(new GetMapConfigurationAction(this.visualizationObject))

        if (this.visualizationObject.details.analyticsLoaded) {
            this.store.select(apiRootUrlSelector).subscribe(apiRootUrl => {
              if (apiRootUrl !== '') {
                /**
                 * Load geo features
                 */
                this.store.dispatch(new LoadGeoFeatureAction({apiRootUrl: apiRootUrl, visualizationObject: this.visualizationObject}));

                /**
                 * Load legend set if needed
                 */
                this.store.dispatch(new LoadLegendSetAction({
                  apiRootUrl: apiRootUrl,
                  visualizationObject: this.visualizationObject
                }))

                /**
                 * Load group set if any
                 */
                this.store.dispatch(new LoadOrgUnitGroupSetAction({
                  apiRootUrl: apiRootUrl,
                  visualizationObject: this.visualizationObject
                }))
              }
            })
        }

      }
    }
  }

}
