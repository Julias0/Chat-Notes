import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageInputComponent } from './message-input/message-input.component';
import { MessageContainerComponent } from './message-container/message-container.component';
import { MessageComponent } from './message/message.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    MessageInputComponent,
    MessageContainerComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    MessageInputComponent,
    MessageContainerComponent,
    MessageComponent
  ]
})
export class SharedModule { }
