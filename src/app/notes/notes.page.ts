import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.page.html",
  styleUrls: ["./notes.page.scss"],
})
export class NotesPage implements OnInit {
  @ViewChild("searchBar") searchBar: { nativeElement: HTMLElement };

  searchText = "";
  isSearchActive: boolean;

  constructor() {}

  ngOnInit() {
    this.searchText = "";
    this.isSearchActive = false;
  }

  onSearchClick() {
    this.isSearchActive = !this.isSearchActive;
    this.searchText = "";
    setTimeout(() => {
      const inputElement = this.searchBar.nativeElement?.children[0]
        ?.children[0]?.children[0] as HTMLInputElement;
      console.log(inputElement);
      if (inputElement) {
        console.dir(inputElement.focus());
      }
    }, 100);
  }
}
