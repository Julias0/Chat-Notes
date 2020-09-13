import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/core/models/message.model';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { MessagesService } from 'src/app/core/services/messages.service';
import { take } from 'rxjs/internal/operators/take';

import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  @Input() message: Message;

  constructor(
    public actionSheetController: ActionSheetController,
    private messagesService: MessagesService,
    private alertController: AlertController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async presentDeleteAlertConfirm() {
    const that = this;
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Are you sure you want to delete this message?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            that.messagesService
              .deleteMessage(that.message.id)
              .pipe(
                take(1)
              )
              .subscribe(() => {
                that.toastController.create({
                  message: 'Message is deleted successfully',
                  color: 'dark',
                  position: 'top',
                  duration: 800
                }).then((toast) => {
                  toast.present();
                });
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentRestoreAlertConfirm() {
    const that = this;
    const alert = await this.alertController.create({
      header: 'Restore',
      message: 'Are you sure you want to restore this message?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            that.messagesService
              .restoreMessage(that.message.id)
              .pipe(
                take(1)
              )
              .subscribe(() => {
                that.toastController.create({
                  message: 'Message is restored successfully',
                  color: 'dark',
                  position: 'top',
                  duration: 800
                }).then((toast) => {
                  toast.present();
                });
              });
          }
        }
      ]
    });

    await alert.present();
  }

  getDeleteAction() {
    const that = this;
    if (!this.message.soft_deleted) {
      return {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          await that.presentDeleteAlertConfirm();
        }
      };
    } else {
      return {
        text: 'Restore',
        icon: 'arrow-undo-outline',
        handler: async () => {
          await that.presentRestoreAlertConfirm();
        }
      };
    }
  }

  getFavouriteAction() {
    const that = this;
    return {
      text: that.message.favourite ? 'Un-favourite' : 'Favourite',
      icon: 'heart',
      handler: () => {
        that.messagesService.favouriteMessage(that.message.id).subscribe(() => {
          that.toastController.create({
            message: 'Message is updated successfully',
            color: 'dark',
            position: 'top',
            duration: 800
          }).then((toast) => {
            toast.present();
          });
        });
      }
    };
  }

  getShareAction() {
    const that = this;
    return {
      text: 'Share',
      icon: 'share-social',
      handler: async () => {
        await Share.share({
          text: this.message.main_message,
          dialogTitle: 'Share your note'
        });
      }
    };
  }

  async openActionSheet() {
    const that = this;
    const buttons = [];
    buttons.push(that.getShareAction());
    buttons.push(that.getDeleteAction());
    buttons.push(that.getFavouriteAction());
    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'What do you want to do to this message?',
      buttons
    });

    await actionSheet.present();
  }

}
