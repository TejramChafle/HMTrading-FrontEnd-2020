import { DrawService } from './../../services/draw.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from 'src/app/app.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
    public loading = false;
    @Input() formdata: any = {};

    // tslint:disable-next-line: variable-name
    constructor(public _activeModal: NgbActiveModal, public _drawService: DrawService, public _appService: AppService) {
    }

    ngOnInit() {
        if (this.formdata && this.formdata.is_exchangeable == 1) {
            this.formdata.is_exchangeable = true;
        } else if (this.formdata && this.formdata.is_exchangeable == 0) {
            this.formdata.is_exchangeable = false;
        }
    }

    addItem() {
        if (this.formdata.is_exchangeable === true || this.formdata.is_exchangeable == 1) {
            this.formdata.is_exchangeable = 1;
        } else {
            this.formdata.is_exchangeable = 0;
        }
        console.log('-----------------------------------------------------------------');
        console.log('FORM DATA');
        console.log(this.formdata);
        console.log('-----------------------------------------------------------------');

        this.loading = true;
        this._drawService.addItem(this.formdata).subscribe(
            data => {
                this.loading = false;
                this._appService.notify('Item has been added successfully', 'Success');
                // this.router.navigate(['items']);
                this._activeModal.close(true);
                console.log(data);
            },
            error => {
                this.loading = false;
                console.log(error._body);
                this._appService.notify('Unable to process your request. Something went wrong!', 'Error!');
            });
    }
}
