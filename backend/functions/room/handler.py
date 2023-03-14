import decimal
import json
import os
import boto3
from boto3.dynamodb.conditions import Key
import datetime

dynamodb = boto3.resource("dynamodb", region_name="ap-northeast-1")


def room_get(_, __):
    table = dynamodb.Table(os.environ["room_table_name"])
    result = table.scan()
    room_list = result["Items"]
    return create_response(200, room_list)


def room_create(event, _):
    query_parameter = event["queryStringParameters"]
    if query_parameter is None:
        return create_response(400, "Query parameter is required")

    room_name = event["queryStringParameters"].get("room_name")
    if room_name is None:
        return create_response(400, "room_name is required")

    table = dynamodb.Table(os.environ["room_table_name"])
    now_dt = datetime.datetime.now()
    id = int(datetime.datetime.timestamp(now_dt))
    ttl = int(datetime.datetime.timestamp(now_dt + datetime.timedelta(hours=1)))
    param = {"room_id": id, "room_name": room_name, "ttl": ttl}
    table.put_item(Item=param)
    return create_response(200, param)


def room_remove(event, _):
    query_parameter = event["queryStringParameters"]
    if query_parameter is None:
        return create_response(400, "Query parameter is required")

    room_id = event["queryStringParameters"].get("room_id")
    if room_id is None:
        return create_response(400, "room_id is required")

    table = dynamodb.Table(os.environ["room_table_name"])
    param = {"room_id": room_id}
    table.delete_item(Key=param)
    return create_response(200, "Room delete success!")


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
