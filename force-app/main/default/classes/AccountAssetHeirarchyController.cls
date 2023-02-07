/*@description: Controller for Account Asset Hierarchy
 
 *@author: Abha Rajawat
 
 *@date: 05-08-2021

 * */
public with sharing class AccountAssetHeirarchyController {
    
    /*
     * @Method Name:fetchAccountAssetHierarchy
      
     * @description: fetches Assets , Products related to Account in heirarchy
      
     * @param: Account Id(String) 
     
     * @return: Wrapper of Products in heirarchy->List < HierarchyWrapper >
     
     * */

    @AuraEnabled(cacheable=true)
    public static List < HierarchyWrapper > fetchAccountAssetHierarchy( String accId ) {
        
        List < HierarchyWrapper > listWrap = new List < HierarchyWrapper >(); //List of wrapper to hold products in heirarchy
        
        Map<Id,Asset> accountAssets =  New Map<Id,Asset>([ SELECT Id,ParentId, RootAssetId,SerialNumber,Name,ProductCode,ProductFamily,Product2.Name 
                                                          FROM Asset 
                                                          WHERE AccountId =: accId ORDER BY ParentId NULLS FIRST ]);//Map stores all assets and products related to account
        
        //Iterate over all assets to form hierarchy
        
        for(Asset a : accountAssets.values()){
            
            if(a.ParentId==Null){
                
                HierarchyWrapper rootAssetWrap = new HierarchyWrapper();
                rootAssetWrap.Name = a.Product2.Name;
                rootAssetWrap.ProductFamily = a.ProductFamily;
                rootAssetWrap.ProductCode = a.ProductCode;
                rootAssetWrap.children = findRelations( accountAssets.values(), a.RootAssetId );
                listWrap.add( rootAssetWrap );
                
            }
            
        } 
        
        //return list of wrapper
        
        return listWrap;
        
    }
    
     /*
     * @Method Name:findRelations
     
     * @description: recursively finds relations among assets related to account
     
     * @param:  List < Asset > , rootAssetId
     
     * @return: Wrapper of Products in heirarchy->List < HierarchyWrapper >
     
     * */
   
    public static List < HierarchyWrapper > findRelations( List < Asset > listAssets, Id rootAssetId ) {
        
        List < HierarchyWrapper > listWrap = new List < HierarchyWrapper >(); 
        
        //Iterate over list of Assets passed to find relations among them
        
        for ( Asset objAsset : listAssets ) { 
            
            if ( objAsset.ParentId == rootAssetId ) {
                
                HierarchyWrapper wrap = new HierarchyWrapper();
                wrap.Name = objAsset.Product2.Name;
                wrap.ProductFamily = objAsset.ProductFamily;
                wrap.ProductCode = objAsset.ProductCode;
                wrap.children = findRelations( listAssets, objAsset.Id );
                listWrap.add( wrap );
                
            }
            
        }
        
        if ( listWrap.size() > 0 )
            return listWrap;
        else 
            return null;
        
    }
    /*
     * @Wrapper Class:HierarchyWrapper
     
     * @description: forms wrapper object
     
     * */
    
    public class HierarchyWrapper {
        
        @AuraEnabled
        public String Name;
        
        @AuraEnabled
        public String ProductFamily;
        
        @AuraEnabled
        public String ProductCode;
        
        @AuraEnabled
        public List < HierarchyWrapper > children;
        
    }
}