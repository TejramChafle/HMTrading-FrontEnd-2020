import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentComponent } from '../../../forms/agent/agent.component';
import { AppService } from '../../../app.service';
import { DrawService } from '../../../services/draw.service';
import { Router, ActivatedRoute } from '@angular/router';
import { limit } from 'src/app/app.config';
import { ConfirmComponent } from '../../../components/confirm/confirm.component';

@Component({
    selector: 'app-agents',
    templateUrl: './agents.component.html',
    styleUrls: ['./agents.component.css']
})

export class AgentsComponent implements OnInit {
    public loading = false;
    agents: any[];
    pagination: any = {};
    limit: number = limit;
    // Router
    sub;
    id;
    search: Boolean = false;

    // Form fields
    data: any = {};
    isPhoneInvalid: Boolean = false;
    isEmailInvalid: Boolean = false;

    constructor(private _modalService: NgbModal, public _appService: AppService, public _drawService: DrawService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id) {
                this.getAgents({ is_agent_too: 1, limit: this.limit, offset: 0, page: 1, agent_id: this.id });
            } else {
                this._appService.agent = null; // Reset the previous agent
                this.getAgents({ is_agent_too: 1, limit: this.limit, offset: 0, page: 1 });
            }
        });
    }


    getAgents(params) {
        this.loading = true;
        this._drawService.getCustomers(params).subscribe(
            data => {
                this.loading = false;
                console.log(data);
                this.agents = data.records;
                this.pagination = data.pagination;
                if (this.id && !this._appService.agent) {
                    this._appService.agent = JSON.parse(localStorage.getItem('_appService.agent'));
                }
            },
            error => {
                this.loading = false;
                this._appService.notify('Oops! Unable to get the agent information.', 'Error!');
                console.log('--------------------------------------------------------');
                console.log('AGENTS');
                console.log(error);
                console.log('--------------------------------------------------------');
            }
        );
    }

    viewCustomers(agent) {
        // Save the selected agent to display result
        this._appService.agent = agent;
        this._appService.agents = this.agents;
        this.router.navigate(['customers', JSON.stringify(agent)]);
    }

    viewInstallments(agent) {
        // Save the selected agent to display result
        this._appService.agent = agent;
        this.router.navigate(['installments', agent.customer_id]);
    }

    viewAgents(agent) {
        // Save the selected agent to display result
        this._appService.agent = agent;
        localStorage.setItem('_appService.agent', JSON.stringify(agent));
        this.router.navigate(['agents', agent.customer_id]);
    }

    viewPayment(agent) {
        // Save the selected agent to display result
        this._appService.agent = agent;
        this.router.navigate(['payments', agent.customer_id]);
    }

    deleteAgent(agent) {
        const modalRef = this._modalService.open(ConfirmComponent, { centered: true, size: 'sm' });
        modalRef.componentInstance.type = 'Delete?';
        modalRef.componentInstance.message = 'Are you sure you want to delete agent ' + agent.name + '?';
        modalRef.result.then((data) => {
            if (data) {
                this.loading = true;
                this._drawService.deleteCustomer(agent.customer_id).subscribe(
                    data => {
                        this._appService.notify('Agent deleted successfully.', 'Success!');
                        this.loading = false;
                        // Refresh the customer list
                        this.getAgents({
                            is_agent_too: 1,
                            limit: this.limit,
                            offset: 0,
                            page: 1
                        });
                    },
                    error => {
                        this.loading = false;
                        this._appService.notify('Sorry, we cannot process your request.', 'Error!');
                    }
                );
            }
        });
    }

    pageChange(page) {
        let params: any = {};
        params = {
            is_agent_too: 1,
            limit: this.limit,
            offset: this.limit * (parseInt(page, 10) - 1),
            page: page
        };
        if (this.id) {
            params.agent_id = this.id;
        }
        this.getAgents(params);
    }


    // Add / Update agent information
    addAgent(agent?: any) {
        const modalRef = this._modalService.open(AgentComponent, { size: 'lg' });
        modalRef.componentInstance.formdata = agent || {};
        modalRef.componentInstance.agents = this.agents;
        modalRef.result.then((data) => {
            if (data) {
                this.ngOnInit();
            }
        }).catch((error) => {
            console.log(error);
            // this._appService.notify('Failed to perform operation.', 'Error!');
        });
    }

}
