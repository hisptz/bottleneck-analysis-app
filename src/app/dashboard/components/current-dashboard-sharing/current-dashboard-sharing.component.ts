import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { SHARE_ICON } from '../../../icons';

@Component({
  selector: 'app-current-dashboard-sharing',
  templateUrl: './current-dashboard-sharing.component.html',
  styleUrls: ['./current-dashboard-sharing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardSharingComponent implements OnInit {
  @Input() id: string;
  shareIcon: string;
  showShareBlock: boolean;
  constructor() {
    this.shareIcon = SHARE_ICON;
  }

  ngOnInit() {}
}
