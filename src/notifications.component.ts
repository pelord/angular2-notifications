import {Component} from "angular2/core";
import {Notification} from "./notification";
import {NotificationsService} from "./notifications.service";
import {NotificationComponent} from "./notification.component";


@Component({
    selector: 'simple-notifications',
    directives: [NotificationComponent],
    inputs: ['options'],
    template: `
        <div class="notification-wrapper">
            <simple-notification
                *ngFor="#a of notifications; #i = index"
                [item]="a"
                [timeOut]="timeOut"
                [clickToClose]="clickToClose"
                [maxLength]="maxLength"
                [position]="i">

            </simple-notification>
        </div>
    `,
    styles: [`
        .notification-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
        }
    `]
})

export class NotificationsComponent {
    constructor(
        private _service: NotificationsService
    ) {}

    private listener : any;
    public notifications : Notification[] = [];

    // Received values
    private lastOnBottom: boolean = true;
    public options: any;

    // Sent values
    public timeOut: number = 0;
    public clickToClose: boolean = true;
    public maxLength: number = 0;


    ngOnInit() {
        // Listen for changes in the service
        this.listener = this._service.getChangeEmitter()
            .subscribe(item => {
                if(item == 'clean') this.notifications = [];
                else if(item.add) this.add(item.notification);
                else this.notifications.splice(this.notifications.indexOf(item.notification), 1);
            });

        this.attachChanges();
    }


    // Add the new notification to the notification array
    add(item) {
        item.createdOn = new Date();
        item.id = Math.random().toString(36).substring(3);

        // Check if the notification should be added at the start or the end of the array
        if(this.lastOnBottom) this.notifications.push(item);
        else this.notifications.splice(0, 0, item);
    }

    // Attach all the changes received in the options object
    attachChanges() {
        let keys = Object.keys(this.options);
        keys.forEach(a=>{
            switch (a) {
                case 'lastOnBottom':
                    this.lastOnBottom = this.options.lastOnBottom;
                    break;
                case 'timeOut':
                    this.timeOut = this.options.timeOut;
                    break;
                case 'clickToClose':
                    this.clickToClose = this.options.clickToClose;
                    break;
                case 'maxLength':
                    this.maxLength = this.options.maxLength;
                    break;
            }
        })
    }
}