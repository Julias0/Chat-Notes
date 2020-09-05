import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {

  searchText = '';
  isSearchActive: boolean;

  constructor() { }

  ngOnInit() {
    this.searchText = '';
    this.isSearchActive = false;
  }

}
