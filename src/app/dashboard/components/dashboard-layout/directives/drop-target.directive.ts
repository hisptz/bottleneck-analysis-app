import {Directive, HostListener, EventEmitter, Output, Input} from '@angular/core';

@Directive({
  selector: '[dropTarget]'
})
export class DropTargetDirective {

  @Input()
  set dropTarget(options: DropTargetOptions) {
    if (options) {
      this.options = options;
    }
  }

  @Output('drop') drop = new EventEmitter();

  private options: DropTargetOptions = {};

  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    const { zone = 'zone', data = {} } = this.options;

    if (event.dataTransfer.types.indexOf(`application/x-${zone}`) >= 0) {
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    const { zone = 'zone' } = this.options;

    if(event.dataTransfer){
      const data = JSON.parse(event.dataTransfer.getData(`application/x-${zone}`));
      this.drop.next(data);
    }
  }
}
export interface DropTargetOptions {
  zone?: string;
  data?:any
}
