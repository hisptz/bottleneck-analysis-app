import {Directive, Input, HostBinding, HostListener} from '@angular/core';

export interface DraggableOptions {
  zone?: string;
  data?: any;
}

@Directive({
  selector: '[appDragabble]'
})
export class DragabbleDirective {

  @HostBinding('draggable')
  get draggable() {
    return true;
  }

  @Input()
  set appDraggable(options: DraggableOptions) {
    if (options) {
      this.options = options;
    }
  }

  private options: DraggableOptions = {};

  @HostListener('dragstart', ['$event'])
  onDragStart(event) {
    const { zone = 'zone', data = {} } = this.options;

    event.dataTransfer.setData(`application/x-${zone}`, JSON.stringify(data));
  }

  constructor() { }

}
