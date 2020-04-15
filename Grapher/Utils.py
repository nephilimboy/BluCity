from json import JSONEncoder


class JsonEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__
