import { Component, OnInit } from '@angular/core';
import { messageListType } from '../core/enums/messageListTypes.enum';

@Component({
  selector: 'app-deleted',
  templateUrl: './deleted.page.html',
  styleUrls: ['./deleted.page.scss'],
})
export class DeletedPage implements OnInit {

  listFilter: messageListType = messageListType.deleted;

  constructor() { }

  ngOnInit() {
  }

}
