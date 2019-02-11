import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LESS_THAN, GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL } from '../../utils/icons';
@Component({
  selector: 'app-download-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './download-legend.component.html',
  styleUrls: ['./download-legend.component.css']
})
export class DownloadLegendComponent implements OnChanges {
  @Input() currentLegendSets;
  public thematicLayerLegendSet;
  greaterThanOrEqualIcon: any;
  lessThanIcon;
  lessThanOrEqualIcon;

  constructor(private domSanitizer: DomSanitizer) {
    this.greaterThanOrEqualIcon = domSanitizer.bypassSecurityTrustUrl(GREATER_THAN_OR_EQUAL);
    this.lessThanIcon = domSanitizer.bypassSecurityTrustUrl(LESS_THAN);
    this.lessThanOrEqualIcon = domSanitizer.bypassSecurityTrustUrl(LESS_THAN_OR_EQUAL);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { currentLegendSets } = changes;
    if (currentLegendSets && currentLegendSets.currentValue) {
      const thematicKey = Object.keys(this.currentLegendSets).find(
        key => this.currentLegendSets[key].legend && this.currentLegendSets[key].legend.type === 'thematic'
      );
      const thematicLegend = this.currentLegendSets[thematicKey] && this.currentLegendSets[thematicKey].legend;
      const { usePatterns, items } = thematicLegend;

      const newItems = items.map(item => ({
        ...item,
        repName: `${item.name || ''} ${item.startValue} - ${item.endValue} (${item.count})`,
        style: {
          backgroundImage: usePatterns ? `url(assets/icons/${item.pattern}.png)` : 'none',
          backgroundColor: !usePatterns ? item.color : 'transparent',
          width: '40px',
          maxHeight: '25px'
        }
      }));

      this.thematicLayerLegendSet = { ...thematicLegend, items: newItems };
    }
  }
}
