import random
from pymongo import MongoClient
from faker import Faker
from faker.providers import person

client = MongoClient('MONGO_URI')
db = client.feedciti

fake = Faker()
fake.add_provider(person)

#seed the user-entered donation data
coll = db.posts

status = [ 'food', 'clothes', 'money', 'meds' ]
photos = [   
    'fake_man1.png', 'fake_man2.png', 'fake_man3.png',
    'fake_woman1.png', 'fake_woman2.png', 'fake_woman3.png'
]

dictlist = [dict() for x in range(125)]
for i in range(125):
    user_email = fake.email()
    user_image = photos[random.randint(0,5)]
    first_name = fake.first_name()
    lat = float(fake.latitude())
    lon = float(fake.longitude())
    message = fake.sentence()
    date = fake.date_time_between(start_date='-3d', end_date='now', tzinfo=None)
    give_type = random.randint(0,3)
    anonymous = fake.boolean()
    dictlist[i] = {
        'user_email': user_email,
        'user_image': user_image,
        'first_name': first_name,
        'lat': lat,
        'lon': lon,
        'message': message,
        'date': date,
        'give_type': give_type,
        'anonymous': anonymous
    }
    i += 1

result = coll.insert_many(dictlist)
print(result.inserted_ids)


