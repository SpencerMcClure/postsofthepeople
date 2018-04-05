'use strict';

const QS = require('querystring')
const AWS = require('aws-sdk');  
const dynamo = new AWS.DynamoDB.DocumentClient();


module.exports.helloworld = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Fuck yea!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

function sendBody(callback, body)
{
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
        },
        body: JSON.stringify(body),
    };

    callback(null, response);
}


module.exports.pages = (event, context, callback) => 
{
    try
    {
        const request_path = event.path;

        if ( request_path === "/pages/get" )
        {
            const page_id = QS.parse(event.body).page_id;
            const params = {
                TableName : 'pages',
                Key : {
                    page_id : page_id
                }
            };

            dynamo.get(params, function(err, data){
                let content = null;
                if ( !err && data && data.Item && data.Item.content)
                {
                    content = data.Item.content;
                }

                sendBody(callback, {
                    content: content,
                    error: err,
                    input: event
                });
            });

        }
        else if ( request_path === "/pages/update" )
        {
            const inp = QS.parse(event.body);
            const params = {
                TableName : 'pages',
                Item : {
                    page_id : inp.page_id,
                    content : inp.content
                }
            };

            dynamo.put(params, function(err, data){
                sendBody(callback, {
                    success : !err,
                    error : err,
                    input: event,
                });
            });

        }
        else if ( request_path === "/pages/delete" )
        {
            const inp = QS.parse(event.body);
            const params = {
                TableName : 'pages',
                Key : {
                    page_id : inp.page_id,
                }
            };

            dynamo.delete(params, function(err, data){
                sendBody(callback, {
                    success : !err,
                    error : err,
                    input: event,
                });
            });
        }
        else
        {
            sendBody(callback, {
                error : 'Request path not supported.',
                input: event,
            });
        }
    }
    catch(e)
    {
        sendBody(callback, {
            error : 'Caught error: ' + e,
            input: event,
        });
    }

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};