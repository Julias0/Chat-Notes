import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { fromEvent, noop, merge, concat } from "rxjs";
import {
  map,
  filter,
  tap,
  concatMap,
  mergeMap,
  switchMap,
} from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessagesService } from "src/app/core/services/messages.service";

@Component({
  selector: "app-message-input",
  templateUrl: "./message-input.component.html",
  styleUrls: ["./message-input.component.scss"],
})
export class MessageInputComponent implements OnInit, AfterViewInit {
  @ViewChild("addMessage") addMessageBtn;
  @ViewChild("messageInput") messageInput;

  slashCommands = [
    {
      command: "/help",
      description: "Show all available commands",
      action: () => {
        this.messagesService.addEphmeralMessage("help");
      }
    },
    {
      command: "/list",
      description: "Show all messages",
      action: () => {
        this.messagesService.addEphmeralMessage("list");
      }
    },
    {
      command: "/backup",
      description: "Backup all messages",
      action: () => {
        this.messagesService.addEphmeralMessage("backup");
      }
    },
    {
      command: "/restore",
      description: "Restore all messages",
      action: () => {
        this.messagesService.addEphmeralMessage("restore");
      }
    },
    {
      command: "/hi",
      description: "Say hi to the bot",
      action: () => {
        this.messagesService.addEphmeralMessage("hi");
      }
    },
  ];

  possibleSlashCommands = [];

  fg: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.fg = this.formBuilder.group({
      currentMessage: ["", Validators.required],
    });

    this.messagesService.getSetCurrentMessage().subscribe(message => {
      this.fg.controls.currentMessage.setValue(message);
      console.log(this.messageInput.el.querySelector('textarea').focus());
    });
  }

  handleAction(slashCommand) {
    slashCommand.action();
    this.fg.controls.currentMessage.reset();
  }

  ngAfterViewInit(): void {
    const sendButtonClick$ = fromEvent(this.addMessageBtn.el, "click");

    const messageSend$ = merge(sendButtonClick$).pipe(
      filter(() => this.fg.controls.currentMessage.valid),
      map(() => this.fg.controls.currentMessage.value),
      tap(console.log),
      tap(() => this.fg.controls.currentMessage.reset()),
      switchMap((message) => {
        return this.messagesService.addMessage(message);
      })
    );

    // enable to start with slash command
    // this.fg.valueChanges
    //   .pipe(map((value) => value.currentMessage))
    //   .subscribe((message: string) => {
    //     if (message?.startsWith("/")) {
    //       this.possibleSlashCommands = this.slashCommands.filter(
    //         (slashCommand) => slashCommand.command.includes(message)
    //       );
    //     } else {
    //       this.possibleSlashCommands = [];
    //     }
    //   });

    messageSend$.subscribe(noop);
  }
}
