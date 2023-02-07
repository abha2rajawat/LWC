import { LightningElement, api, track, wire } from 'lwc';
import fetchAssetHierarchy from '@salesforce/apex/AssetHierarchyController.fetchAssetHierarchy'; 

export default class AssetHerirarchyComp extends LightningElement {
    @api recordId;
    @track gridColumns = [{
        type: 'text',
        fieldName: 'Name',
        label: 'Name'
    },
    {
        type: 'text',
        fieldName: 'SerialNumber',
        label: 'Serial Number'
    }];
    @track gridData;

    // connectedCallback(){
    //     getGridData();
    //     console.log('inside constructor');
    // }

    // getGridData(){
    //     fetchAssetHierarchy({ assetId: '02i2v00000G4vQgAAJ' })
    //         .then((result) => {
    //             this.gridData = JSON.parse( JSON.stringify( data ).split( 'children' ).join( '_children' ) );
    //             //this.error = undefined;
    //         })
    //         .catch((error) => {
    //            console.log('Error::'+JSON.stringify(error));
    //         });
    // }
    @wire(fetchAssetHierarchy, { assetId: '02i2v00000G4vQgAAJ' })  
    AssetRecords( { error, data } ) {  
  
        console.log( 'Inside Wire Method' );
        if ( data ) {  
            
            console.log( 'Data is ' + JSON.stringify( data ) );
            this.gridData = JSON.parse( JSON.stringify( data ).split( 'children' ).join( '_children' ) );
  
        } else if ( error ) {
            console.log( 'Error is ' + JSON.stringify( error ) );
        }else{
            console.log( 'No data no error ');
        }
          
    } 

    /*clickToExpandAll( e ) {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.expandAll();
    }

    clickToCollapseAll( e ) {

        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.collapseAll();
      
    }*/
}