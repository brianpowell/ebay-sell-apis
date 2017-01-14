let _ = require('lodash');
let debug = require('debug')('ebay-sell-apis:extensions:account_payment');

// Account
module.exports = function ( enums ){

    /*
        Payment Policy - MAIN 
        Build structure of an Payment Policy
        Default:
            immediatePay = true
    */
    function _buildPaymentPolicy( paypol, deposit, fullPaymentDueIn, paymentMethods ) {

        // Handoffs for extending
        if ( !paypol.deposit && deposit ) {
            paypol.deposit = deposit;
        }
        if ( !paypol.fullPaymentDueIn && fullPaymentDueIn ) {
            paypol.fullPaymentDueIn = fullPaymentDueIn;
        }
        if ( !paypol.paymentMethods && paymentMethods ) {
            paypol.paymentMethods = paymentMethods;
        }

        if( paypol.marketplaceId && !_.includes( enums.marketplace_ids, String( paypol.marketplaceId ).toUpperCase() ) ) {
            debug("Unsupported paypol.marketplaceId", paypol.marketplaceId)
            return false;
        }

        return _.extend( { 
                "categoryTypes": [],
                "deposit": {},
                "description": "",
                "fullPaymentDueIn": {},
                "immediatePay": true,
                "marketplaceId": "",
                "name": "",
                "paymentInstructions": "",
                "paymentMethods": []
                }, paypol );
    }

    /* 
        Deposit
        Build structure of a Deposit
        Defaults:
            quantity: 1
    */
    function _buildDeposit( paymentMethods, amount, dueIn ) {

        return { /* Deposit */
            "amount":           amount || {},
            "dueIn":            dueIn || {},
            "paymentMethods":   paymentMethods || []
            }
    }

    /* 
        Payment Method
        Build structure of a Payment Method
    */
    function _buildPaymentMethod( paymentMethodType, brands, referenceId, referenceType ) {

        // Make sure we are using an array of brands
        if( paymentMethodType == "CREDIT_CARD" && _.isString( brands ) ) {
            brands = [ brands ];
        }

        if( paymentMethodType == "CREDIT_CARD" ) {
            let error = "";
            _.each( brands, function( brand ) {
                if( !_.includes( enums.payment_brands, String( brand ).toUpperCase() ) )  {
                    error = brand;
                }
            })

            if( error ) {
                debug("Unsupported brand", error);
                return false;
            }
        }

        let recRef = {}
        if( referenceId && referenceType ) {
            recRef = {
                "referenceId": referenceId,
                "referenceType": referenceType
                };
        }

        return {
            "brands": brands || [],
            "paymentMethodType": paymentMethodType || "",
            "recipientAccountReference": recRef
            }
    }

    // return main methods
    return {
        buildPaymentPolicy: _buildPaymentPolicy,
        buildDeposit:       _buildDeposit,
        buildPaymentMethod: _buildPaymentMethod
    }

}