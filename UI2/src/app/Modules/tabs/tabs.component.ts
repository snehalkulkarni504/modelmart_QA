import { Component, Input } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      <ul class="tab-group">
        <li *ngFor="let tab of tabs; index as i"
          class="tab" [class.active]="tab.active"
          (click)="changeTab(i)">
          <i class="icon" [ngClass]="tab.iconClass"></i>
          {{tab.title}}
        </li>
      </ul>
      <div class="tab-content-group">
        <ng-container *ngFor="let tab of tabs">
          <div class="tab-content" *ngIf="tab.active" [innerHTML]="tab.content"></div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .tabs {
      background: #fff;
      border-radius: 4px;
      padding-top: 20px;
    }

    .tab-group{
        padding-left: 0px;
        margin-bottom:0px;
    }

    .tab {
      display: inline-block;
      padding: 5px 15px;
      text-align: center;
      color: #555;
      border: 1px solid transparent;
      cursor: pointer;
    }

    .icon {
      margin-right: 10px;
    }

    .tab.active {
      border: 1px solid #ddd;
      border-top: 2px solid #f44336;
      border-bottom: 1px solid #fff;
    }

    .tab-content {
      /* display: none; */
      padding: 20px;
      border: 1px solid #ddd;
      line-height: 1.6rem;
    }
  `]
})
export class TabsComponent {
  @Input() tabs: Tab[]=[];

  changeTab(index: number) {
    this.tabs = this.tabs.map((tab, i) => i === index ? { ...tab, active: true } : { ...tab, active: false });
  }
}
