import json
import datetime

class Ticket():

    def __init__(self, ticket_dict):
        
        self.atm = ticket_dict['atm']
        self._id = str(ticket_dict['TICKET_KEY'])
        self.falla = ticket_dict['FALLA']
        self.remedy = ticket_dict['RemedyIncident']
        self.fecha_inicio = ticket_dict['fecha_inicio']
        self.fecha_fin = ticket_dict['Fecha_fin']
        self.horas_netas = ticket_dict['Horas_Netas']
        self.remedy = ticket_dict['RemedyIncident']
        self.semaforo = ticket_dict['Semaforo']
        self.archivo = ticket_dict['file_name']

    def ticket_to_json(self):
        return json.dumps(vars(self), ensure_ascii=False, default=str)

