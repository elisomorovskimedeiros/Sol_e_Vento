#Classe Medidor_de_giro extende a classe Medidor
#Essa classe realiza a medida de giro do aerogerador

import time
from Medidor import Medidor

class Medidor_de_giro(Medidor):
    
    def __init__(self, canal, num_polos):
        super(Medidor_de_giro, self).__init__(canal)
        self.num_polos = num_polos #numero de polos existentes no alternador do aerogerador, a quantidade de polos e dividida da frequencia total medida
        self.valor_momentaneo = 0
        self.num_ciclos = 0.0
        self.freq = 0.0
        self.num_polos_default = 12.0
        self.marcador_de_ciclo = False

# Funcionamento do algoritmo:
# a cada ciclo de onda positivo, o marcador_de_ciclo e passado para True, habilitando para que quando entrar no ciclo negatico seja incrementado numCiclos,
#que e a contagem de ciclos feita em meio segundo. O valor obtido e multiplicado por 2 para que seja equivalente a 1 segundo, divido pelo numero de polos
#do alternador e multiplicado por 60 para que tenhamos a medida em minutos.
    def calcular(self):
        
        if self.num_polos == None:
            self.num_polos = self.num_polos_default
	fim = time.time() + 0.5 #tempo atual + meio segundo
	while time.time() < fim:
            
            valor_medido = self.medir()
            if valor_medido > 10 and self.marcador_de_ciclo == True:
                self.marcador_de_ciclo = False
                self.num_ciclos += 1.0
                #print("incrementou freq, valor eh "+  str(freq))
            elif valor_medido < 10:
                #print("deu else")
                self.marcador_de_ciclo = True
            time.sleep(0.001)
	self.freq = (self.num_ciclos*2 / self.num_polos)*60.0
	return (str("%.0f" % self.freq))

#m = Medidor_de_giro(0,12)
#print m.calcular()
