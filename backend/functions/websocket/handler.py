import decimal
import json
import os
import boto3
from boto3.dynamodb.conditions import Key
import datetime

dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-1")


def connect(event, _):
    query_parameter = event["queryStringParameters"]
    if query_parameter is None:
        return create_response(400, "Query parameter is required")

    room_id = event["queryStringParameters"].get("room_id")
    if room_id is None:
        return create_response(400, "room_id is required")
    table = dynamodb.Table(os.environ["session_table_name"])
    now_dt = datetime.datetime.now()
    ttl = int(datetime.datetime.timestamp(now_dt + datetime.timedelta(hours=1)))
    
    param = {"room_id": int(room_id), "session_id": event["requestContext"]["connectionId"], "ttl": ttl}
    table.put_item(Item=param)
    return create_response(200, "Connection success!")


def dafault(_, __):
    return create_response(400, "Not implemented!")


def disconnect(event, _):
    print(event)
    table = dynamodb.Table(os.environ["session_table_name"])
    request_id = event["requestContext"]["connectionId"]
    session_list = table.scan()["Items"]
    room_id = [session for session in session_list if session["session_id"] == request_id][0]["room_id"]
    param = {"room_id": room_id, "session_id": request_id}
    table.delete_item(Key=param)
    return create_response(200, "Disconnection success!")


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
