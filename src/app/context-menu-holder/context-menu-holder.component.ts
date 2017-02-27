import { Component, OnInit } from '@angular/core';
import {ContextMenuService} from "../context-menu.service";

@Component({
  selector: 'app-context-menu-holder',
  templateUrl: './context-menu-holder.component.html',
  styleUrls: ['./context-menu-holder.component.css'],
  host:{
    '(document:click)':'clickedOutside()'
  }
})
export class ContextMenuHolderComponent {

  links = [];
  isShown = false;
  private mouseLocation :{left:number,top:number} = {left:0,top:0};

  constructor(private _contextMenuService:ContextMenuService){
    this._contextMenuService.show.subscribe(e => this.showMenu(e.event,e.obj));
  }
  // the css for the container div
  get locationCss(){
    return {
      'position':'fixed',
      'display':this.isShown ? 'block':'none',
      left:this.mouseLocation.left + 'px',
      top:this.mouseLocation.top + 'px',
    };
  }
  clickedOutside(){
    this.isShown= false; // hide the menu
  }

  // show the menu and set the location of the mouse
  showMenu(event,links){
    this.isShown = true;
    this.links = links;
    this.mouseLocation = {
      left:event.clientX,
      top:event.clientY
    }
  }
}
