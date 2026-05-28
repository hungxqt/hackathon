import boto3
import json
import os
import urllib.parse
import psycopg2
import secrets
import string

sm = boto3.client("secretsmanager")


def lambda_handler(event, context):
    arn = event["SecretId"]
    token = event["ClientRequestToken"]
    step = event["Step"]

    metadata = sm.describe_secret(SecretId=arn)
    versions = metadata["VersionIdsToStages"]

    if token not in versions:
        raise ValueError("Secret version token not found")

    if "AWSCURRENT" in versions[token]:
        return

    if "AWSPENDING" not in versions[token]:
        raise ValueError("Secret version token must have AWSPENDING stage")

    if step == "createSecret":
        create_secret(arn, token)
    elif step == "setSecret":
        set_secret(arn, token)
    elif step == "testSecret":
        test_secret(arn, token)
    elif step == "finishSecret":
        finish_secret(arn, token)
    else:
        raise ValueError("Invalid step")


def create_secret(arn, token):
    try:
        sm.get_secret_value(
            SecretId=arn,
            VersionId=token,
            VersionStage="AWSPENDING"
        )
        return
    except sm.exceptions.ResourceNotFoundException:
        pass

    current_uri = sm.get_secret_value(
        SecretId=arn,
        VersionStage="AWSCURRENT"
    )["SecretString"]

    new_password = generate_password()
    new_uri = replace_password(current_uri, new_password)

    sm.put_secret_value(
        SecretId=arn,
        ClientRequestToken=token,
        SecretString=new_uri,
        VersionStages=["AWSPENDING"]
    )


def set_secret(arn, token):
    current_uri = sm.get_secret_value(
        SecretId=arn,
        VersionStage="AWSCURRENT"
    )["SecretString"]

    pending_uri = sm.get_secret_value(
        SecretId=arn,
        VersionId=token,
        VersionStage="AWSPENDING"
    )["SecretString"]

    current = parse_pg_uri(current_uri)
    pending = parse_pg_uri(pending_uri)

    if current["host"] != pending["host"]:
        raise ValueError("Host mismatch")

    if current["username"] != pending["username"]:
        raise ValueError("Username mismatch")

    conn = psycopg2.connect(
        host=current["host"],
        port=current["port"],
        dbname=current["dbname"],
        user=current["username"],
        password=current["password"],
        connect_timeout=5
    )

    try:
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute(
                "ALTER USER %s WITH PASSWORD %s",
                (
                    psycopg2.extensions.AsIs(current["username"]),
                    pending["password"]
                )
            )
    finally:
        conn.close()


def test_secret(arn, token):
    pending_uri = sm.get_secret_value(
        SecretId=arn,
        VersionId=token,
        VersionStage="AWSPENDING"
    )["SecretString"]

    pending = parse_pg_uri(pending_uri)

    conn = psycopg2.connect(
        host=pending["host"],
        port=pending["port"],
        dbname=pending["dbname"],
        user=pending["username"],
        password=pending["password"],
        connect_timeout=5
    )

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
    finally:
        conn.close()


def finish_secret(arn, token):
    metadata = sm.describe_secret(SecretId=arn)

    current_version = None
    for version_id, stages in metadata["VersionIdsToStages"].items():
        if "AWSCURRENT" in stages:
            current_version = version_id
            break

    if current_version == token:
        return

    sm.update_secret_version_stage(
        SecretId=arn,
        VersionStage="AWSCURRENT",
        MoveToVersionId=token,
        RemoveFromVersionId=current_version
    )


def parse_pg_uri(uri):
    parsed = urllib.parse.urlparse(uri)

    return {
        "username": urllib.parse.unquote(parsed.username),
        "password": urllib.parse.unquote(parsed.password),
        "host": parsed.hostname,
        "port": parsed.port or 5432,
        "dbname": parsed.path.lstrip("/")
    }


def replace_password(uri, new_password):
    parsed = urllib.parse.urlparse(uri)

    username = urllib.parse.quote(parsed.username)
    password = urllib.parse.quote(new_password, safe="")

    netloc = f"{username}:{password}@{parsed.hostname}:{parsed.port or 5432}"

    return urllib.parse.urlunparse((
        parsed.scheme,
        netloc,
        parsed.path,
        parsed.params,
        parsed.query,
        parsed.fragment
    ))


def generate_password(length=32):
    alphabet = string.ascii_letters + string.digits + "_-+=."
    return "".join(secrets.choice(alphabet) for _ in range(length))