import { LightningElement, api, track, wire } from 'lwc';
import fetchAccountAssetHierarchy from '@salesforce/apex/AccountAssetHeirarchyController.fetchAccountAssetHierarchy';
import { getRecord } from 'lightning/uiRecordApi';
export default class AccountAssetHeirarchyComp extends LightningElement {
    @api recordId;
    @track gridColumns = [{
        type: 'text',
        fieldName: 'Name',
        label: 'Name'
    },
    {
        type: 'text',
        fieldName: 'ProductFamily',
        label: 'Product Family'
    },
    {
        type: 'text',
        fieldName: 'ProductCode',
        label: 'Product Code'
    }];
    @track gridData;

    @wire(fetchAccountAssetHierarchy, { accId: '$recordId'  })
    AssetRecords({ error, data }) {

        if (data) {

            this.gridData = JSON.parse(JSON.stringify(data).split('children').join('_children'));

        } else if (error) {
            console.log('Error is ' + JSON.stringify(error));
        } else {
            console.log('No data no error ');
        }

    }

    handleClick(event) {
        var val = event.target.label;
        if (val == 'Expand All') {
            this.clickToExpandAll();
            event.target.label = 'Collapse All';
        }
        else {
            this.clickToCollapseAll();
            event.target.label = 'Expand All';
        }
    }
    clickToExpandAll() {
        const grid = this.template.querySelector('lightning-tree-grid');
        grid.expandAll();
    }

    clickToCollapseAll() {
        const grid = this.template.querySelector('lightning-tree-grid');
        grid.collapseAll();
    }
}