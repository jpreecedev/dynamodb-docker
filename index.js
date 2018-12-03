(async () => {
  let params = {};

  var AWS = require("aws-sdk");

  var ddb = new AWS.DynamoDB({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
  });

  var result = await ddb.listTables().promise();
  if (!result.TableNames.length) {
    console.log("Creating table");

    params = {
      AttributeDefinitions: [
        {
          AttributeName: "CUSTOMER_ID",
          AttributeType: "N"
        },
        {
          AttributeName: "CUSTOMER_NAME",
          AttributeType: "S"
        }
      ],
      KeySchema: [
        {
          AttributeName: "CUSTOMER_ID",
          KeyType: "HASH"
        },
        {
          AttributeName: "CUSTOMER_NAME",
          KeyType: "RANGE"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: "CUSTOMER_LIST",
      StreamSpecification: {
        StreamEnabled: false
      }
    };

    // Call DynamoDB to create the table
    await ddb.createTable(params).promise();
    console.log("Created table");
  }

  params = {
    TableName: "CUSTOMER_LIST",
    Item: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" }
    }
  };

  console.log("Adding customer");
  // Call DynamoDB to add the item to the table
  await ddb.putItem(params).promise();

  params = {
    TableName: "CUSTOMER_LIST",
    Key: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" }
    },
    ProjectionExpression: "CUSTOMER_ID, CUSTOMER_NAME"
  };

  // Call DynamoDB to read the item from the table
  var customer = await ddb.getItem(params).promise();
  console.log("Found customer", customer);

  params = {
    TableName: "CUSTOMER_LIST",
    Key: {
      CUSTOMER_ID: { N: "001" },
      CUSTOMER_NAME: { S: "Richard Roe" }
    }
  };

  console.log("Deleting customer");
  // Delete item from the table
  await ddb.deleteItem(params).promise();
})();
