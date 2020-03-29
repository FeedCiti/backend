import xml.etree.ElementTree as ET
from pymongo import MongoClient

# client = MongoClient('REVERTED FOR PUBLIC REPO')
db = client.feedciti.food_banks

dictlist = [dict() for x in range(200)]

tree = ET.parse('foodbanks.xml')
root = tree.getroot()
count = 0
namespaces = { 'd': 'http://feedingamerica.org/' }
for organization in root.findall('d:Organization', namespaces):
    name = (organization.find('d:FullName', namespaces).text)
    phone = (organization.find('d:Phone', namespaces).text)
    url = (organization.find('d:URL', namespaces).text)
    mail_address = organization.find('d:MailAddress', namespaces)
    lat = float(mail_address.find('d:Latitude', namespaces).text)
    lon = float(mail_address.find('d:Longitude', namespaces).text)
    addr_1 = (mail_address.find('d:Address1', namespaces).text)
    addr_2 = (mail_address.find('d:Address2', namespaces).text)
    city = (mail_address.find('d:City', namespaces).text)
    state = (mail_address.find('d:State', namespaces).text)
    zip_code = (mail_address.find('d:Zip', namespaces).text)
    dictlist[count] = {
        'name': name,
        'phone': phone,
        'url': url,
        'lat': lat,
        'lon': lon,
        'addr_1': addr_1,
        'addr_2': addr_2,
        'city': city,
        'state': state,
        'zip': zip_code
    }
    count += 1

result = db.insert_many(dictlist)
print(result.inserted_ids)
