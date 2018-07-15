import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-current-dashboard-title',
  templateUrl: './current-dashboard-title.component.html',
  styleUrls: ['./current-dashboard-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentDashboardTitleComponent implements OnInit {
  @Input() currentDashboardTitle: string;
  constructor() {}

  ngOnInit() {}
}
