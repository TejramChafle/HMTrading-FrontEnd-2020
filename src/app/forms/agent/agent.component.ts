import { DrawService } from './../../services/draw.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-agent',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
    public loading = false;
    items: Array<any>;
    statuses: Array<any>;

    isEmailInvalid: Boolean = false;
    isPhoneInvalid: Boolean = false;

    @Input() formdata: any = {};
    @Input() agents: Array<any>;
    // tslint:disable-next-line: variable-name
    constructor(public _activeModal: NgbActiveModal, public _drawService: DrawService, public _appService: AppService) {
        this.statuses = [
            { id: 1, name: 'Yes' },
            { id: 0, name: 'No' }
        ];
    }

    ngOnInit() {
    }

    addAgent() {

        console.log('---------------------------------------------------------------');
        console.log(this.formdata);
        console.log('---------------------------------------------------------------');

        const phone = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        if (this.formdata.mobile_number && !phone.test(this.formdata.mobile_number.toLowerCase())) {
            this.isPhoneInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
        }

        const re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (this.formdata.email && !re.test(this.formdata.email.toLowerCase())) {
            this.isEmailInvalid = true;
            return false;
        } else {
            this.isEmailInvalid = false;
            this.isPhoneInvalid = false;
        }

        // Since this is agent, we've to set is_agent_too status as 1 (Yes)
        this.formdata.is_agent_too = 1;
        delete this.formdata.agent;
        delete this.formdata.item;
        console.log('-----------------------------------------------------------------');
        console.log('FORM DATA');
        console.log(this.formdata);
        console.log('-----------------------------------------------------------------');

        this.loading = true;
        this._drawService.addCustomer(this.formdata).subscribe(
            data => {
                console.log(data);

                this.loading = false;
                if (!isNaN(data) && !this.formdata.customer_id) {
                    this._appService.notify('Agent has been added successfully.', 'Success!');
                    this._activeModal.close(true);
                } else if (data === true && this.formdata.customer_id) {
                    this._appService.notify('Agent information updated successfully.', 'Success!');
                    this._activeModal.close(true);
                } else if (data.split(':')[0] === 'Error') {
                    this._appService.notify(data.split(':')[1], 'Error!');
                }
            },
            error => {
                this.loading = false;
                console.log(error._body);
                this._appService.notify('Unable to process your request. Something went wrong!', 'Error!');
            });
    }
}
