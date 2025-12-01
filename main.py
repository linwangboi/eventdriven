import json
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, HashModel
from dotenv import load_dotenv
import consumers

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['*'],
    allow_headers=['*'],
)


redis = get_redis_connection(
    host=os.getenv('REDIS_HOST'),
    port=os.getenv('REDIS_PORT'),
    password=os.getenv('REDIS_PASSWORD'),
    decode_responses=True,
)

class Delivery(HashModel):
    budget: int = 0
    notes: str = ''
    class Meta:
        database = redis

class Event(HashModel):
    delivery_id: str = None
    type: str
    data: str
    class Meta:
        database = redis

@app.get('/deliveries/{pk}/status')
async def get_state(pk: str):
    state = redis.get(f'delivery:{pk}')
    if state:
        return json.loads(state)
    return {}


@app.post('/deliveries/create')
async def create(request: Request):
    body = await request.json()
    delivery = Delivery(budget=body['data']['budget'], notes=body['data']['notes']).save()
    event = Event(delivery_id=delivery.pk, type=body['type'], data=json.dumps(body['data'])).save()
    state = consumers.create_delivery({}, event)
    redis.set(f'delivery:{delivery.pk}', json.dumps(state))
    return state

@app.post('/event')
async def dispatch(request: Request):
    body = await request.json()
    delivery_id = body["delivery_id"]
    