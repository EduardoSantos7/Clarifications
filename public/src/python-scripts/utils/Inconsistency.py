import json
from .Ticket import Ticket

class Inconsistency():

    def __init__(self, ticket_dict):

        self._id = str(ticket_dict['TICKET_KEY'])
        self.message = ticket_dict['message']
        self.tickets = []

    def add(self, ticket_dict):

        if not self.message and ticket_dict['message']:
            self.message = ticket_dict['message']
        self.tickets.append(Ticket(ticket_dict).ticket_to_json())
    
    def inconsistency_to_json(self):
        return json.dumps(vars(self), ensure_ascii=False)