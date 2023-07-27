import decimal
import json
import os
import boto3
from boto3.dynamodb.conditions import Key
import datetime

dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-1")


def input_get(event, __):
    query_parameter = event["queryStringParameters"]
    if query_parameter is None:
        return create_response(400, "Query parameter is required")

    room_id = event["queryStringParameters"].get("room_id")
    if room_id is None:
        return create_response(400, "room_id is required")
    table = dynamodb.Table(os.environ["input_table_name"])
    result = table.query(KeyConditionExpression=Key("room_id").eq(int(room_id)))
    input_list = result["Items"]
    return create_response(200, input_list)


def input_register(event, _):
    body = json.loads(event["body"])
    input_table = dynamodb.Table(os.environ["input_table_name"])
    session_table = dynamodb.Table(os.environ["session_table_name"])
    now_dt = datetime.datetime.now()
    ttl = int(datetime.datetime.timestamp(now_dt + datetime.timedelta(days=1)))
    param = {**fload_to_decimal(body), "ttl": ttl}
    input_table.put_item(Item=param)
    apigw = get_apigw_management_client()
    session_list = session_table.query(
        KeyConditionExpression=Key("room_id").eq(int(body["room_id"]))
    )

    for sesson in session_list["Items"]:
        apigw.post_to_connection(
            ConnectionId=sesson["session_id"],
            Data=json.dumps({**param, "action": "input"}, default=decimal_serializer),
        )

    return create_response(200, "Register success!")


def input_delete(event, _):
    query_parameter = event["queryStringParameters"]
    if query_parameter is None:
        return create_response(400, "Query parameter is required")

    room_id = event["queryStringParameters"].get("room_id")
    if room_id is None:
        return create_response(400, "room_id is required")

    scj_id = event["queryStringParameters"].get("scj_id")
    if scj_id is None:
        return create_response(400, "scj_id is required")

    input_table = dynamodb.Table(os.environ["input_table_name"])
    session_table = dynamodb.Table(os.environ["session_table_name"])
    if scj_id == "all":
        body = json.loads(event["body"])
        for id in body["id_list"]:
            param = {"room_id": int(room_id), "scj_id": int(id)}
            input_table.delete_item(Key=param)
    else:
        param = {"room_id": int(room_id), "scj_id": int(scj_id)}
        input_table.delete_item(Key=param)

    apigw = get_apigw_management_client()
    session_list = session_table.query(
        KeyConditionExpression=Key("room_id").eq(int(room_id))
    )
    message = {}
    if scj_id == "all":
        message["action"] = "all_delete"
    else:
        message["action"] = "delete"
    for sesson in session_list["Items"]:
        apigw.post_to_connection(
            ConnectionId=sesson["session_id"],
            Data=json.dumps({**param, **message}, default=decimal_serializer),
        )
    return create_response(200, "Delete success!")


def create_response(status, message):
    return {
        "statusCode": status,
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps(message, default=decimal_serializer),
    }


def decimal_serializer(obj):
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError


def fload_to_decimal(obj):
    new_obj = {}
    for key, value in obj.items():
        if isinstance(value, float):
            new_obj[key] = decimal.Decimal(str(value))
        else:
            new_obj[key] = value
    return new_obj


def get_apigw_management_client():
    return boto3.client(
        "apigatewaymanagementapi", endpoint_url=os.environ["ws_endpoint"]
    )
