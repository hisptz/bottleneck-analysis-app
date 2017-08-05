import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'layer-form',
  templateUrl: './layer-form.component.html',
  styleUrls: ['./layer-form.component.css']
})
export class LayerFormComponent implements OnInit {
  @Input() layer: any;
  constructor() { }

  ngOnInit() {
  }

}
