import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { IonSearchbar, ModalController } from "@ionic/angular";
import { fromEvent } from "rxjs";
import { distinctUntilChanged, map, startWith } from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild("search") searchbar: IonSearchbar;

  results = [];

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  getData(text: string) {
    return [
      "Margot",
      "Angel",
      "Honey",
      "Ellie",
      "Gladis",
      "Gigi",
      "Sheba",
      "Callie",
      "Millie",
      "Bailey",
      "June",
      "Georgia",
      "Roxie",
      "Piper",
      "Maisy",
      "Eleanor",
      "Beverly",
      "Sally",
      "Penny",
      "Ralphie",
      "Wally",
      "Bubba",
      "Odie",
      "Andy",
      "Winston",
      "Aimsley",
      "Charlie",
      "Theodore",
      "Tubby",
      "Ricky",
      "Bobby",
      "George",
      "Alvin",
    ].filter(name => name.toLowerCase().includes(text.toLowerCase()));
  }

  async ngAfterViewInit() {
    const searchBarElement = await this.searchbar.getInputElement();
    fromEvent(searchBarElement, "keyup")
      .pipe(
        map((event: any) => event.srcElement.value),
        startWith(''),
        distinctUntilChanged(),
        map((text: string) => this.getData(text))
      )
      .subscribe(cats => {
        this.results = cats;
      });
  }


  onItemClick(cat: string) {
    this.modalController.dismiss(cat);
  }
}
