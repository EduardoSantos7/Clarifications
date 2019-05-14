import os
import pandas as pd


class File():

    # For the moment just data is not allowed
    def __init__(self, data=None,  to_read="", to_save="", allowed=[]):
        self.data = data or pd.DataFrame()
        self.rows = 0
        self.columns = 0
        self.allowed_extensions = allowed or ['xlsx', 'xls', 'csv']
        self.to_read = to_read
        self.to_save = to_save

        if self.to_read:
            self.read(self.to_read)

    def read(self, paths):

        for path in paths:
            file_name = path.split('/')[-1]
            path = path.replace(file_name, '')

            os.chdir(path)

            extension = file_name.split('.')

            if len(extension) != 2:
                print(f"The path {path} is incorrect")
                continue

            if extension[1] in self.extension:
                if extension[1] == "xlsx" or extension[1] == 'xls':
                    self.data = pd.read_excel(extension[0])
                if extension[1] == "csv":
                    self.data = pd.read_csv(extension[0])
            else:
                print(f"Extension {extension[1]} is not allowed")

    def save(self, name=""):

        if name or self.to_save:
            extension = name.split('.')

            if len(extension) != 2:
                print(f"The name: {name} is incorrect")
                return

            if extension[1] in self.extension:
                if extension[1] == "xlsx" or extension[1] == 'xls':
                    pd.to_excel(name)
                if extension[1] == "csv":
                    pd.to_csv(name)
            else:
                print(f"Extension {extension[1]} is not allowed")

    def append(self):
        print("")

f = File()
print(pd.DataFrame([{'d': 1}]).count())
