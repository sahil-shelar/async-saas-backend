import json
import time
import os

import pika
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
QUEUE_NAME = "job_queue"

# MongoDB setup
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.asyncsaas
jobs_collection = db.jobs

# RabbitMQ setup
connection = pika.BlockingConnection(
    pika.URLParameters(RABBITMQ_URL)
)
channel = connection.channel()
channel.queue_declare(queue=QUEUE_NAME, durable=True)

print("Worker started. Waiting for jobs...")

def process_job(ch, method, properties, body):
    message = json.loads(body)
    job_id = message["jobId"]
    payload = message["payload"]

    try:
        print(f"Processing job {job_id}")

        # Mark job as PROCESSING
        jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"status": "PROCESSING"}}
        )

        # Simulate heavy work
        time.sleep(3)

        result = {
            "processedRecords": payload.get("records", 0),
            "status": "success"
        }

        # Mark job as COMPLETED
        jobs_collection.update_one(
            {"_id": job_id},
            {
                "$set": {
                    "status": "COMPLETED",
                    "result": result
                }
            }
        )

        ch.basic_ack(delivery_tag=method.delivery_tag)
        print(f"Job {job_id} completed")

    except Exception as e:
        print(f"Job {job_id} failed: {e}")

        jobs_collection.update_one(
            {"_id": job_id},
            {"$set": {"status": "FAILED"}}
        )

        ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue=QUEUE_NAME, on_message_callback=process_job)

channel.start_consuming()
