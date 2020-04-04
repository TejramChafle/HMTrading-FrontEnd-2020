import { Component, OnInit } from '@angular/core';
import { DrawService } from 'src/app/services/draw.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { AppService } from 'src/app/app.service';
import { DrawSchemeComponent } from 'src/app/forms/draw-scheme/draw-scheme.component';

@Component({
    selector: 'app-scheme',
    templateUrl: './scheme.component.html',
    styleUrls: ['./scheme.component.css']
})

export class SchemeComponent implements OnInit {

    public loading = false;
    schemes: Array<any>;
    installments: Array<any>;
    constructor(
        private _drawService: DrawService,
        private _modalService: NgbModal,
        public _appService: AppService,
        private router: Router) {
    }

    ngOnInit() {
        this.getScheme();
        this.getSchemeInstallments(1);
    }

    getScheme() {
        this.loading = true;
        const params = {};
        this._drawService.getSchemes().subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.schemes = data;
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get scheme information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('scheme ERROR');
                console.log(error);
                console.log('--------------------------------------------------------');
            });
    }

    editScheme(id) {
        this.router.navigate(['scheme', id]);
    }


    schemeInstallments(id) {
        this.router.navigate(['scheme-installments', id]);
    }

    deleteScheme(scheme) {
        const modalRef = this._modalService.open(ConfirmComponent, { centered: true, size: 'sm' });
        modalRef.componentInstance.type = 'Delete?';
        modalRef.componentInstance.message = 'Are you sure you want to delete scheme ' + scheme.name + '?';
        modalRef.result.then((data) => {
            if (data) {
                this.loading = true;
                this._drawService.deleteScheme(scheme.scheme_id).subscribe(
                    data => {
                        this._appService.notify('Scheme deleted successfully.', 'Success!');
                        this.loading = false;
                        // Refresh the scheme list
                        this.getScheme();
                    }, error => {
                        this.loading = false;
                        this._appService.notify('Sorry, we cannot process your request.', 'Error!');
                    });
            }
        });
    }


    getSchemeInstallments(params) {
        this.loading = true;
        this._drawService.getSchemeInstallments(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.installments = data;
            },
            error => {
                this.loading = false;
                console.log(error);
                this._appService.notify('Oops! Unable to get installment information.', 'Error!');
            });
    }

    print() {

        let popupWin = window.open('_blank');
        let printContents = document.getElementById('scheme_table').innerHTML;

        popupWin.document.open();
        popupWin.document.write(this._appService.printContentHeader + printContents + this._appService.printContentFooter);
        popupWin.document.close();
    }


    addScheme(scheme?: any) {
        const modalRef = this._modalService.open(DrawSchemeComponent, { size: 'lg' });
        modalRef.componentInstance.formdata = scheme || {};
        modalRef.result.then((data) => {
            console.log('_modalService data : ', data);
            if (data) {
                this.ngOnInit();
            }
        }).catch((error) => {
            console.log(error);
            // this._appService.notify('Failed to perform operation.', 'Error!');
        });
    }
}
