import { Component, OnInit } from '@angular/core';
import { messageListType } from '../core/enums/messageListTypes.enum';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  listFilter: messageListType = messageListType.favourites;

  constructor() { }

  ngOnInit() {
  }

}
