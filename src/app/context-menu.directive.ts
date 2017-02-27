import {Directive, Input} from '@angular/core';
import {ContextMenuService} from "./context-menu.service";

@Directive({
  selector: '[appContextMenu]',
  host:{'(contextmenu)':'rightClicked($event)'}
})
export class ContextMenuDirective {

  @Input() contextmenu;
  constructor(private _contextMenuService:ContextMenuService){
  }
  rightClicked(event:MouseEvent){
    this._contextMenuService.show.next({event:event,obj:this.contextmenu});
    event.preventDefault(); // to prevent the browser contextmenu
  }

}
