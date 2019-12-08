import { Component, OnInit, Input } from '@angular/core';
import { DrawService } from '../../services/draw.service';
import { AppService } from 'src/app/app.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-draw-scheme',
    templateUrl: './draw-scheme.component.html'
})

export class DrawSchemeComponent implements OnInit {
    public loading = false;
    @Input() formdata: any = {};
    isFineInvalid: Boolean = false;
    isPriceInvalid: Boolean = false;

    constructor(private _drawService: DrawService, public _appService: AppService, public _activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

    addScheme() {
        console.log('-----------------------------------------------------------------');
        console.log('FORM DATA');
        console.log(this.formdata);
        console.log('-----------------------------------------------------------------');

        if (isNaN(this.formdata.total_price) || this.formdata.total_price <= 0) {
            this.isPriceInvalid = true;
            return false;
        } else {
            this.isFineInvalid = false;
            this.isPriceInvalid = false;
        }

        if (isNaN(this.formdata.fine) || this.formdata.fine <= 0) {
            this.isFineInvalid = true;
            return false;
        } else {
            this.isFineInvalid = false;
            this.isPriceInvalid = false;
        }

        if (parseFloat(this.formdata.fine) >= parseFloat(this.formdata.total_price)) {
            this._appService.notify('Fine should be less than the total price!', 'Alert!');
            return false;
        }

        this.loading = true;
        this._drawService.addScheme(this.formdata).subscribe(
            data => {
                this.loading = false;
                this._appService.notify('Scheme has been added successfully.', 'Success!');
                console.log(data);
                this._activeModal.close(true);
            },
            error => {
                this.loading = false;
                console.log(error._body);
                this._appService.notify('Failed to save scheme information.', 'Error!');
            });
    }

}
