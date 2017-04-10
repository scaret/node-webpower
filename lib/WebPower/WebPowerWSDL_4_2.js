var soap = require("soap");

function WebPowerSoap(options){
    this.options = options;
    this.wsdl_url = options.wsdl_url || 'https://cndemo.dmdelivery.com/x/soap-v4.2/wsdl.php';
}

module.exports = WebPowerSoap;

WebPowerSoap.prototype.getClient = function(callback){
    var self = this;
    if (self._soapClient){
        callback(null, self._soapClient);
    }
    else if (self.getting_client){
        self.stashedGetClientReq.push(callback);
    }
    else{
        self.getting_client = true;
        self.stashedGetClientReq = [callback];
        soap.createClient(self.wsdl_url, function(err, client){
            var obj = client.describe().DMdeliverySoapAPI.DMdeliverySoapAPIPort.flushGroup.input;
            //console.log("XXX", JSON.stringify(obj, null ,2));

            //console.log("YYY", client.describe().DMdeliverySoapAPI.DMdeliverySoapAPIPort.addRecipients.input.recipientDatas.children[0].children);
            //return;
            self.getting_client = false;
            for(var i in self.stashedGetClientReq)
            {
                var callback = self.stashedGetClientReq[i];

                if (callback){
                    if (err){
                        callback(err);
                    }
                    else{
                        callback(null, client);
                    }
                }
            }
            self.stashedGetClientReq = null;
        });
    }
};

var methods = [
    'checkHealth',
    'addOverallRecipient',
    'editOverallRecipient',
    'addOverallRecipientToGroups',
    'removeOverallRecipientFromGroups',
    'editRecipient',
    'getBrands',
    'getCampaigns',
    'getSenderAddresses',
    'getOverallRecipientCampaigns',
    'getRecipientsByMatch',
    'getRecipientFields',
    'sendSingleMailing',
    'sendSingleSMS',
    'sendMailing',
    'sendSystemMail',
    'sendSingleMail',
    'sendMailingScheduled',
    'sendSMS',
    'createMailing',
    'slurpMailing',
    'removeRecipientFromGroups',
    'addRecipientToGroups',
    'moveRecipientsToGroup',
    'getMailings',
    'getSMSMailings',
    'getRecipientsFromGroup',
    'getRecipients',
    'getRecipientGroups',
    'getMailingStatsSummary',
    'getGroups',
    'getMailingResponse',
    'getMailingBounce',
    'deleteMailing',
    'addGroup',
    'flushGroup',
    'deleteGroup',
    'addRecipient',
    'addRecipientAttachment',
    'addMailingAttachment',
    'addNotification',
    'deleteMailingAttachments',
    'getMailingAttachmentIDs',
    'addRecipients',
    'addRecipientsSendMailing',
    'addRecipientsSendSMS',
    'importRemoteCSV',
    'importRemoteCSVSendMailing',
    'getEvents',
    'addEventAttendee',
    'getEventAttendees',
    'getFilters',
    'createSenderAddress',
    'createCampaign',
    'copyFieldDefinition',
    'sendSinglePush',
    'sendPushMailing'
    ];

for (var i in methods){
    (function(method){
        WebPowerSoap.prototype[method] = function(options, callback){
            var self = this;
            self.getClient(function(err, client){
                if (err){
                    callback(err);
                }
                else{
                    if (!options.login){
                        options.login = {
                            username: self.options.username,
                            password: self.options.password
                        };
                    }
                    client[method](options, function(err, obj, xml){
                        callback(err, obj, xml);
                    });
                }
            });
        };
    })(methods[i]);
}

