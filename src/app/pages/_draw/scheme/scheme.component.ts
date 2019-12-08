import { Component, OnInit } from '@angular/core';
import { DrawService } from '../../../services/draw.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';
import { AppService } from 'src/app/app.service';
import { DrawSchemeComponent } from '../../../forms/draw-scheme/draw-scheme.component';

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
        popupWin.document.write(`
            <html>
                <head>
                    <title></title>
                    <!-- Bootstrap 3.0 -->
                    <!-- Latest compiled and minified CSS -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
                    <style>
                        @media all {
                            table, td, th {
                                border: 1px gray;
                                border-collapse: collapse;
                            }
                            .bg-dark{ background-color: gray!important; color: #ebdef0 !important}
                            /* Print Page CSS */
                            .print-footer, .print-header {
                                border: 1px solid #76d7c4;
                            }

                            .header-trapezoid {
                                border-bottom: 175px solid #76d7c4;
                                height: 175px;
                                border-left: 60px solid transparent;
                                width: 50%;
                                display: inline-block;
                                color: white;
                            }

                            .header-trapezoid > h1 {
                                line-height: 175px;
                            }

                            .footer-trapezoid {
                                border-bottom: 60px solid #76d7c4;
                                height: 60px;
                                border-left: 25px solid transparent;
                                width: 50%;
                                display: inline-block;
                                color: white;
                            }

                            .footer-trapezoid > p {
                                color: white;
                                line-height: 50px;
                            }

                            .print-terms {
                                padding-left: 15px;
                                width: 50%;
                                height: 60px;
                                text-align: left;
                                word-wrap: break-word;
                                display: inline-block;
                            }

                            .biller-info {
                                padding: 5px 0 0 15px;
                                width: 50%;
                                height: 175px;
                                text-align: left;
                                word-wrap: break-word;
                                display: inline-block;
                            }
                            .hmtrading-text-right {
                                text-align: right !important;
                            }
                        }
                    </style>
                </head>
                <body onload="window.print();window.close()">
                <div align="center">
                <br><br>
                    <b><u>H.M. TRADING</u></b><br>
                    House No. 1, Behind Petrol Pump, Kandri- 441401<br>
                    Pro: Pramod Ingole<br>
                    Office: 8806091880, 9960566547 <br>
                    Email: contact@hmtrading.biz<br>
                    www.hmtrading.biz
                </div>
                <br>
                ${printContents}
                </body>
            </html>`
        );
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
