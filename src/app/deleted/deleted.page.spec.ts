import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeletedPage } from './deleted.page';

describe('DeletedPage', () => {
  let component: DeletedPage;
  let fixture: ComponentFixture<DeletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
